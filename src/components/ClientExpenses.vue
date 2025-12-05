<template>
  <v-card class="h-100" elevation="2" rounded="lg">
    <v-card-title class="text-h6 font-weight-bold text-primary pa-4 d-flex justify-space-between align-center">
      <span>Client Breakdown</span>
      <v-btn variant="text" color="primary" size="small" to="/clients">
        See All
        <v-icon end icon="mdi-arrow-right"></v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-list lines="two" class="pa-0">
        <v-list-item v-for="client in clientData" :key="client.name" class="mb-2 rounded-lg border-opacity-10"
          :class="{ 'bg-grey-lighten-4': true }">
          <template v-slot:prepend>
            <v-avatar color="secondary" variant="tonal">
              <span class="text-h6 font-weight-bold">{{ client.name.charAt(0) }}</span>
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-bold text-body-1">
            {{ client.name }}
          </v-list-item-title>

          <v-list-item-subtitle class="mt-1">
            {{ client.projects.length }} Projects
          </v-list-item-subtitle>

          <template v-slot:append>
            <div class="d-flex align-center">
              <div class="text-right mr-4">
                <div class="text-subtitle-2 font-weight-bold text-primary">
                  {{ formatCurrency(client.totalInvoices) }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Total Invoices
                </div>
              </div>
              <v-divider vertical class="mx-2" />
              <div class="text-right ml-4">
                <div class="text-subtitle-2 font-weight-bold text-primary">
                  {{ formatCurrency(client.totalExpenses) }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Total Expenses
                </div>
              </div>
            </div>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import { useAppStore } from "../stores/appStore";

const appStore = useAppStore();

const clientData = computed(() => {
  return appStore.clientData.slice(0, 10);
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};
</script>
