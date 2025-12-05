<template>
  <v-card class="h-100" elevation="2" rounded="lg">
    <v-card-title class="text-h6 font-weight-bold text-primary pa-4 d-flex justify-space-between align-center">
      <span>Employee Spending</span>
      <v-btn variant="text" color="primary" size="small" to="/employees">
        See All
        <v-icon end icon="mdi-arrow-right"></v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-expansion-panels variant="popout" class="pa-0">
        <v-expansion-panel v-for="employee in employeeData" :key="employee.name" elevation="1">
          <v-expansion-panel-title>
            <div class="d-flex align-center w-100">
              <v-avatar size="32" color="accent" variant="tonal" class="mr-3">
                <span class="text-subtitle-2 font-weight-bold">{{ employee.name.charAt(0) }}</span>
              </v-avatar>
              <div class="d-flex flex-column">
                <span class="font-weight-bold">{{ employee.name }}</span>
                <span class="text-caption text-medium-emphasis">{{ employee.role }}</span>
              </div>
              <v-spacer></v-spacer>
              <span class="text-subtitle-2 font-weight-bold text-error mr-2">
                {{ formatCurrency(employee.totalExpense) }}
              </span>
            </div>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <div v-if="employee.totalExpense > 0">
              <v-table density="compact" class="ml-2 pl-2">
                <thead>
                  <tr>
                    <th class="text-center">Project Linked Expense</th>
                    <th class="text-center">Non Project Expense</th>
                    <th class="text-center">% of Project Revenue</th>
                    <th class="text-center">% of Project Expense</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-center">{{ formatCurrency(employee.projectExpense) }}</td>
                    <td class="text-center">{{ formatCurrency(employee.nonProjectExpense) }}</td>
                    <td class="text-center">{{ employee.totalProjectRevenue ? (employee.projectExpense /
                      employee.totalProjectRevenue * 100).toFixed(0) + '%' : 'No Project' }}
                    </td>
                    <td class="text-center">{{ employee.totalProjectExpense ? (employee.projectExpense /
                      employee.totalProjectExpense * 100).toFixed(0) + '%' : 'No Project' }}
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>
            <div v-else class="text-center pa-4 text-medium-emphasis">
              No expenses found.
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import { useAppStore } from "../stores/appStore";

const appStore = useAppStore();

const employeeData = computed(() => {
  return appStore.employeeData.sort((a, b) => b.totalExpense - a.totalExpense).slice(0, 10);
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};
</script>
