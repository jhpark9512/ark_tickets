<template>
  <div>
    <a-form :model="formState" name="inputTicketPurchase" :label-col="{ span: 8 }" :wrapper-col="{ span: 6 }"
      autocomplete="off" @finish="InsertPurchaseData" @finishFailed="InsertFailed">
      <a-form-item label="구매일" name="input_date" :rules="[{ required: true, message: '구매일을 입력해주세요!' }]">
        <a-input v-model:value="formState.input_date" />
      </a-form-item>

      <a-form-item label="식권종류" name="input_ticket_name" :rules="[{ required: true, message: '식권종류를 입력해주세요' }]">
        <a-input v-model:value="formState.input_ticket_name" />
      </a-form-item>

      <a-form-item label="구매개수" name="input_quantity" :rules="[{ required: true, message: '구매개수을 입력해주세요!' }]">
        <a-input v-model:value="formState.input_quantity" />
      </a-form-item>

      <a-form-item label="가격" name="input_price" :rules="[{ required: true, message: '가격을 입력해주세요!' }]">
        <a-input v-model:value="formState.input_price" />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 10, span: 16 }">
        <a-button type="primary" html-type="submit">등록</a-button>
      </a-form-item>
    </a-form>

  </div>
  <div v-if="purchaseList.length > 0">
    <TableComponent :columns="columns" :data="purchaseList" :current="current" :total="total"
      @handleClick="getPurchaseList">
      <template #button="{ record }">
        <template v-if="record.p_purchase_type === true">
          <a-button type="primary" danger @click="DeletePurchaseData(record)">취소</a-button>
        </template>
        <template v-else>
          <span>취소됨</span>
        </template>
      </template>
    </TableComponent>
  </div>
  <div v-else>
    <p>loading...</p>
  </div>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs';
import { ref, onMounted } from 'vue';
import { PurchaseData } from '../types/tickets';
import { ColumnType } from 'ant-design-vue/es/table';
import TableComponent from '../components/TableComponent.vue';


const purchaseList = ref<PurchaseData[]>([]); //테이블 데이터
const current = ref(1); //페이지 기본값
const total = ref(0);  // total 데이터 개수

const columns: ColumnType[] = [
  {
    title: '번호',
    dataIndex: 'p_purchase_id',
    key: 'p_purchase_id',
  },
  {
    title: '날짜',
    dataIndex: 'p_purchase_date',
    key: 'p_purchase_date',
  },
  {
    title: '식권종류',
    dataIndex: 'p_purchase_ticket_name',
    key: 'p_purchase_ticket_name',
  },
  {
    title: '개수',
    dataIndex: 'p_purchase_ticket_quantity',
    key: 'p_purchase_ticket_quantity',
  },
  {
    title: '가격',
    dataIndex: 'p_purchase_ticket_price',
    key: 'p_purchase_ticket_price',
  },
  {
    title: '비고',
    dataIndex: 'p_purchase_type',
    key: 'button',
  }
]

interface FormState {
  input_date: string;
  input_ticket_name: string;
  input_quantity: string;
  input_price: string;
};

const initialState: FormState = {
  input_date: '',
  input_ticket_name: '',
  input_quantity: '',
  input_price: '',
}

const formState = ref<FormState>({
  input_date: '',
  input_ticket_name: '',
  input_quantity: '',
  input_price: '',
});


const formatDate = (timestamp: string): string => {
  return dayjs(timestamp).format('YYYY년 MM월 DD일');
};

//식권 구매내역 등록
const InsertPurchaseData = async (values: FormState) => {
  try {
    const response = await fetch('/api/insert_purchase_history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error('Failed to submit purchase');
    }
    const result = await response.json();
    console.log('Success:', result);
    alert('구매 내역이 등록되었습니다.');
    await getPurchaseList(current.value);
  } catch (error) {
    console.error('Error submitting form:', error);
  }
  formState.value = { ...initialState }
};
//식권 입력 실패
const InsertFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

//식권구매 취소
const DeletePurchaseData = async (record: PurchaseData) => {
  if (confirm("식권구매내역을 취소하시겠습니까?")) {
    if (record.p_purchase_type === true) {
      await cancelPurchase(record.p_purchase_id, false);
      const targetItem = purchaseList.value.find(item => item.p_purchase_id === record.p_purchase_id);
    if(targetItem){
      targetItem.p_purchase_type = false;
    }
    } else {
      alert('Error')
    }
  } else {
    alert('취소')
  }


}


//식권구매내역 리스트 호출
const getPurchaseList = async (pageNumber: number) => {
  try {
    const response = await fetch(`/api/purchase/paging?pageNum=${pageNumber}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: PurchaseData[] = await response.json();
    purchaseList.value = data.map((item: PurchaseData) => ({
      ...item,
      p_purchase_date: formatDate(item.p_purchase_date),
    }));
    total.value = data[0].total_count;
  } catch (error) {
    console.log('Error fetching officeAmounts:', error);
  }
}

//식권구매내역 수정
const cancelPurchase = async (purchaseId: number, purchaseType: boolean) => {
  try {
    const response = await fetch('/api/cancel_purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        purchase_id: purchaseId,
        purchase_type: purchaseType,
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
  getPurchaseList(current.value);
})

</script>
<style scoped>

</style>