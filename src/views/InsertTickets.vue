<template>
  <div class="form-container">
    <!-- <a-form :model="formState" name="basic" :label-col="{ span: 9 }" :wrapper-col="{ span: 5 }" autocomplete="off"
      @finish="onFinish" @finishFailed="onFinishFailed">
      <a-form-item label="구 매 일" name="purchaseDate" :rules="[{ required: true, message: '구매일을 입력해주세요' }]">
        <a-input v-model:value="formState.username" />
      </a-form-item>

      <a-form-item label="구매가격" name="password" :rules="[{ required: true, message: '구매가격을 입력해주세요!' }]">
        <a-input v-model:value="formState.password" />
      </a-form-item>

      <a-form-item label="구매개수" name="password" :rules="[{ required: true, message: '구매개수를 입력해주세요!' }]">
        <a-input v-model:value="formState.password" />
      </a-form-item>
      <br />
      <a-form-item :wrapper-col="{ offset: 11, span: 16 }">
        <a-button type="primary" html-type="submit">Submit</a-button>
      </a-form-item>
    </a-form> -->
    <div v-if="purchaseList.length > 0">
      <TableComponent :columns="columns" :purchaseList="purchaseList"/>
    </div>
    <div v-else>
      <p>loading...</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { PurchaseData } from '../types/tickets';
import { ColumnType } from 'ant-design-vue/es/table';
import TableComponent from '../components/TableComponent.vue';
const purchaseList = ref<PurchaseData[]>([]);

const columns: ColumnType[] = [
  {
    title: '날짜',
    dataIndex: 'p_purchase_date',
    key: 'p_purchase_date',
  },
  {
    title: '식권종류',
    dataIndex: 'p_purchase_ticket_id',
    key: 'p_purchase_ticket_id',
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
  }
]

// interface FormState {
//   username: string;
//   password: string;
//   remember: boolean;
// }


const getPurchaseList = async () => {
  try {
    const response = await fetch('/api/purchase/paging');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: PurchaseData[] = await response.json();
    console.log(data)
    purchaseList.value = data;
    console.log(purchaseList.value)
  } catch (error) {
    console.log('Error fetching officeAmounts:', error);
  }
}
onMounted(() => {
  getPurchaseList();
})
</script>
<style scoped></style>