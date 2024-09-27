<template>
    <div class="container">
        <div class="top">
            <div class="card-area">
                <a-card style="border: 1px solid black;" title="사무실명" :bordered="false">
                    <p>사무실 상세 내용</p>
                </a-card>
            </div>
            <div class="button-area">
                <a-button type="primary">지급</a-button>
                <a-button type="primary" danger>회수</a-button>
                <a-button>지급기록</a-button>
            </div>
        </div>
        <div class="bottom">
            <p style="display: flex; float: right;">
                <SearchBarComponent />
            </p>
        </div>
    </div>
</template>
<script lang="ts" setup>
import SearchBarComponent from '../components/SearchBarComponent.vue';
</script>
<style scoped>
.container {
    display: grid;
    grid-template-rows: 1fr 2fr;
}

.top {
    display: grid;
    grid-template-columns: 400px 2fr;
}

.card-area {
    width: 400px;
    height: 200px;
    padding: 20px;
}

.button-area {
    display: grid;
    padding-top: 40px;
    width: 150px;
    height: 150px;
    justify-content: center;
    align-items: center;
}
</style>