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
</script>

<style scoped>
/* .fixed-layout-table :deep(table) {
    table-layout: fixed;
} */

.summary-stat {
    width: 160px;
}
</style>
