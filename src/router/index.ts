import UserPage from '../views/UserPage.vue';
import AdminMain from '../views/AdminMain.vue';
import OfficePage from '../views/OfficePage.vue';
import InsertTickets from '../views/InsertTickets.vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';


const routes: Array<RouteRecordRaw> = [
    {
        path: '/UserPage',
        name: 'UserPage',
        component: UserPage
      },
      {
        path: '/AdminMain',
        name: 'AdminMain',
        component: AdminMain
      },
      {
        path: '/OfficePage/:id',
        name: 'OfficePage',
        component: OfficePage
      },
      {
        path: '/InsertTickets',
        name: 'InsertTickets',
        component: InsertTickets
      },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;