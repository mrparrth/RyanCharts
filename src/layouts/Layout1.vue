<template>
  <v-app class="bg-background">
    <v-app-bar elevation="0" color="white" class="border-b">
      <template v-slot:prepend>
        <v-app-bar-nav-icon color="primary"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title class="text-primary font-weight-bold">
        ExpenseTracker
      </v-app-bar-title>
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
        <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
// Layout logic here if needed
</script>

<style scoped>
.bg-background {
  background-color: #F3F4F6 !important;
}
</style>
