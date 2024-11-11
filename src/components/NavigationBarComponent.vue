<template>
  <div class="header">
    <a-layout class="layout">
      <a-layout-header class="menu-container">
        <div class="logo">
          ARK
        </div>
        <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
          <a-menu-item key="1" @click="goToUserPage">식권사용</a-menu-item>
          <a-menu-item key="3" @click="goToInsertTickets">식권등록</a-menu-item>
          <a-menu-item key="2" @click="goToAdminMain">식권통계</a-menu-item>
        </a-menu>
        <a-button 
      danger 
      type="primary" 
      class="logout-button" 
      :class="{ visible: isLoggedIn }" 
      key="logout" 
      @click="logout">
      로그아웃
    </a-button>
      </a-layout-header>
    </a-layout>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, watchEffect, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../utilities/store';

const router = useRouter();
const route = useRoute();
const selectedKeys = ref<string[]>(['1']);
const authStore = useAuthStore();
const isLoggedIn = ref(!!localStorage.getItem('token') && !!localStorage.getItem('role'));

watchEffect(() => {
  isLoggedIn.value = authStore.isAuthenticated;
});

const logout = () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    authStore.logout();
    isLoggedIn.value = false;
    router.push('/LoginPage');
  } else {
    return;
  }

};

const updateSelectedKey = () =>{
  if(route.path.includes('UserPage')){
    selectedKeys.value = ['1'];
  } else if (route.path.includes('AdminMain')) {
    selectedKeys.value = ['2'];
  } else if (route.path.includes('InsertTickets')) {
    selectedKeys.value = ['3'];
  }
};

watch(route, updateSelectedKey, { immediate: true });

const goToUserPage = () => {
  selectedKeys.value = ['1']
  const userId = authStore.userId
  router.push(`/UserPage/${userId}`);
}
const goToInsertTickets = () => {
  selectedKeys.value = ['2']
  router.push('/Admin/InsertTickets');
}
const goToAdminMain = () => {
  selectedKeys.value = ['3']
  router.push('/Admin/AdminMain');
}

onMounted(() => {
  authStore.checkAuth(); // 인증 상태 확인
  isLoggedIn.value = authStore.isAuthenticated; // 상태 업데이트
});

</script>
<style scoped>
.logo {
  float: left;
  width: 50px;
  height: 31px;
  line-height: 31px;
  margin: 16px 100px 16px 20px;
  font-size: 24px;
  color: white;
}

.header {
  position: fixed;
  /* 헤더를 화면 상단에 고정 */
  top: 0;
  /* 상단 고정 */
  left: 0;
  width: 100%;
  /* 화면 전체 너비 */
  height: 60px;
  /* 헤더 높이 */
  color: white;
  /* 텍스트 색 */
  z-index: 1000;
  /* 다른 요소보다 앞에 오도록 설정 */
  padding: 10px 20px;
}

.menu-container{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}
.logo {
  margin-right: 50px;
}
.logout-button {
  margin-left: auto;
  visibility: hidden;
}

.logout-button.visible {
  visibility: visible;  
}

.site-layout-content {
  min-height: 280px;
  padding: 24px;
  background: #fff;
}


</style>