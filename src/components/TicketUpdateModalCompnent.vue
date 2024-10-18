<template>
    <a-button danger type="primary" @click="showModal">지급기록/회수</a-button>
    <a-modal v-model:open="open" title="Title" :confirm-loading="confirmLoading" @ok="handleOk">
        <TableComponent :columns="columns" :data="issuList" :current="current" :total="total">
            <template #PorNot="{ record }">
                <template v-if="record.issu_type === true">
                    <span>지급</span>
                </template>
                <template v-else>
                    <span>회수</span>
                </template>
            </template>
        </TableComponent>
        <template #footer>
            <div style="text-align: center;">
                <a-button type="primary" danger @click="open = false">닫기</a-button>
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

]


const open = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const page = ref(1);
const current = ref(1);
const total = ref(0);
const issuList = ref<TicketIssuList[]>([]); //테이블 데이터
const showModal = () => {
    open.value = true;
};

const handleOk = () => {
    confirmLoading.value = true;
    setTimeout(() => {
        open.value = false;
        confirmLoading.value = false;
    }, 2000);
};

const formatDate = (timestamp: string): string => {
    return dayjs(timestamp).format('YYYY년 MM월 DD일');
};

const paggingTicketIssu = async () => {
    const data = {
        pageNum: page.value,
        officeName: props.office
    };

    try {
        const response = await fetch('/api//pagging_ticket_issu', {
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
    } catch (err) {
        console.error('Error:', err)
    }
}

onMounted(() => {
    paggingTicketIssu();
})
</script>