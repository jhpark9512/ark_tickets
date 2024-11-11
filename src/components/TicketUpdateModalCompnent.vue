<template>
    <a-button danger type="primary" @click="showModal">지급기록/회수</a-button>
    <a-modal v-model:open="open" title="식권 지급기록">
        <TableComponent :columns="columns" :data="issuList" :current="current" :total="total" @handleClick="paggingTicketIssu">
            <template #PorNot="{ record }">
                <template v-if="record.issu_type === true">
                    <span>지급</span>
                </template>
                <template v-else>
                    <span>회수</span>
                </template>
            </template>

            <template #button="{ record }">
                <template v-if="record.issu_type === true">
                    <a-button type="primary" danger @click="cancelTickets(record)">회수</a-button>
                </template>
                <template v-else>
                    <span>회수됨</span>
                </template>
            </template>

        </TableComponent>
        <template #footer>
            <div style="text-align: center;">
                <a-button type="primary" @click="open = false">닫기</a-button>
            </div>
        </template>
    </a-modal>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs';
import { onMounted, ref } from 'vue';
import TableComponent from './TableComponent.vue';
import { ColumnType } from 'ant-design-vue/es/table';
import { TicketIssuList } from '../types/ticketUsage';
const props = defineProps<{
    office: string;
}>();

const columns: ColumnType[] = [
    {
        title: '날짜',
        dataIndex: 'issu_date',
        key: 'issu_date',
    },
    {
        title: '회사명',
        dataIndex: 'issu_company_name',
        key: 'issu_company_name',
    },
    {
        title: '개수',
        dataIndex: 'issu_quantity',
        key: 'issu_quantity',
    },
    {
        title: '지급/회수',
        dataIndex: 'issu_type',
        key: 'PorNot',
    },
    {
        title: '회수',
        dataIndex: 'issu_type',
        key: 'button',
    },


]

const office = props.office;
const open = ref<boolean>(false);
const page = ref(1);
const current = ref(1);
const total = ref(0);
const issuList = ref<TicketIssuList[]>([]); //테이블 데이터
const showModal = () => {
    open.value = true;
};


//Date -> string으로 형변환
const formatDate = (timestamp: string): string => {
    return dayjs(timestamp).format('YYYY년 MM월 DD일');
};

const emit = defineEmits<{
    (e: 'update-tickets', office: string): void;
}>();


//식권지급기록 api호출 코드
const paggingTicketIssu = async (pageNumber : number) => {
    const data = {
        pageNum: pageNumber,
        officeName: props.office
    };

    try {
        const response = await fetch('/api//paging_ticket_issu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Network response did not work');
        }
        const result: TicketIssuList[] = await response.json();
        issuList.value = result.map((item: TicketIssuList) => ({
            ...item,
            issu_date: formatDate(item.issu_date),
        }));
        console.log(issuList.value)
        total.value = result[0].total_count;
    } catch (err) {
        console.error('Error:', err)
    }
}

//식권회수 동작 조건식
const cancelTickets = async (record: TicketIssuList) => {
    if (confirm("식권을 회수하시겠습니까?")) {
        if (record.issu_type === true) {
            await recallTickets(record.issu_id, false);
            const targetItem = issuList.value.find(item => item.issu_id === record.issu_id);
            if (targetItem) {
                targetItem.issu_type = false;
            }
        } else {
            alert('Error')
        }
    } else {
        alert('취소')
    }
    emit('update-tickets', office);
}

//식권회수 api호출 코드
const recallTickets = async (issuId: number, issuType: boolean) => {
    try {
        const response = await fetch('/api/recallTickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                issu_id: issuId,
                issu_type: issuType,
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data.message);
    } catch (error) {
        console.log('Error fetching officeAmounts:', error);
    }
}

onMounted(() => {
    paggingTicketIssu(current.value);
})
</script>
<style scoped></style>