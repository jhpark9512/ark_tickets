<template>
    <div class="calender">
        <a-calendar v-model:value="date" @panelChange="handlePanelChange">
            <template #dateCellRender="{ current }">
                <ul class="events">
                    <!-- current가 usedDates에 있는지 확인 -->
                    <li v-for="event in getEvents(current)" :key="event.date">
                        {{ event.time }} 사용완료
                    </li>
                </ul>
            </template>
        </a-calendar>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { UserUsageData } from '../types/usage';
import dayjs,{Dayjs} from 'dayjs';

const route = useRoute();
const userId = String(route.params.id);
const userData = ref(<UserUsageData[]>([]));
const date = ref(dayjs());
const selectedYear = ref<number>(date.value.year());
const selectedMonth = ref<number>(date.value.month() + 1);

const userUsage = async (userId: string, year: number, month: number) => {
    try {
        const response = await fetch('/api/user_usages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId, month: month, year: year })
        });
        if (!response.ok) {
            console.log('no response')
            return;
        }
        const result: UserUsageData[] = await response.json();
        userData.value = result;
        console.log(userData.value)
    } catch (err) {
        console.error('에러 발생:', err);
    }
};

// 사용된 날짜 목록
const usedDates = computed(() => {
    return userData.value.map(data => ({
        date: dayjs(data.u_usage_used_date).format('YYYY-MM-DD'), // 날짜 형식
        time: data.u_usage_used_time // 시간 추가
    }));
});

const getEvents = (current: Dayjs) => {
    const formattedCurrentDate = current.format('YYYY-MM-DD');
    return usedDates.value.filter(event => event.date === formattedCurrentDate);
};

const handlePanelChange = (value: Dayjs) => {
    const selectedYear = value.year(); // 선택된 년도
    const selectedMonth = value.month() + 1; // 선택된 월 (0부터 시작하므로 1 더함)
    console.log('선택된 년도:', selectedYear);
    console.log('선택된 월:', selectedMonth);
    userUsage(userId, selectedYear, selectedMonth)
};

onMounted(() => {
    userUsage(userId, selectedYear.value, selectedMonth.value);
    console.log(selectedYear.value)
    console.log(selectedMonth.value)
})

</script>
<style scoped>
.calender {
    width: 80%;
    height: 50%;
    margin: auto;
}
</style>