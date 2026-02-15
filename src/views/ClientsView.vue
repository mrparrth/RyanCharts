<template>
    <Layout1>
        <div class="mb-6 d-flex align-center">
            <v-btn icon="mdi-arrow-left" variant="text" to="/" class="mr-4"></v-btn>
            <div>
                <h1 class="text-h4 font-weight-bold text-primary mb-1">All Clients</h1>
            </div>
        </div>

        <v-card elevation="2" rounded="lg">
            <v-data-table :headers="headers" :items="appStore.clientData"
                :sort-by="[{ key: 'totalInvoices', order: 'desc' }]" class="elevation-0" hover :items-per-page="-1"
                hide-default-footer>
                <template v-slot:item.name="{ item }">
                    <div class="d-flex align-center">
                        <a :href="`https://my.freshbooks.com/#/client/${item.id}`" target="_blank"
                            rel="noopener noreferrer" class="mr-1 d-flex align-center" style="text-decoration: none;">
                            <img src="https://my.freshbooks.com/assets/images/freshbooks-leaf-midnight-blue.0287aeec34d07a639c10.svg"
                                style="height: 20px; width: auto;" alt="FreshBooks" />
                        </a>
                        <div class="font-weight-bold">{{ item.name }}</div>
                    </div>
                </template>
                <template v-slot:item.organization="{ item }">
                    <div>{{ item.organization }}</div>
                </template>
                <template v-slot:item.projects="{ item }">
                    <span>
                        {{ item.projects.length }}
                    </span>
                </template>

                <template v-slot:item.totalInvoices="{ item }">
                    <span class="text-success font-weight-medium">
                        {{ formatCurrency(item.totalInvoices) }}
                    </span>
                </template>

                <template v-slot:item.totalExpenses="{ item }">
                    <span class="text-error font-weight-medium">
                        {{ formatCurrency(item.totalExpenses) }}
                    </span>
                </template>


            </v-data-table>
        </v-card>
    </Layout1>
</template>

<script setup>
import { useAppStore } from '../stores/appStore';
import Layout1 from '../layouts/Layout1.vue';

const appStore = useAppStore();

const headers = [
    { title: 'Client Name', align: 'start', key: 'name', sortable: true },
    { title: 'Organization', align: 'start', key: 'organization', sortable: true },
    { title: 'Projects Count', align: 'start', key: 'projects', sortable: true, value: item => item.projects.length },
    { title: 'Total Invoices', align: 'start', key: 'totalInvoices', sortable: true },
    { title: 'Total Expenses', align: 'start', key: 'totalExpenses', sortable: true },
];

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};
</script>
