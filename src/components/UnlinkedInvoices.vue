<template>
  <v-card class="rounded-lg" elevation="2">
    <v-card-item>
      <div class="d-flex justify-space-between align-center">
        <div>
          <h2 class="text-h5 font-weight-bold text-primary">
            Unlinked Invoices
          </h2>
        </div>

        <v-chip color="primary" variant="flat">
          {{ appStore.unlinkedInvoices.length }} Invoices
        </v-chip>
      </div>
    </v-card-item>

    <v-divider></v-divider>

    <v-data-table
      :headers="headers"
      :items="appStore.unlinkedInvoices"
      :items-per-page="5"
      density="comfortable"
      class="elevation-0"
      no-data-text="No unlinked invoices found"
    >
      <!-- Serial Number -->
      <template #item.serial="{ index }">
        {{ index + 1 }}
      </template>

      <!-- Amount -->
      <template #item.amount="{ item }">
        <span class="text-success font-weight-medium">
          ${{ Number(item.amount).toLocaleString() }}
        </span>
      </template>

      <!-- Date -->
      <template #item.create_date="{ item }">
        {{ new Date(item.create_date).toLocaleDateString() }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { useAppStore } from "../stores/appStore";

const appStore = useAppStore();

const headers = [
  {
    title: "Invoice ID",
    key: "serial",
    sortable: false,
  },
  {
    title: "Description",
    key: "description",
  },
  {
    title: "Amount",
    key: "amount",
  },
  {
    title: "Date",
    key: "create_date",
  },
];
</script>