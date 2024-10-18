<template>
    <div class="container">
        <div class="top">
            <div class="card-area">
                <a-card style="border: 1px solid black;" :title="office" :bordered="false">
                    <h3>총합 : {{ totalTicketQuantity }}</h3>
                    <p v-for="(office, index) in officeData" :key="index">
                        {{ officeData[index].o_company_name }} : {{ officeData[index].o_ticket_quantity }}개
                    </p>
                </a-card>
            </div>
            <div class="button-area">
                <TicketInputModalComponent :office="office" :officeData="officeData" @update-tickets="updateTickets"/>
                <TicketUpdateModalCompnent :office="office"/>
            </div>
        </div>
        <div class="bottom">
            <div class="searchBar-area">
                <p style="display: flex; float: right;">
                    <SearchBarComponent />
                </p>
            </div>
            <div class="table-area">
                <TableComponent :columns="columns" :data="usageData" :current="current" :total="total">
                    <template #UorNot="{ record }">
                <template v-if="record.usage_type === true">
                    <span>사용</span>
                </template>
                <template v-else>
                    <span>취소</span>
                </template>
            </template>
                </TableComponent>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import SearchBarComponent from '../components/SearchBarComponent.vue';
import TableComponent from '../components/TableComponent.vue';
import TicketInputModalComponent from '../components/TicketInputModalComponent.vue';
import dayjs from 'dayjs';
import { ColumnType } from 'ant-design-vue/es/table';
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { OfficeData } from '../types/tickets';
import { ticketUsage } from '../types/ticketUsage';
import TicketUpdateModalCompnent from '../components/TicketUpdateModalCompnent.vue';



const route = useRoute();
const office = ref<string>(route.params.id as string);
const current = ref(1); //페이지 기본값
const total = ref(0);  // total 데이터 개수
const officeData = ref(<OfficeData[]>([]));
const totalTicketQuantity = computed(() => {
    return officeData.value.reduce((sum, office) => sum + office.o_ticket_quantity, 0);
});

const pageNum = ref<number>(1);
const officeName = ref<string>(office.value);
const usedDate = ref<string | null>(null);
const userName = ref<string | null>(null);
const userDepartment = ref<string | null>(null);
const usageTime = ref<string | null>(null);
const usageType = ref<boolean | null>(true);
const usageData = ref<any[]>([]);


const columns: ColumnType[] = [
    {
        title: '번호',
        dataIndex: 'usage_id',
        key: 'usage_id',
    },
    {
        title: '날짜',
        dataIndex: 'used_date',
        key: 'used_date',
    },
    {
        title: '구분',
        dataIndex: 'usage_time',
        key: 'usage_time',
    },
    {
        title: '이름',
        dataIndex: 'user_name',
        key: 'user_name',
    },
    {
        title: '부서',
        dataIndex: 'user_department',
        key: 'user_department',
    },
    {
        title: '소속',
        dataIndex: 'user_company',
        key: 'user_company',
    },
    {
        title: '사용여부',
        dataIndex: 'usage_type',
        key: 'UorNot',
    },
]
const updateTickets = (companyName: string, quantity: number) => {
  const office = officeData.value.find(o => o.o_company_name === companyName);
  if (office) {
    office.o_ticket_quantity += quantity; // 개수 업데이트
  }
};


const formatDate = (timestamp: string): string => {
    return dayjs(timestamp).format('YYYY년 MM월 DD일');
};



//사무실 식권개수 정보
const getOfficeTicketAmount = async (officeName: string) => {
    try {
        const response = await fetch(`/api/office_ticket_amount?officeName=${officeName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: OfficeData[] = await response.json();
        officeData.value = data;
    } catch (error) {
        console.log('Error fetching officeAmounts:', error);
    }
}
// 식권 사용기록
const getOfficeUsage = async () => {
    try {
        const queryParams = new URLSearchParams({
            pageNum: pageNum.value.toString(),
            officeName: officeName.value || '',
            usedDate: usedDate.value || '',
            userName: userName.value || '',
            userDepartment: userDepartment.value || '',
            usageTime: usageTime.value || '',
            usageType: usageType.value ? 'true' : 'false'
        }).toString();
        const response = await fetch(`/api/paging_usage?${queryParams}`);

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data: ticketUsage[] = await response.json();
        usageData.value = data.map((item: ticketUsage) => ({
            ...item,
            used_date: formatDate(item.useDate)
        }));
    } catch (error) {
        console.error('API fetch error:', error);
    }
};

onMounted(() => {
    getOfficeTicketAmount(office.value);
    getOfficeUsage();
})


</script>
<style scoped>
.container {
    display: grid;
    grid-template-rows: 1fr 2fr;
}

.top {
    display: grid;
    grid-template-columns: 400px 2fr;
}

.bottom {
    display: grid;
    grid-template-columns: 2fr;
}

.card-area {
    width: 400px;
    height: 200px;
    padding: 20px;
}

.button-area {
    display: grid;
    padding-top: 40px;
    width: 150px;
    height: 150px;
    justify-content: center;
    align-items: center;
}
</style>