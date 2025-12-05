<template>
  <v-overlay :model-value="appStore.isLoading" class="align-center justify-center">
    <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
  </v-overlay>
  <router-view />
</template>

<script setup>
import { useAppStore } from './stores/appStore';
const appStore = useAppStore();
</script>
