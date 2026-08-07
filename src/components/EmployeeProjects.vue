<template>
    <div v-if="totalExpense > 0">
        <div class="d-flex justify-space-between mb-2" v-if="projects.length > 0">
            <div class="d-flex align-center">
                Projects the employee has worked on
            </div>
            <v-btn variant="text" size="small" :color="allExpanded ? 'secondary' : 'primary'" @click="toggleExpand">
                <v-icon start
                    :icon="allExpanded ? 'mdi-arrow-collapse-vertical' : 'mdi-arrow-expand-vertical'"></v-icon>
                {{ allExpanded ? 'Collapse All' : 'Expand All' }}
            </v-btn>
        </div>
        <v-expansion-panels v-model="expandedPanels" multiple variant="accordion">
            <v-expansion-panel v-for="project in projects" :key="project.number" elevation="1" class="mb-2 rounded">
                <v-expansion-panel-title class="py-2">
                    <div class="d-flex justify-space-between align-center w-100 mr-4">
                        <div>
                            <span class="font-weight-bold text-subtitle-2">Project {{ project.number }}</span>
                            <span class="text-caption text-medium-emphasis ml-2" v-if="project.name">
                                - {{ project.name }}
                            </span>
                        </div>
                        <div class="d-flex align-center">
                            <div class="px-4 text-right d-none d-sm-block summary-stat">
                                <div class="text-caption text-medium-emphasis">Project Revenue</div>
                                <div class="font-weight-bold text-success">{{ formatCurrency(project.revenue) }}</div>
                            </div>
                            <div class="px-4 text-right d-none d-sm-block border-s summary-stat">
                                <div class="text-caption text-medium-emphasis">Project Expense</div>
                                <div class="font-weight-bold text-error">{{ formatCurrency(project.expense) }}</div>
                            </div>
                            <div class="px-4 text-right border-s summary-stat">
                                <div class="text-caption text-medium-emphasis">Employee Expense</div>
                                <div class="font-weight-bold text-error">{{ formatCurrency(project.employeeExpense) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>

                    <div class="d-flex justify-end mb-4 ga-2">
                        <v-btn color="primary" size="small" @click="openInvoiceDialog(project)">
                            Link Invoice
                        </v-btn>

                        <v-btn color="success" size="small" @click="openExpenseDialog(project)">
                            Add Expense
                        </v-btn>
                    </div>
                    <div v-if="project.linkedInvoices && project.linkedInvoices.length" class="mb-3">
                        <div class="font-weight-bold mb-2">
                            Linked Invoices
                        </div>

                        <v-chip v-for="invoice in project.linkedInvoices" :key="invoice.id" color="primary"
                            class="mr-2 mb-2">
                            {{ invoice.number }}
                        </v-chip>
                    </div>

                    <v-table density="compact" class="fixed-layout-table">
                        <thead>
                            <tr>
                                <th class="text-left">Date</th>
                                <th class="text-center">Amount</th>
                                <th class="text-center">Note</th>
                                <th class="text-right">View Expense</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="expense in project.expenses" :key="expense.id">
                                <td>{{ expense.date }}</td>
                                <td class="text-center">{{ formatCurrency(expense.amount) }}</td>
                                <td class="text-center">{{ expense.notes }}</td>
                                <td class="text-right">
                                    <a :href="`https://my.freshbooks.com/#/expense/${expense.id}`" target="_blank"
                                        class="text-decoration-none text-primary">
                                        <v-icon icon="mdi-open-in-new" size="small"></v-icon>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
        <div v-if="nonProjectExpenses.length > 0" class="mt-2">
            <v-divider v-if="projects.length > 0"></v-divider>
            <div class="d-flex align-center py-2">
                Expenses which are not linked to any projects
            </div>
            <v-table density="compact" class="fixed-layout-table">
                <thead>
                    <tr>
                        <th class="text-left">Date</th>
                        <th class="text-center">Amount</th>
                        <th class="text-center">Note</th>
                        <th class="text-right">View Expense</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="expense in nonProjectExpenses" :key="expense.id">
                        <td>{{ expense.date }}</td>
                        <td class="text-center">{{ formatCurrency(expense.amount) }}</td>
                        <td class="text-center">{{ expense.notes }}</td>
                        <td class="text-right">
                            <a :href="`https://my.freshbooks.com/#/expense/${expense.id}`" target="_blank"
                                class="text-decoration-none text-primary">
                                <v-icon icon="mdi-open-in-new" size="small"></v-icon>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </div>
    </div>
    <div v-else class="text-center pa-4 text-medium-emphasis">
        No expenses found.
    </div>

    <!-- Link Invoice Dialog -->
    <!-- Link Invoice Dialog -->
    <v-dialog v-model="invoiceDialog" max-width="500">
        <v-card>

            <v-card-title>
                Link Invoice
            </v-card-title>

            <v-card-text>
                <v-text-field label="Invoice Number" v-model="invoiceNumber" />
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn variant="text" @click="invoiceDialog = false">
                    Cancel
                </v-btn>

                <v-btn color="primary" @click="saveInvoice">
                    Save
                </v-btn>

            </v-card-actions>

        </v-card>
    </v-dialog>

    <!-- Add Expense Dialog -->
    <v-dialog v-model="expenseDialog" max-width="500">
        <v-card>

            <v-card-title>
                Add Expense
            </v-card-title>

            <v-card-text>

                <v-text-field label="Amount" v-model="expense.amount" />

                <v-text-field label="Date" type="date" v-model="expense.date" />

                <v-textarea label="Note" v-model="expense.note" />

            </v-card-text>

            <v-card-actions>

                <v-spacer></v-spacer>

                <v-btn variant="text" @click="expenseDialog = false">
                    Cancel
                </v-btn>

                <v-btn color="success" @click="saveExpense">
                    Save
                </v-btn>

            </v-card-actions>

        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';

const props = defineProps({
    projects: {
        type: Array,
        required: true,
        default: () => []
    },
    nonProjectExpenses: {
        type: Array,
        required: true,
        default: () => []
    },
    totalExpense: {
        type: Number,
        required: true,
        default: 0
    }
});

console.log(props);

const openFreshbooksExpense = (expenseId) => {
    window.open(`https://my.freshbooks.com/#/expense/${expenseId}`, '_blank');
};

const expandedPanels = ref([]);
const invoiceDialog = ref(false);
const expenseDialog = ref(false);
const invoiceNumber = ref("");
const selectedProject = ref(null);
const expense = ref({
    amount: "",
    date: "",
    note: ""
});

const allExpanded = computed(() => {
    return props.projects && expandedPanels.value.length === props.projects.length;
});

const toggleExpand = () => {

    if (allExpanded.value) {
        expandedPanels.value = [];
    } else {
        expandedPanels.value = props.projects.map((_, index) => index);
    }
};
const openInvoiceDialog = (project) => {

    selectedProject.value = project;

    invoiceNumber.value = "";

    invoiceDialog.value = true;

}
const openExpenseDialog = (project) => {

    selectedProject.value = project;

    expense.value = {
        amount: "",
        date: "",
        note: ""
    };

    expenseDialog.value = true;

};

// Expand all panels by default when component mounts or projects change
const expandAll = () => {
    expandedPanels.value = props.projects.map((_, index) => index);
};

onMounted(() => {
    // expandAll();
});

watch(() => props.projects, () => {
    expandAll();
}, { deep: true });

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
};

const saveInvoice = () => {

    if (!selectedProject.value.linkedInvoices) {
        selectedProject.value.linkedInvoices = [];
    }

    selectedProject.value.linkedInvoices.push({
        id: Date.now(),
        number: invoiceNumber.value
    });

    invoiceDialog.value = false;

};
const saveExpense = () => {

    if (!selectedProject.value.expenses) {
        selectedProject.value.expenses = [];
    }

    selectedProject.value.expenses.push({
        id: Date.now(),
        date: expense.value.date,
        amount: Number(expense.value.amount),
        notes: expense.value.note
    });

    expenseDialog.value = false;

};
</script>

<style scoped>
/* .fixed-layout-table :deep(table) {
    table-layout: fixed;
} */

.summary-stat {
    width: 160px;
}
</style>
