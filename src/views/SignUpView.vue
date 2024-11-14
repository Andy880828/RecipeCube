<script setup>
import { ref } from 'vue';

const API_URL = `${import.meta.env.VITE_API_BASEURL}/Users/SignUp`;

const user = ref({
    email: '',
    password: '',
    DietaryRestrictions: false,
});

const registrationSuccess = ref(false);

const pwd1 = ref('');
const pwd2 = ref('');

const validatePasswords = () => {
    if (pwd1.value !== pwd2.value) {
        alert('兩次輸入的密碼不一致');
        return false;
    }
    return true;
};

const send = async () => {
    if (validatePasswords()) {
        user.value.password = pwd1.value; // 將密碼存入 user 對象
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(user.value),
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (response.ok) {
            // alert('註冊成功，請確認信箱！');
            registrationSuccess.value = true;
        } else {
            alert(data.message); // 顯示錯誤訊息
        }
    }
};
</script>

<template>
    <div class="page-header align-items-start min-vh-100 pt-5 pb-11 m-3">
        <span class="mask bg-gradient-dark opacity-6"></span>
        <div class="container">
            <div v-if="!registrationSuccess" class="row justify-content-center">
                <div class="col-lg-5 text-center mx-auto" style="color: white">
                    <h1 class="mb-2 mt-5 text-white">歡迎!</h1>
                    <p class="text-lead">填入資訊，快速成為會員!</p>
                </div>
                <form name="user" id="registerForm" class="registerForm blur" @submit.prevent="send" novalidate>
            <div class="form-floating mb-3">
                <input type="email" v-model.trim="user.email" class="form-control" placeholder="Email" required />
                <label>Email</label>
            </div>

            <div class="form-floating mb-3">
                <input type="password" v-model.trim="pwd1" class="form-control" placeholder="密碼" required />
                <label>密碼</label>
            </div>

            <div class="form-floating mb-3">
                <input type="password" v-model.trim="pwd2" class="form-control" placeholder="確認密碼" required />
                <label>確認密碼</label>
            </div>

            <!-- 飲食偏好選擇 -->
            <div class="mb-2 form-check text-center">
                <label class="form-check-label">
                    <input type="checkbox" v-model="user.DietaryRestrictions" class="form-check-input" required/>
                    {{ user.DietaryRestrictions ? '素食' : '葷食' }}
                </label>
            </div>

            <div class="text-center">
                <button class="btn bg-gradient-dark w-100">註冊</button>
            </div>
                </form>
            </div>
            <div v-else class="row justify-content-center">
                <div class="col-lg-5 text-center mx-auto" style="color: white">
                    <h1 class="mb-2 mt-5 text-white">註冊完成!</h1>
                    <p class="text-lead">請確認信箱，完成註冊驗證!</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
.page-header {
    background-image: url('@/assets/img/ForBackground/SignUp-bg.jpg');
    width: 100vw !important;
    margin-left: calc(50% - 50vw) !important;
    overflow: hidden;
}
.registerForm {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40%;
    transform: translate(-50%, -50%);
    padding: 15px 25px 0 25px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}
@media (max-width: 639px) {
    .registerForm {
        top: 40%;
        width: 60%;
    }
}
</style>
