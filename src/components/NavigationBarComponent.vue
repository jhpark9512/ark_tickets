<template>
  <div class="header">
  <a-layout class="layout">
    <a-layout-header >
      <div class="logo">
        ARK
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1" @click="goToUserPage">식권사용</a-menu-item>
        <a-menu-item key="2" @click="goToAdminMain">식권통계</a-menu-item>
        <a-menu-item key="3" @click="goToInsertTickets">식권등록</a-menu-item>
      </a-menu>
    </a-layout-header>
  </a-layout>
</div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const selectedKeys = ref<string[]>(['2']);

const goToInsertTickets = () => {
  router.push('/InsertTickets');
}
const goToAdminMain = () => {
  router.push('/AdminMain');
}
const goToUserPage = () => {
  router.push('/UserPage');
}

</script>
<style scoped>

.logo{
  float: left;
  width: 50px;
  height: 31px;
  line-height: 31px;
  margin: 16px 100px 16px 20px;
  font-size: 24px;
  color: white;
}
.header {
  position: fixed; /* 헤더를 화면 상단에 고정 */
  top: 0; /* 상단 고정 */
  left: 0;
  width: 100%; /* 화면 전체 너비 */
  height: 60px; /* 헤더 높이 */
  color: white; /* 텍스트 색 */
  z-index: 1000; /* 다른 요소보다 앞에 오도록 설정 */
  padding: 10px 20px;
}
.site-layout-content {
  min-height: 280px;
  padding: 24px;
  background: #fff;
}
#components-layout-demo-top .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}
.ant-row-rtl #components-layout-demo-top .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

[data-theme='dark'] .site-layout-content {
  background: #141414;
}
</style>