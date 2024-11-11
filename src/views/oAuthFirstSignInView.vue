<script setup>
import { ref } from 'vue';
import { useOAuthStore } from '@/stores/oauth';
import { useOAuthLineStore } from '@/stores/oauthLine';
const oauthStore = useOAuthStore();
const oauthLineStore = useOAuthLineStore();
const dietaryRestrictions = ref(false);
const oAuthLineUserEmail = ref(localStorage.getItem('oAuthLineUserEmail')|| null);

const handleLoginClick = async () => {
    if(oAuthLineUserEmail.value != null) {
        const loginlineSuccess = await oauthLineStore.oAuthFirstSignIn(dietaryRestrictions.value); 
    }
    else {
        const loginSuccess = await oauthStore.oAuthFirstSignIn(dietaryRestrictions.value); 
    }
};
</script>

<template>
    <section>
        <div class="container-fluid py-0">
            <div class="restrict-section rounded-3">
                <div class="restrict-box">
                    <h2 class="restrict-title text-black">歡迎您成為我們的會員</h2>
                    <h5 class="restrict-text mt-3">現在請選擇您的飲食偏好</h5>
                    <form name="user" id="registerForm" @submit.prevent="handleLoginClick" novalidate>
                        <div class="restrict-form mx-auto">
                            <div class="d-flex justify-content-center align-items-center mb-0">
                                <!-- 第一個 Radio Button: 素食 -->
                                <input
                                    type="radio"
                                    class="form-check-input me-2 custom-radio"
                                    name="dietaryPreference"
                                    v-model="dietaryRestrictions"
                                    id="nonVegetarian"
                                    :value="true"
                                />
                                <label for="nonVegetarian" class="form-check-label me-4 mt-2 fs-6">我是素食者</label>
                                <!-- 第二個 Radio Button: 葷食 -->
                                <input
                                    type="radio"
                                    class="form-check-input me-2 custom-radio"
                                    name="dietaryPreference"
                                    v-model="dietaryRestrictions"
                                    id="vegetarian"
                                    :value="false"
                                />
                                <label for="vegetarian" class="form-check-label mt-2 fs-6">我是葷食者</label>
                                <!-- 顯示錯誤訊息 -->
                                <span class="text-danger ms-3">{{ dietaryMessage }}</span>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-sm btn-success rounded-3 mb-0 fs-6">送出</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="css" scoped>
.custom-radio {
    accent-color: #00bb07;
    outline: 2px solid #00bb07;
    /* 設置選中時的外框顏色 */
    outline-offset: 2px;
    /* 控制外框與元素間的距離 */
    transition: outline 0.2s ease-in-out;
    /* 增加過渡效果 */
}

.custom-radio:checked {
    outline: 2px solid #00bb45;
    /* 勾選時的顏色，可以調整 */
}

.restrict-section {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 2rem;
    background-image: url('@/assets/img/ForBackground/restrict-bg.jpg');
    background-size: cover;
    background-position: center;
    height: 100vh;
    width: 100vw;
    margin-left: calc(50% - 50vw);
    overflow: hidden;
}

.restrict-box {
    background-color: rgba(255, 255, 255, 0.9);
    padding: 2rem;
    width: 50%;
    text-align: center;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.restrict-title {
    font-weight: bold;
    letter-spacing: 0.1em;
}

.restrict-text {
    font-weight: bold;
    letter-spacing: 0.1em;
}

.restrict-form {
    font-size: 1rem;
    color: black;
    border: 3px solid #aae874;
    margin: 1rem;
    padding: 1rem;
    border-radius: 1rem;
    width: 50%;
}

.form-control:focus {
    border-color: #b2e8c5 !important;
    outline: 0;
    box-shadow: 0 0 0 2px #b2e8c5 !important;
}
</style>
