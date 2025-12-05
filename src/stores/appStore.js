import { defineStore } from "pinia";
import { API } from "../services/apiService";
import { Mock } from "../services/mock";
import { onMounted, ref, computed } from "vue";

export const useAppStore = defineStore("app", () => {
  const invoices = ref([]);
  const expenses = ref([]);
  const clients = ref([]);
  const projects = ref([]);
  const isLoading = ref(false);
  const invoicesByProject = ref(new Map());
  const expensesByProject = ref(new Map());

  const getData = async () => {
    isLoading.value = true;
    try {
      const result = await API.getData();

      // Process Clients first for lookup
      clients.value = result.clients;
      const clientMap = new Map(result.clients.map((c) => [c.id, c]));

      // Process Invoices
      const processedInvoices = result.invoices.map((i) => {
        if (i.description.startsWith("Project ")) {
          i.projectNumber =
            i.description.match(/^Project (\d+(\.\d+)?)/)?.[1] * 1;
          i.projectName = i.description
            .replace(`Project ${i.projectNumber} -`, "")
            .replace(" - Upwork Job", "");
        }
        i.amount = i.amount * 1;
        i.paidAmount = i.paidAmount * 1;
        return i;
      });
      invoices.value = processedInvoices;

      // Process Expenses
      const processedExpenses = result.expenses.map((e) => {
        if (e.notes && typeof e.notes === "string") {
          const parts = e.notes.split(" -");
          if (parts.length > 0) {
            const projectNum = Number(parts[0]);
            if (!isNaN(projectNum)) {
              e.projectNumber = projectNum * 1;
              e.projectName = parts[1]?.replace(" - Upwork Job", "");
            }
          }
        }
        e.amount = e.amount * 1;
        return e;
      });
      expenses.value = processedExpenses;

      // Group Invoices by Project
      processedInvoices.forEach((i) => {
        if (i.projectNumber) {
          if (!invoicesByProject.value.has(i.projectNumber)) {
            invoicesByProject.value.set(i.projectNumber, []);
          }
          invoicesByProject.value.get(i.projectNumber).push(i);
        }
      });

      // Group Expenses by Project
      processedExpenses.forEach((e) => {
        if (e.projectNumber) {
          if (!expensesByProject.value.has(e.projectNumber)) {
            expensesByProject.value.set(e.projectNumber, []);
          }
          expensesByProject.value.get(e.projectNumber).push(e);
        }
      });

      // Identify all unique project numbers
      let allProjects = new Map();
      for (let invoice of invoices.value) {
        if (
          invoice.projectNumber &&
          invoice.projectName &&
          !allProjects.has(invoice.projectNumber)
        ) {
          allProjects.set(invoice.projectNumber, invoice.projectName);
        }
      }
      for (let expense of expenses.value) {
        if (
          expense.projectNumber &&
          expense.projectName &&
          !allProjects.has(expense.projectNumber)
        ) {
          allProjects.set(expense.projectNumber, expense.projectName);
        }
      }
      const projectNumbers = new Set([
        ...invoicesByProject.value.keys(),
        ...expensesByProject.value.keys(),
      ]);

      // Build Projects List
      projects.value = Array.from(projectNumbers).map((projectNum) => {
        const pInvoices = invoicesByProject.value.get(projectNum) || [];
        const pExpenses = expensesByProject.value.get(projectNum) || [];

        const pInvoicesTotal = pInvoices.reduce((sum, i) => sum + i.amount, 0);
        const pExpensesTotal = pExpenses.reduce((sum, e) => sum + e.amount, 0);

        let projectName = allProjects.get(projectNum);
        // Find primary client for project
        let client = null;
        // Try to find from invoices first
        for (const inv of pInvoices) {
          if (clientMap.has(inv.customerid)) {
            client = clientMap.get(inv.customerid);
            projectName = inv.projectName;
            break;
          }
        }
        // If not found, try expenses
        if (!client) {
          for (const exp of pExpenses) {
            if (clientMap.has(exp.clientid)) {
              client = clientMap.get(exp.clientid);
              break;
            }
          }
        }

        return {
          number: projectNum,
          name: projectName,
          client: client,
          clientName: client ? client.name : "",
          revenue: pInvoicesTotal,
          expense: pExpensesTotal,
          profit: pInvoicesTotal - pExpensesTotal,
        };
      });
    } finally {
      isLoading.value = false;
    }
  };

  const clientData = computed(() => {
    const clientMap = {};
    const allClients = clients.value;
    const clientLookup = new Map(allClients.map((c) => [c.id, c]));

    // Initialize map with projects data
    projects.value.forEach((p) => {
      if (p.client && p.client.id) {
        if (!clientMap[p.client.id]) {
          clientMap[p.client.id] = {
            id: p.client.id,
            name: p.client.name,
            organization: p.client.organization,
            projects: [],
            totalInvoices: 0,
            totalExpenses: 0,
          };
        }
        clientMap[p.client.id].projects.push(p.number);
      }
    });

    // Aggregate Invoices
    invoices.value.forEach((i) => {
      if (!clientMap[i.customerid]) {
        const foundClient = clientLookup.get(i.customerid);
        if (foundClient) {
          clientMap[i.customerid] = {
            id: i.customerid,
            name: foundClient.name,
            projects: [],
            totalInvoices: 0,
            totalExpenses: 0,
          };
        }
      }
      if (clientMap[i.customerid]) {
        clientMap[i.customerid].totalInvoices += i.amount;
      }
    });

    // Aggregate Expenses
    expenses.value.forEach((e) => {
      if (clientMap[e.clientid]) {
        clientMap[e.clientid].totalExpenses += e.amount;
      }
    });

    return Object.values(clientMap).sort(
      (a, b) => b.totalInvoices - a.totalInvoices
    );
  });

  const employeeData = computed(() => {
    // Group expenses by vendor (employee)
    const employeeMap = new Map();
    const clientLookup = new Map(clients.value.map((c) => [c.id, c]));
    const projectLookup = new Map(projects.value.map((p) => [p.number, p]));

    expenses.value.forEach((e) => {
      if (!employeeMap.has(e.vendor)) {
        employeeMap.set(e.vendor, {
          name: e.vendor,
          projects: new Map(), // Map projectNumber -> projectData
          nonProjectExpenses: [],
          totalExpense: 0,
          projectExpense: 0, // emplyee's part of project expense
          nonProjectExpense: 0, // emplyee's part of non-project expense
          totalProjectRevenue: 0,
          totalProjectExpense: 0,
          expensesCount: 0,
        });
      }
      const empData = employeeMap.get(e.vendor);
      empData.expensesCount++;
      let debugMode = false;
      if (e.vendor == "Tika Koirala") debugMode = true;

      if (!e.client) {
        e.client = clientLookup.get(e.clientid);
      }

      const projectNum = e.projectNumber || "";
      if (!projectNum) {
        empData.nonProjectExpense += e.amount;
      } else {
        empData.projectExpense += e.amount;
      }

      if (!projectNum) {
        empData.nonProjectExpenses.push(e);
      } else {
        if (!empData.projects.has(projectNum)) {
          const projectInfo = projectLookup.get(projectNum);
          empData.projects.set(projectNum, {
            number: projectNum,
            name: projectInfo ? projectInfo.name : "",
            client: projectInfo ? projectInfo.client : null,
            revenue: projectInfo ? projectInfo.revenue : 0,
            expense: projectInfo ? projectInfo.expense : 0,
            employeeExpense: 0,
            expenses: [],
          });

          if (projectInfo && !!projectNum) {
            empData.totalProjectRevenue += projectInfo.revenue;
            empData.totalProjectExpense += projectInfo.expense;
          }
        }
        const projData = empData.projects.get(projectNum);
        projData.employeeExpense += e.amount;
        projData.expenses.push(e);
      }
    });

    return Array.from(employeeMap.values())
      .map((emp) => {
        emp.totalExpense = emp.projectExpense + emp.nonProjectExpense;

        const percProjectRevenue = emp.totalProjectRevenue
          ? (emp.projectExpense / emp.totalProjectRevenue) * 100
          : 0;
        const percProjectExpense = emp.totalProjectExpense
          ? (emp.projectExpense / emp.totalProjectExpense) * 100
          : 0;

        return {
          ...emp,
          percProjectRevenue,
          percProjectExpense,
          projects: Array.from(emp.projects.values()).sort(
            (a, b) => b.employeeExpense - a.employeeExpense
          ),
        };
      })
      .sort((a, b) => b.projectExpense - a.projectExpense);
  });

  onMounted(() => {
    getData();
  });

  return {
    invoices,
    expenses,
    clients,
    projects,
    isLoading,
    getData,
    clientData,
    employeeData,
    invoicesByProject,
    expensesByProject,
  };
});
