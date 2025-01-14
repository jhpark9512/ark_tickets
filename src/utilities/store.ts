import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const token = ref<string | null>(null);
  const role = ref<string | null>(null);
  const userId = ref<string | null>(null);
  const userName = ref<string | null>(null);

  const login = (userIdValue: string, tokenValue: string, roleValue: string, userNameValue: string) => {
    isAuthenticated.value = true;
    token.value = tokenValue;
    role.value = roleValue === '관리자' ? 'admin' : roleValue === '사용자' ? 'user' : null;
    userId.value = userIdValue;
    userName.value = userNameValue;
    localStorage.setItem('userId', userIdValue);
    localStorage.setItem('token', tokenValue);
    localStorage.setItem('userName', userNameValue )
    if (role.value) {
      console.log(role.value)
      localStorage.setItem('role', role.value);
    }
  };

  const logout = () => {
    isAuthenticated.value = false;
    token.value = null;
    role.value = null;
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  const checkAuth = () => {
    isAuthenticated.value = !!localStorage.getItem('token'); // 토큰 존재 여부 확인
    userId.value = localStorage.getItem('userId');
    role.value = localStorage.getItem('role') as 'user' | 'admin' | null; // 역할 가져오기
    userName.value = localStorage.getItem('userName');
  };

  return {
    isAuthenticated,
    token,
    role,
    userId,
    userName,
    login,
    logout,
    checkAuth,
  };
});