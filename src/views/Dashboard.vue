<template>
    <Layout1>
        <div class="mb-6">
            <h1 class="text-h4 font-weight-bold text-primary mb-1">
                Dashboard Overview
            </h1>
            <p class="text-body-1 text-medium-emphasis">
                Track your project expenses and financial health.
            </p>
        </div>

        <v-row>
            <v-col cols="12" md="8">
                <ProjectExpenses />
            </v-col>

            <!-- Top Row: Financial Overview -->
            <v-col cols="12" md="4">
                <FinancialOverview />
            </v-col>
        </v-row>

        <v-row class="mt-4">
            <!-- Bottom Row: Client Breakdown & Employee Spending -->
            <v-col cols="12" md="6">
                <ClientExpenses />
            </v-col>

            <v-col cols="12" md="6">
                <EmployeeExpenses />
            </v-col>
        </v-row>

        <!-- New Row -->
        <v-row class="mt-4">
            <v-col cols="12" md="6">
                <UnlinkedInvoices />
            </v-col>

            <v-col cols="12" md="6">
                <UnlinkedExpenses />
            </v-col>
        </v-row>
    </Layout1>
</template>

<script setup>
import {
    FinancialOverview,
    ProjectExpenses,
    ClientExpenses,
    EmployeeExpenses,
    UnlinkedInvoices,
    UnlinkedExpenses,
} from "../components";

import Layout1 from "../layouts/Layout1.vue";
</script>