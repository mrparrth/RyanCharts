<template>
  <v-card class="h-100" elevation="2" rounded="lg">
    <v-card-title class="text-h6 font-weight-bold text-primary pa-4 d-flex align-center justify-space-between">
      <span>Project Expenses</span>
      <v-chip size="small" color="primary" variant="flat">{{ projectsWithExpenses.length }} Projects</v-chip>
    </v-card-title>

    <v-data-table :headers="headers" :items="projectsWithExpenses" item-value="number" class="elevation-0"
      density="comfortable" hover :sort-by="[{ key: 'profit', order: 'desc' }]">
      <template v-slot:item.clientName="{ item }">
        <a v-if="item.client && item.client.id" :href="`https://my.freshbooks.com/#/client/${item.client.id}`"
          target="_blank" rel="noopener noreferrer" class="text-primary text-decoration-underline">
          {{ item.client.name }}
        </a>
        <span v-else>
          {{ (item.client && item.client.name) || 'N/A' }}
        </span>
      </template>
      <template v-slot:item.revenue="{ item }">
        <span class="text-success font-weight-medium">{{
          formatCurrency(item.revenue)
          }}</span>
      </template>
      <template v-slot:item.expense="{ item }">
        <span class="text-error font-weight-medium">{{
          formatCurrency(item.expense)
          }}</span>
      </template>

      <template v-slot:item.profit="{ item }">
        <span :class="item.profit >= 0 ? 'text-success' : 'text-error'" class="font-weight-bold">
          {{ formatCurrency(item.profit) }}
        </span>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { useAppStore } from "../stores/appStore";

const appStore = useAppStore();

const headers = [
  { title: "Project #", align: "start", key: "number", sortable: true },
  { title: "Client", align: "start", key: "clientName", sortable: true },
  { title: "Revenue", align: "end", key: "revenue", sortable: true },
  { title: "Expenses", align: "end", key: "expense", sortable: true },
  { title: "Net Profit", align: "end", key: "profit", sortable: true },
];

const projectsWithExpenses = computed(() => {
  return appStore.projects
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};
</script>
