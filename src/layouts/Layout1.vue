<template>
  <v-app class="bg-background">
    <v-app-bar elevation="0" color="white" class="border-b">
      <template v-slot:prepend>
        <v-app-bar-nav-icon color="primary"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title class="text-primary font-weight-bold">
        ExpenseTracker
      </v-app-bar-title>

      <!-- Year Filter -->
      <v-select
        :items="years"
        v-model="appStore.selectedYear"
        label="Year"
        variant="outlined"
        density="compact"
        hide-details
        style="max-width: 120px;"
        class="mr-2"
      ></v-select>

      <!-- Month Filter -->
      <v-select
        :items="months"
        v-model="appStore.selectedMonth"
        label="Month"
        variant="outlined"
        density="compact"
        hide-details
        style="max-width: 150px;"
        class="mr-4"
      ></v-select>

      <template v-slot:append>
        <v-btn icon color="primary">
          <v-icon>mdi-bell-outline</v-icon>
        </v-btn>

        <v-avatar color="secondary" size="36" class="ml-2">
          <span class="text-white font-weight-bold">JD</span>
        </v-avatar>
      </template>
    </v-app-bar>

    <v-main class="bg-background">
      <v-container fluid class="pa-6">

        <div
          v-if="
            appStore.selectedYear &&
            appStore.selectedMonth &&
            appStore.projects.length === 0
          "
          class="text-center py-10 text-grey"
        >
          <h2>No data found</h2>
        </div>

        <slot v-else></slot>

      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { useAppStore } from "../stores/appStore";
import { watch } from "vue";

const appStore = useAppStore();

watch(
  () => [appStore.selectedYear, appStore.selectedMonth],
  () => {
    appStore.getData();
  }
);

const years = [
  2000,
  2001,
  2002,
  2003,
  2004,
  2005,
  2006,
  2007,
  2008,
  2009,
  2010,
  2011,
  2012,
  2013,
  2014,
  2015,
  2016,
  2017,
  2018,
  2019,
  2020,
  2021,
  2022,
  2023,
  2024,
  2025,
  2026,
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
</script>

<style scoped>
.bg-background {
  background-color: #F3F4F6 !important;
}
</style>