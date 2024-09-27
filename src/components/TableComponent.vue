<template>
  <a-table :columns="columns" :data-source="purchaseList">
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex === 'name'">
        <a>{{ text }}</a>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { ColumnType } from 'ant-design-vue/es/table';
import { PurchaseData } from '../types/tickets';
const props = defineProps<{
  columns: ColumnType[];
  purchaseList: PurchaseData[];
}>();
console.log(props.columns)
console.log(props.purchaseList)
</script>