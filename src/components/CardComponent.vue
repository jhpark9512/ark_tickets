<template>
        <a-row :gutter="16">
            <a-col v-for="(amount, index) in ticketAmount" :key="index" class="card" :span="6">
                <a-card style="text-align: center; " :title="amount.ot_office_name" :bordered="false">
                    <p style="text-align: center;">{{amount.ot_ticket_quantity}}장</p>
                </a-card>
            </a-col>
        </a-row>
</template>
<script lang="ts" setup>
import { OfficeTicketAmount } from '../types/tickets';

const props = defineProps<{
  ticketAmount: OfficeTicketAmount[]
}>();
</script>
<style scoped>
.card-container {
    display: flex;
    width: 1000px;
    height: 400px;
    justify-content: center;
    align-items: center;
}
.card {
    width: 200px;
}
</style>