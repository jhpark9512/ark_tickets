<template>
    <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 6 }" autocomplete="off"
        @finish="submitRegisterData" @finishFailed="onFinishFailed">
        <a-form-item label="아이디" name="userId" :rules="[{ required: true, message: '아이디를 입력해주세요!' }]">
            <a-input v-model:value="formState.userId" />
        </a-form-item>

        <a-form-item label="비밀번호" name="password" :rules="[{ required: true, message: '비밀번호를 입력해주세요!' }]">
            <a-input-password v-model:value="formState.password" />
        </a-form-item>
        <a-form-item label="소속(회사)" name="companyId" :rules="[{ required: true, message: '회사를 선택해주세요!' }]">
            <a-input-group compact>
                <a-select v-model:value="formState.companyId" style="width: 100%">
                    <a-select-option value="" disabled>회사선택</a-select-option> 
                    <a-select-option value="ark_account">아크회계법인</a-select-option>
                    <a-select-option value="ark_it">AON_IT</a-select-option>
                </a-select>
            </a-input-group>
            <!-- <a-input v-model:value="formState.companyId" /> -->
        </a-form-item>
        <a-form-item label="이름" name="username" :rules="[{ required: true, message: '이름을 입력해주세요!' }]">
            <a-input v-model:value="formState.username" />
        </a-form-item>
        <a-form-item label="사무실" name="officeId" :rules="[{ required: true, message: '사무실을 선택해주세요!' }]">
            <a-input-group compact>
                <a-select v-model:value="formState.officeId" style="width: 100%">
                    <a-select-option value="" disabled>사무실선택</a-select-option>
                    <a-select-option value="SUNGSU2">성수빌딩 2층</a-select-option>
                    <a-select-option value="SUNGSU6">성수빌딩 6층</a-select-option>
                    <a-select-option value="ITC5">IT캐슬 5층</a-select-option>
                    <a-select-option value="ITC9">IT캐슬 9층</a-select-option>
                </a-select>
            </a-input-group>
        </a-form-item>
        <a-form-item label="부서" name="department" :rules="[{ required: true, message: '부서를 선택해주세요!' }]">
            <a-input-group compact>
                <a-select v-model:value="formState.department" style="width: 100%">
                    <a-select-option value="" disabled>부서선택</a-select-option>
                    <a-select-option value="세무기장">세무기장</a-select-option>
                    <a-select-option value="회계">회계</a-select-option>
                    <a-select-option value="경영지원">경영지원</a-select-option>
                    <a-select-option value="IT">IT</a-select-option>
                </a-select>
            </a-input-group>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
            <a-button type="primary" html-type="submit">회원가입</a-button>
            &emsp;
            <a-button type="primary" @click="goBack">뒤로가기</a-button>
        </a-form-item>
    </a-form>

</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

interface FormState {
    userId: string;
    password: string;
    companyId: string;
    username: string;
    userAuth: string;
    officeId: string;
    department: string;
}

const formState = reactive<FormState>({
    userId: '',
    password: '',
    companyId: '',
    username: '',
    userAuth: '사용자',
    officeId: '',
    department: '',
});

const router = useRouter();

const goBack = () => {
    router.go(-1);
}

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

const submitRegisterData = async (values: FormState) => {
    const dataToSubmit = {
        ...values,
        userAuth: '사용자', // 기본값으로 '사용자' 설정
    };

    console.log(dataToSubmit)

    try {
        const response = await fetch('/api/register_users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSubmit),
        });

        if (!response.ok) {
            // 응답이 성공적이지 않은 경우
            const errorData = await response.json();
            console.error('register failed:', errorData);
            throw new Error(errorData.error || '로그인에 실패했습니다.');
        }

        const result = await response.json();
        console.log('register successful:', result);
        // 로그인 성공 후 처리 (예: 리다이렉트, 상태 업데이트 등)
        alert('회원가입이 완료됐습니다')
        router.push('/LoginPage')
    } catch (error) {
        console.error('Error:', error);
    }
};
</script>