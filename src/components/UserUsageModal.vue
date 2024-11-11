<template>
    <a-modal v-model:visible="visible" title="사용 기록" @cancel="handleCancel">
        <div v-if="events.length">
            <ul>
                <li v-for="event in events" :key="event.time">
                    {{ event.time }} 사용완료
                </li>
            </ul>
        </div>
        <div v-else>
            <p>기록이 없습니다. 사용 여부를 선택하세요:</p>
            <a-radio-group v-model="selectedMeal">
                <a-radio value="lunch">점심</a-radio>
                <a-radio value="dinner">저녁</a-radio>
            </a-radio-group>
            <div>
                <a-button @click="handleSubmit('yes')">예</a-button>
                <a-button @click="handleSubmit('no')">아니오</a-button>
            </div>
        </div>
    </a-modal>
</template>
<script setup="ts">
import { ref, defineProps } from 'vue';

const props = defineProps < {
    visible: boolean,
    events: { time: string }[],
    onClose: () => void;
}>();

const selectedMeal = ref('');

const handleCancel = () => {
    props.onClose();
};

const handleSubmit = (response: string) => {
    // 서버에 사용 기록 저장 로직을 여기에 추가
    console.log(`선택된 식사: ${selectedMeal.value}, 응답: ${response}`);
    handleCancel();
};
</script>