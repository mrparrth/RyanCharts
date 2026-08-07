<template>
    <Layout1>
        <div class="mb-6 d-flex align-center">
            <v-btn icon="mdi-arrow-left" variant="text" to="/" class="mr-4"></v-btn>
            <div>
                <h1 class="text-h4 font-weight-bold text-primary mb-1">All Employees</h1>
                <p class="text-body-1 text-medium-emphasis">Comprehensive list of all employees and their spending.</p>
            </div>
        </div>
        <v-card elevation="2" rounded="lg">
            <v-data-table :headers="headers" :items="appStore.employeeData"
                :sort-by="[{ key: 'projectExpense', order: 'desc' }]" class="elevation-0" hover :items-per-page="-1"
                hide-default-footer item-value="name">
                <template v-slot:item.name="{ item }">
                    <div class="d-flex align-center">
                        <v-avatar size="32" color="accent" variant="tonal" class="mr-3">
                            <span class="text-subtitle-2 font-weight-bold">{{ item.name.charAt(0) }}</span>
                        </v-avatar>
                        <span class="font-weight-bold">{{ item.name }}</span>
                    </div>
                </template>

                <template v-slot:item.expensesCount="{ item }">
                    <span>
                        {{ item.expensesCount }}
                    </span>
                </template>

                <template v-slot:item.totalExpense="{ item }">
                    <span class="text-error font-weight-bold">
                        {{ formatCurrency(item.totalExpense) }}
                    </span>
                </template>

                <template v-slot:item.projectExpense="{ item }">
                    <span>
                        {{ formatCurrency(item.projectExpense) }}
                    </span>
                </template>

                <template v-slot:item.nonProjectExpense="{ item }">
                    <span>
                        {{ formatCurrency(item.nonProjectExpense) }}
                    </span>
                </template>

                <template v-slot:item.percProjectRevenue="{ item }">
                    <span>
                        {{ item.totalProjectRevenue ? item.percProjectRevenue.toFixed(0) + '%' : '-' }}
                    </span>
                </template>

                <template v-slot:item.percProjectExpense="{ item }">
                    <span>
                        {{ item.totalProjectExpense ? item.percProjectExpense.toFixed(0) + '%' : '-' }}
                    </span>
                </template>

                <template v-slot:item.action="{ item }">
                    <v-btn color="primary" variant="outlined" size="small" @click="openEmployee(item)">
                        View Details
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="employeeDialog" max-width="1200">
            <v-card>
                <v-card-title class="d-flex justify-space-between align-center">
                    <span class="text-h6">
                        {{ selectedEmployee?.name }}
                    </span>

                    <v-btn icon="mdi-close" variant="text" @click="employeeDialog = false" />
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text>
                    <EmployeeProjects v-if="selectedEmployee" :projects="selectedEmployee.projects"
                        :nonProjectExpenses="selectedEmployee.nonProjectExpenses"
                        :totalExpense="selectedEmployee.totalExpense" />
                </v-card-text>
            </v-card>
        </v-dialog>
    </Layout1>
</template>

<script setup>
import { ref } from 'vue';
import { useAppStore } from '../stores/appStore';
import { EmployeeProjects, FinancialOverview } from '../components';
import Layout1 from '../layouts/Layout1.vue';

const appStore = useAppStore();
const employeeDialog = ref(false);
const selectedEmployee = ref(null);


const headers = [
    { title: 'Employee Name', align: 'start', key: 'name', sortable: true },
    { title: '# of Expenses', align: 'end', key: 'expensesCount', sortable: true },
    { title: 'Total Expense', align: 'end', key: 'totalExpense', sortable: true },
    { title: 'Total Project Expense', align: 'end', key: 'projectExpense', sortable: true },
    { title: 'Total Non Project Expense', align: 'end', key: 'nonProjectExpense', sortable: true },
    { title: '% of Project Revenue', align: 'end', key: 'percProjectRevenue', sortable: true },
    { title: '% of Project Expense', align: 'end', key: 'percProjectExpense', sortable: true },
    { title: 'Action', key: 'action' },
];

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};
const openEmployee = (employee) => {
    selectedEmployee.value = employee;
    employeeDialog.value = true;
};



</script>
