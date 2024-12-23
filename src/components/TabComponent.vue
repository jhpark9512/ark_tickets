<template>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="Tab 1">
      <ChartComponent/>
    </a-tab-pane>
    <a-tab-pane key="2" tab="Tab 2" force-render>월별통계</a-tab-pane>
    <a-tab-pane key="3" tab="Tab 3">일별통계</a-tab-pane>
  </a-tabs>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import ChartComponent from './ChartComponent.vue';
const activeKey = ref('1');
</script>