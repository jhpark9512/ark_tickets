import UserPage from '../views/UserPage.vue';
import AdminMain from '../views/AdminMain.vue';
import OfficePage from '../views/OfficePage.vue';
import InsertTickets from '../views/InsertTickets.vue';
import LoginPage from '../views/LoginPage.vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/LoginPage',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/UserPage/:id',
    name: 'UserPage',
    component: UserPage,
    meta: { requiresAuth: true, roles: ['user', 'admin'] }
  },
  {
    path: '/Admin/AdminMain',
    name: 'AdminMain',
    component: AdminMain,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/Admin/OfficePage/:id',
    name: 'OfficePage',
    component: OfficePage,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/Admin/InsertTickets',
    name: 'InsertTickets',
    component: InsertTickets,
    meta: { requiresAuth: true, role: 'admin' }
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 확인
  const role = localStorage.getItem('role'); // 로컬 스토리지에서 역할 확인

  const isAuthenticated = !!token; // 토큰이 있으면 인증된 것으로 간주
  // 인증이 필요한 페이지 접근 시 체크
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ path: '/LoginPage' }); // 로그인 페이지로 리디렉션
  }
  else if (to.meta.role && to.meta.role !== role) {
    next({ path: '/LoginPage' }); // 권한이 없을 경우 로그인 페이지로 리디렉션
  }
  else {
    next(); // 다음 라우트로 진행
  }
});

export default router;