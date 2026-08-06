<template>
  <v-card class="rounded-lg" elevation="2">
    <v-card-item>
      <div class="d-flex justify-space-between align-center">
        <div>
          <h2 class="text-h5 font-weight-bold text-primary">
            Unlinked Expenses
          </h2>
        </div>

        <v-chip color="primary" variant="flat">
          {{ appStore.unlinkedExpenses.length }} Expenses
        </v-chip>
      </div>
    </v-card-item>

    <v-divider></v-divider>

    <v-data-table
      :headers="headers"
      :items="appStore.unlinkedExpenses"
      :items-per-page="5"
      density="comfortable"
      class="elevation-0"
      no-data-text="No unlinked expenses found"
    >
      <template #item.amount="{ item }">
        <span class="text-error font-weight-medium">
          ${{ Number(item.amount).toLocaleString() }}
        </span>
      </template>

      <template #item.date="{ item }">
        {{ new Date(item.date).toLocaleDateString() }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { useAppStore } from "../stores/appStore";

const appStore = useAppStore();

const headers = [
  {
    title: "Vendor",
    key: "vendor",
  },
  {
    title: "Notes",
    key: "notes",
  },
  {
    title: "Amount",
    key: "amount",
  },
  {
    title: "Date",
    key: "date",
  },
];
</script>