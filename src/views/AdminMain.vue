<template>
    <div class="content-area">
        <div class="card-container" style="background-color: #ececec; padding: 20px;">
        <CardComponent :ticketAmount="ticketAmount" @click="moveToOffice"/>
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
import { useRouter } from 'vue-router';
const router = useRouter();
const ticketAmount = ref(<OfficeTicketAmount[]>([]));

const moveToOffice = (office:OfficeTicketAmount) =>{
    router.push({name: 'OfficePage', params: {id: office.ot_office_name}});
}

//사무실별 잔여 식권 개수
const officeAmounts = async () =>{
    try{
        const response = await fetch('/api/office_ticket_list');
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: OfficeTicketAmount[] = await response.json();
        ticketAmount.value = data;
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