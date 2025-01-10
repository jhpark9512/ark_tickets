<template>
    <div class="calender">
        <a-calendar v-model:value="date" @panelChange="handlePanelChange" @select="handleDateSelect">
            <template #dateCellRender="{ current }">
                <ul class="events">
                    <li v-for="event in getEvents(current)" :key="event.time">
                        {{ event.time }} 사용완료
                    </li>
                </ul>
            </template>
        </a-calendar>
        <a-modal v-model:open="isModalVisible" title="모달" @cancel="handleCancel">
            <div>
                <h3>{{ formattedSelectedDate }} 식권 사용기록</h3>
                <p>점심: {{ getMealUsage('점심') }}</p>
                <p>저녁: {{ getMealUsage('저녁') }}</p>
                <a-form @submit.prevent="handleSubmit">
                    <a-form-item>
                        <a-radio-group v-model:value="mealTime">
                            <a-radio value='점심'>점심</a-radio>
                            <a-radio value='저녁'>저녁</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-button type="primary" html-type="submit">식권사용</a-button>
                    <a-button danger type="primary" @click="cancelTicketUsage(mealTime)">식권사용취소</a-button>
                </a-form>
            </div>
            <template #footer></template>
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, computed, } from 'vue';
import { useRoute } from 'vue-router';
import { UserUsageData } from '../types/usage';
import dayjs, { Dayjs } from 'dayjs';


const route = useRoute();
const userId = String(route.params.id);
const userData = ref(<UserUsageData[]>([]));
const date = ref(dayjs());
const selectedYear = ref<number>(date.value.year());
const selectedMonth = ref<number>(date.value.month() + 1);
const selectedDate = ref<Dayjs | null>(null);

//모달관련 변수
const isModalVisible = ref(false);  //모달 상태
const isPanelChanging = ref(false); //패널 상태
//식권 사용기록 등록 변수
const mealTime = ref<string>('점심');

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
        userData.value = result.map((item: UserUsageData) => ({
            ...item,
            u_usage_used_date: formatDate(item.u_usage_used_date)
        }));
        console.log(userData.value)
    } catch (err) {
        console.error('에러 발생:', err);
    }
};

// 사용된 날짜 목록
const formatDate = (timestamp: string): string => {
    return dayjs(timestamp).format('YYYY-MM-DD');
};

const usedDates = computed(() => {
    return userData.value.map(data => ({
        date: dayjs(data.u_usage_used_date).format('YYYY-MM-DD'), // 날짜 형식
        time: data.u_usage_used_time, // 시간 추가
        type: data.u_usage_type
    }));
});

const getEvents = (current: Dayjs) => {
    const formattedCurrentDate = current.format('YYYY-MM-DD');
    const eventList = usedDates.value.filter(event => event.date === formattedCurrentDate);
    return eventList.filter(event => event.type !== false);
};

const handlePanelChange = (value: Dayjs) => {
    isPanelChanging.value = true
    selectedYear.value = value.year(); // 선택된 년도
    selectedMonth.value = value.month() + 1; // 선택된 월 (0부터 시작하므로 1 더함)
    selectedDate.value = null;
    console.log(userId)
    console.log(selectedYear.value)
    console.log(selectedMonth.value)
    userUsage(userId, selectedYear.value, selectedMonth.value)
};


//모달 관련 함수
const handleCancel = () => {
    isModalVisible.value = false; // 모달 닫기
};

const handleDateSelect = (date: Dayjs) => {
    if (isPanelChanging.value) {
        isPanelChanging.value = false; // 다음 선택을 위해 초기화
        return; // 패널 변경 중이라면 모달 열지 않음
    }
    selectedDate.value = date;
    isModalVisible.value = true;
    // let selectedDay = selectedDate.value.format('YYYY-MM-DD')
    // const record = userData.value.filter(event => event.u_usage_used_date === selectedDay);
    // console.log(record)
};

const formattedSelectedDate = computed(() => {
    return selectedDate.value ? selectedDate.value.format('YYYY-MM-DD') : '날짜 없음';
});

const getMealUsage = (time: string) => {
    const formattedDate = formattedSelectedDate.value;
    const mealRecord = usedDates.value.find(event => event.date === formattedDate && event.time === time && event.type);
    return mealRecord ? '사용완료' : '미사용';
};

//insert
const registerUsage = async () => {
    const payload = {
        userId: userId,
        usedDate: formattedSelectedDate.value,
        usedTime: mealTime.value,
        usedType: true,
    };
    console.log('아이디 : ' + userId)
    console.log('식사날짜 : ' + formattedSelectedDate.value)
    console.log('식사시간 : ' + mealTime.value)
    console.log(payload)
    try {
        const checkResponse = await fetch('/api/check_usage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!checkResponse.ok) {
            const errorData = await checkResponse.json();
            console.error('중복체크 오류 :', errorData.error);
            throw new Error(errorData.error);
        }
        const result = await checkResponse.json();
        const resultValue = result.data.check_usage_data

        if (resultValue == true) {
            alert('이미 식권을 사용하셨습니다')
            return;
        } else if (resultValue == false) {
            try {
                const response = await fetch('/api/insert_usage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error:', errorData.error);
                    throw new Error(errorData.error);
                }

                const result = await response.json();
                console.log('사용기록이 등록되었습니다:', result);
                userUsage(userId, selectedYear.value, selectedMonth.value);
            } catch (error) {
                console.error('사용기록 등록 중 오류 발생:', error);
            }
        } else {
            console.log('에러')
            return;
        }
    } catch (error) {
        console.error('사용기록 등록 중 오류 발생', error);
    }
};

//사용기록 수정 api
const cancelTicketUsage = async (mealTime: string) => {
    const foundUsage = userData.value.find(item =>
        item.u_usage_used_date === formattedSelectedDate.value &&
        item.u_usage_used_time === mealTime &&
        item.u_usage_type === true
    );

    let usageIndex = foundUsage?.u_usage_id
    if (usageIndex === undefined) {
        alert('식권사용기록이 없습니다')
    } else {
        const isConfirmed = confirm('식권 사용을 취소하시겠습니까?');
        if (!isConfirmed) {
            return;
        }
        console.log(usageIndex)
        const updateData = {
            usageId: usageIndex,
            usedType: false
        };
        try {
            const response = await fetch('/api/update_ticket_usages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('error :', errorData.error);
                throw new Error(errorData.error);
            }
            const result = await response.json();
            console.log('사용기록이 수정되었습니다 : ' + result.value)
            userUsage(userId, selectedYear.value, selectedMonth.value);
        } catch (error) {
            console.error('사용기록 등록 중 오류 발생', error);
        }
    }
}

const handleSubmit = () => {
    let result = confirm('식권을 사용하시겠습니까?')
    if (result) {
        registerUsage(); // API 호출
    } else {
        return;
    }
};

onMounted(() => {
    console.log(userId)
    console.log(selectedYear.value)
    console.log(selectedMonth.value)
    userUsage(userId, selectedYear.value, selectedMonth.value);
})
</script>
<style scoped>
.calender {
    width: 80%;
    height: 50%;
    margin: auto;
}
</style>