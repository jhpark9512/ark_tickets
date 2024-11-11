<template>
  <a-button type="primary" @click="showModal">지급</a-button>
  <a-modal v-model:open="open" title="식권지급" :confirm-loading="confirmLoading">
    <br />
    <div class="modal-container">
      <a-form :model="form" ref="formRef" @submit.prevent="handleSubmit">

        <div :style="{ width: '300px', border: '1px solid #d9d9d9', borderRadius: '4px', marginBottom: '16px' }">
          <a-calendar v-model:value="value" :fullscreen="false" @change="onDateChange" />
        </div>

        <a-form-item>
          <a-radio-group v-model:value="form.selection" style="margin-bottom: 16px;">
            <template v-for="(office, index) in officeData" :key="office.o_company_id">
            <a-radio :value="office.o_company_name">{{office.o_company_name}}</a-radio>
          </template>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="지급개수" name="input_quantity" :rules="[{ required: true, message: '개수를 입력해주세요!' }]">
          <a-input style="width: 100px;" v-model:value="form.input_quantity" /> 개
        </a-form-item>

      </a-form>
    </div>
    <template #footer>
      <div style="text-align: center;">
        <a-button type="primary" @click="handleSubmit">지급</a-button>
        <a-button danger @click="open = false">닫기</a-button>
      </div>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { OfficeData } from '../types/tickets';
const props = defineProps<{
  office: string;
  officeData: OfficeData[];
}>();

const emit = defineEmits<{
  (e: 'update-tickets', companyName: string, quantity: number): void;
}>();

const open = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const form = ref<{ selection: string | null; input_quantity: number | null }>({ selection: null, input_quantity: null });
const value = ref<Dayjs>(dayjs());
const office = props.office;
const onDateChange = (date: Dayjs) => {
  console.log(date.format('YYYY-MM-DD'))
}

const showModal = () => {
  open.value = true;
};

const handleSubmit = async () => {
  const selectedCompany = form.value.selection;
  const quantity = form.value.input_quantity;

  const submitData = {
    date: value.value?.format('YYYY-MM-DD'),
    company: form.value.selection,
    office: props.office,
    quantity: form.value.input_quantity,
    ticketType: true,
  }
  console.log(submitData)
  //식권불출기록 등록 api호출
  try {
    const response = await fetch('/api/transfer_tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // JSON 형식으로 전송
      },
      body: JSON.stringify(submitData), // 객체를 JSON 문자열로 변환
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json(); // 응답을 JSON으로 변환
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }

  if (selectedCompany && quantity !== null) {
    emit('update-tickets', selectedCompany, Number(quantity)); // 이벤트 발생
  }

  confirmLoading.value = true;
  setTimeout(() => {
    open.value = false;
    confirmLoading.value = false;
  }, 2000);
}


</script>
<style scoped>
.modal-container {
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
}
</style>