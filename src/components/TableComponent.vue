<template>
  <div class="table-container">
    <a-table :columns="columns" :data-source="data" :pagination="false">
      <template v-slot:bodyCell="{ column, record }">
        <template v-if="column.dataIndex ==='name'">
          <a>{{ record.name }}</a>
        </template>
        <template v-if="column.key ==='button'">
          <slot name="button" :record="record"></slot>
        </template>
        <template v-if="column.key === 'PorNot'">
          <slot name="PorNot" :record="record"></slot>
        </template>
        <template v-if="column.key === 'UorNot'">
          <slot name="UorNot" :record="record"></slot>
        </template>
      </template>
    </a-table>
    <div class="pagination">
      <a-pagination v-model:current="currentPageNum" :total="total" :page-size="5" show-less-items @change="handleClick"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ColumnType } from 'ant-design-vue/es/table';
import { ref, watch } from 'vue';
const props = defineProps<{
  columns: ColumnType[];
  current: number;
  total: number;
  data: any[];
}>();
const tableData = ref([props.data]);

const currentPageNum = ref(1);
const total = ref(props.total);

const pageNumber = defineEmits(['handleClick']);
const handleClick = (pageNum: number) => {
  currentPageNum.value = pageNum;
  console.log(pageNum);
  pageNumber('handleClick', pageNum);
}
watch(() => props.data, (newData) => {
  tableData.value = [...newData];
});
watch(()=> props.total, (newTotal)=>{
  total.value = newTotal;
})

</script>
<style scoped>
.table-container {
  min-height: 400px;
  /* 테이블 높이 고정 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.pagination{
text-align: center;
}
</style>