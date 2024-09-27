<template>
    <div class="content-area">
        <div class="card-container" style="background-color: #ececec; padding: 20px;">
        <CardComponent :ticketAmount="ticketAmount"/>
        </div>
        <br/>
    </div>
    <TabComponent />
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { OfficeTicketAmount } from '../types/tickets';
import CardComponent from '../components/CardComponent.vue';
import TabComponent from '../components/TabComponent.vue';

const ticketAmount = ref();

const officeAmounts = async () =>{
    try{
        const response = await fetch('/api/office-ticket-amount');
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: OfficeTicketAmount[] = await response.json();
        console.log(data)
        ticketAmount.value = data;
        console.log(ticketAmount.value)
    } catch (error){
        console.log('Error fetching officeAmounts:', error);
    }
}
onMounted(()=>{
    officeAmounts();
})
</script>
<style scoped>
.content-area {
    width: 100%;
    display: grid;
    place-items: center;
}
</style>