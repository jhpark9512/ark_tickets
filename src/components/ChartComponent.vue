<template>
  <div class="chart-container">
    <Bar ref="myChart" id="my-chart-id" :options="chartOptions" :data="chartData" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// 반응형 데이터 및 참조 정의
const yearInput = ref<number>(2024);
const loaded = ref<boolean>(false);
const chartData = reactive({
  labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  datasets: [{ data: Array(12).fill(0) }] // 초기 데이터 = 0
});
const chartOptions = {
  responsive: true,
};

// year 매개변수의 타입을 number로 명시
const usageStatistics = async (year: number): Promise<void> => {
  try {
    const response = await fetch('/api/usage_statistics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ yearInput: year })
    });
    if (!response.ok) {
      throw new Error('네트워크 응답이 좋지 않습니다.');
    }
    const usageData = await response.json(); // API 응답 데이터

    // 월별 사용량을 chartData에 할당
    usageData.data.forEach((item: { month: number; usage_count: number }) => {
      chartData.datasets[0].data[item.month - 1] = item.usage_count; // 월에 맞게 데이터 할당
    });
    loaded.value = true;
  } catch (error) {
    console.error('데이터를 가져오는 중 오류 발생:', error);
  }
};

// 컴포넌트가 마운트된 후 데이터 가져오기
onMounted(() => {
  usageStatistics(yearInput.value);
});
</script>
<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 500px;
}
</style>