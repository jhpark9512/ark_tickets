<template>
  <div>
    <a-dropdown>
      <template #overlay>
        <a-menu @click="handleMenuClick">
          <a-menu-item key="1">

            2023년
          </a-menu-item>
          <a-menu-item key="2">

            2024년
          </a-menu-item>
          <a-menu-item key="3">

            2025년
          </a-menu-item>
        </a-menu>
      </template>
      <a-button>
        {{ yearInput }}년
      </a-button>
    </a-dropdown>
  </div>
  <div v-if="loaded" class="chart-container">
    <Bar ref="myChart" id="my-chart-id" :options="chartOptions" :data="chartData" />
  </div>
  <div v-else>
  <p>데이터가 없습니다.</p> <!-- 데이터가 없을 때 표시할 메시지 -->
</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch} from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// 반응형 데이터 및 참조 정의
const company = ['ark_account', 'ark_it'];
const yearInput = ref<number>(2025);
const loaded = ref<boolean>(false);
const chartData = ref({
  labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  datasets: [
    {
      label: 'ARK',
      data: Array(12).fill(0), // 초기 데이터 = 0
      backgroundColor: 'rgba(75, 192, 192, 0.6)', // 바 색상 설정
      borderColor: 'rgba(75, 192, 192, 1)', // 바 테두리 색상 설정
      borderWidth: 1 // 바 테두리 두께 설정
    },
    {
      label: 'AON',
      data: Array(12).fill(0),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }
  ]
});

const chartOptions = {
  responsive: true,
};

const handleMenuClick = (e: { key: string }) => {
  // 선택된 메뉴 아이템의 키에 따라 년도 설정
  switch (e.key) {
    case '1':
      yearInput.value = 2023;
      console.log(yearInput.value);
      break;
    case '2':
      yearInput.value = 2024;
      console.log(yearInput.value);
      break;
    case '3':
      yearInput.value = 2025;
      console.log(yearInput.value);
      break;
    default:
      yearInput.value = 2024;
  }
};

// year 매개변수의 타입을 number로 명시
const usageStatistics = async (company: String[], year: number): Promise<void> => {
  try {
    const response = await fetch('/api/usage_statistics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ companyId: company, yearInput: year })
    });
    if (!response.ok) {
      alert('해당년도 데이터가 없습니다')
      loaded.value = false;
      throw new Error('해당년도 데이터가 없습니다');
    }
    const usageData = await response.json(); // API 응답 데이터
    console.log(usageData)

    // 배열 데이터 초기화
    const newDataARK = new Array(12).fill(0); 
    const newDataAON = new Array(12).fill(0); 

    // 월별 사용량을 chartData에 할당
    usageData.data.forEach((item: { month: number; usage_count: number; company_id: string }) => {
      if (item.company_id === 'ark_account') {
        newDataARK[item.month - 1] = item.usage_count; // ARK 데이터셋에 값 할당
      } else if (item.company_id === 'ark_it') {
        newDataAON[item.month - 1] = item.usage_count; // AON 데이터셋에 값 할당
      }
    });

    // 새로운 데이터로 업데이트
    chartData.value = {
      labels: chartData.value.labels,
      datasets: [
        { ...chartData.value.datasets[0], data: newDataARK },
        { ...chartData.value.datasets[1], data: newDataAON }
      ]
    };

    

    loaded.value = true;
    
    console.log(usageData)
    console.log(chartData.value)
  } catch (error) {
    console.error('데이터를 가져오는 중 오류 발생:', error);
  }
};

// 컴포넌트가 마운트된 후 데이터 가져오기
onMounted(() => {
  usageStatistics(company, yearInput.value);
});
watch(yearInput,(newValue)=>{
  usageStatistics(company, newValue)
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