<template>
  <div class="app">
    <a-layout>
        <NavigationBarComponent />
    </a-layout>
    <a-layout class="layout">
        <SideBarComponent/>
      <a-layout-content class="custom-content">
        <br/>
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
      <a-layout>
      <a-layout-footer class="custom-footer" style="background-color:dimgray">
        <p style="text-align: center;">ARK Company</p>
      </a-layout-footer>
    </a-layout>
  </div>

</template>

<script lang="ts" setup>
import NavigationBarComponent from './components/NavigationBarComponent.vue';
import SideBarComponent from './components/SideBarComponent.vue';
</script>
<style scoped>
.layout{
  display: flex;
  min-height: 100vh;
}
.custom-content{
  height: 100vh;
  padding: 20px;
  margin-left: 50px;
  margin-top: 70px;
}
.custom-sider{
  top: 0; /* 페이지 상단에서 고정 시작 */
  left: 0; /* 왼쪽에 고정 */
  width: 250px; /* 사이드바 너비 */
  height: 100vh; /* 화면 전체 높이 */
  padding-top: 80px;
  background-color: white;
  z-index: 1000; /* 다른 요소보다 앞에 오도록 설정 */
  overflow-y: auto; /* 사이드바 내용이 길면 스크롤 가능 */
  margin-top: 100px;
}

.custom-footer{
  background-color: #ececec;
  padding: 20px;
  text-align: center;
  position: fixed; /* 푸터를 고정 */
  bottom: 0; /* 화면의 하단에 고정 */
  left: 0;
  width: 100%; /* 화면 전체 너비 */
  height: 60px; /* 푸터 높이 */
  z-index: 1000; /* 다른 요소 위에 보이도록 */
}
</style>