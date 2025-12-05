<template>
  <v-card class="h-100" elevation="2" rounded="lg">
    <v-card-title class="text-h6 font-weight-bold text-primary pa-4">
      Employee Financial Impact
    </v-card-title>
    <v-card-text>
      <div class="d-flex flex-column align-center justify-center" style="height: 500px; position: relative;">
        <Bar v-if="chartData.labels && chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
        <div v-else class="d-flex align-center justify-center h-100 text-medium-emphasis">
          Loading data...
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { Bar } from 'vue-chartjs';
import { useAppStore } from '../stores/appStore';

import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const appStore = useAppStore();

const chartData = computed(() => {
  const filteredEmployees = appStore.employeeData
    .filter(emp => emp.projectExpense > 0)
    .sort((a, b) => b.projectExpense - a.projectExpense); // Sort by total project expense

  const labels = filteredEmployees.map(emp => emp.name);
  const revenueData = filteredEmployees.map(emp => Math.round(emp.percProjectRevenue));
  const expenseData = filteredEmployees.map(emp => Math.round(emp.percProjectExpense));

  return {
    labels: labels,
    datasets: [
      {
        label: '% of Project Revenue',
        backgroundColor: '#6366F1', // Indigo 500
        data: revenueData,
        borderRadius: 4,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      },
      {
        label: '% of Project Expense',
        backgroundColor: '#F43F5E', // Rose 500
        data: expenseData,
        borderRadius: 4,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      }
    ]
  };
});

const chartOptions = {
  indexAxis: 'y', // Horizontal bars (list flows vertically)
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        usePointStyle: true,
        font: {
          family: 'Inter',
          size: 11
        },
        padding: 15
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.x !== null) { // x is value in horizontal bar
            label += Math.round(context.parsed.x) + '%';
          }
          return label;
        }
      }
    },
    datalabels: {
      color: '#FFFFFF',
      font: {
        family: 'Inter',
        weight: 'bold',
        size: 10
      },
      formatter: function (value, context) {
        return Math.round(value) + '%';
      },
      anchor: 'end',
      align: 'start',
      offset: -4,
      display: function (context) {
        return context.dataset.data[context.dataIndex] > 5; // Hide if bar is too small
      }
    }
  },
  scales: {
    x: { // Value axis
      beginAtZero: true,
      grid: {
        color: '#f3f4f6'
      },
      ticks: {
        callback: value => Math.round(value) + '%',
        font: {
          family: 'Inter',
          size: 10
        }
      }
    },
    y: { // Category axis
      grid: {
        display: false
      },
      ticks: {
        font: {
          family: 'Inter',
          size: 11
        },
        autoSkip: false
      }
    }
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
};

onMounted(() => {
  // Ensure data is loaded if not already
  if (appStore.employeeData.length === 0) {
    appStore.getData();
  }
});
</script>
