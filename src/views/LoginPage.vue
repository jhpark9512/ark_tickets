<template>
    <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 6 }" autocomplete="off"
        @finish="submitLoginData" @finishFailed="onFinishFailed">
        <a-form-item label="username" name="username"
            :rules="[{ required: true, message: 'Please input your username!' }]">
            <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item label="password" name="password"
            :rules="[{ required: true, message: 'Please input your password!' }]">
            <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
            <a-button type="primary" html-type="submit">로그인</a-button>
            &emsp;
            <a-button type="primary" @click="goToRegisterPage">회원가입</a-button>
        </a-form-item>
    </a-form>

</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { useAuthStore } from '../utilities/store';
import { useRouter } from 'vue-router';

interface FormState {
    username: string;
    password: string;
}

const formState = reactive<FormState>({
    username: '',
    password: '',
});

const authStore = useAuthStore();
const router = useRouter();

const submitLoginData = async (values: FormState) => {

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: values.username,
                password: values.password,
            }),
        });
        console.log(response)
        if (!response.ok) {
            alert('아이디 또는 비밀번호가 잘못되었습니다')
            throw new Error('Login Failed');
        }
        const result = await response.json();
        const { user_id, user_auth, user_name, token } = result
        console.log(result)
        console.log('로그인이 완료되었습니다, 토큰: ',result.token , result.userId, result.user_auth, result.user_name, )
        authStore.login(user_id, token, user_auth, user_name);

        console.log(user_auth)
        if (user_auth === '사용자') {
            router.push(`/UserPage/${user_id}`);
        } else if (user_auth === '관리자') {
            router.push('/Admin/AdminMain')
        } else {
            console.log('에러')
        }

    } catch (error) {
        console.error('Error :', error);
    }
};

const goToRegisterPage = () => {
    router.push('/RegisterPage')
}

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};
</script>