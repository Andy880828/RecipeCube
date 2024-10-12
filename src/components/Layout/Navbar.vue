<style scoped>
.navbar-brand-img {
    max-width: 40px;
}
</style>

<template>
    <!-- Navbar -->
    <nav
        class="w-100 top-0 navbar navbar-expand-lg position-fixed z-index-3"
        :class="isTransparent ? 'shadow-none my-2 navbar-transparent' : 'blur rounded-3 shadow'"
    >
        <div class="container">
            <!-- Logo -->
            <RouterLink
                class="navbar-brand font-weight-bolder me-auto"
                to="/"
                v-bind="$attrs"
                :class="isTransparent ? 'text-white' : 'text-dark'"
            >
                <img src="@/assets/logo.svg" class="navbar-brand-img" alt="main_logo" />
                <span class="ms-1">RecipeCube</span>
            </RouterLink>

            <!-- RWD的下拉選單按鈕 -->
            <button
                class="navbar-toggler shadow-none ms-2"
                type="button"
                @click="toggleNavbar"
                aria-controls="navigation"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon mt-2">
                    <span class="navbar-toggler-bar bar1"></span>
                    <span class="navbar-toggler-bar bar2"></span>
                    <span class="navbar-toggler-bar bar3"></span>
                </span>
            </button>

            <div class="collapse navbar-collapse" :class="{ show: isNavbarShown }">
                <ul class="navbar-nav ms-auto text-center">
                    <li class="nav-item">
                        <RouterLink class="nav-link me-2" to="/inventory">
                            <i
                                class="fa-solid fa-box-open opacity-6 me-1"
                                aria-hidden="true"
                                :class="isTransparent ? 'text-white' : 'text-dark'"
                                @click="isNavbarShown = false"
                            ></i>
                            庫存管理
                        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link me-2" to="/buyandcook">
                            <i
                                class="fa-solid fa-utensils opacity-6 me-1"
                                aria-hidden="true"
                                :class="isTransparent ? 'text-white' : 'text-dark'"
                                @click="isNavbarShown = false"
                            ></i>
                            隨買隨煮
                        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link me-2" to="/addingredient">
                            <i
                                class="fa-solid fa-carrot opacity-6 me-1"
                                aria-hidden="true"
                                :class="isTransparent ? 'text-white' : 'text-dark'"
                                @click="isNavbarShown = false"
                            ></i>
                            加入食材
                        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link me-2" to="/customrecipe">
                            <i
                                class="fa-solid fa-pencil opacity-6 me-1"
                                aria-hidden="true"
                                :class="isTransparent ? 'text-white' : 'text-dark'"
                                @click="isNavbarShown = false"
                            ></i>
                            自訂食譜
                        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link me-2" to="/recipe">
                            <i
                                class="fa-solid fa-book-bookmark opacity-6 me-1"
                                aria-hidden="true"
                                :class="isTransparent ? 'text-white' : 'text-dark'"
                                @click="isNavbarShown = false"
                            ></i>
                            食譜總覽
                        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link me-2" to="/store">
                            <i
                                class="fa-brands fa-shopify opacity-6 me-1"
                                aria-hidden="true"
                                :class="isTransparent ? 'text-white' : 'text-dark'"
                                @click="isNavbarShown = false"
                            ></i>
                            食材採購
                        </RouterLink>
                    </li>
                </ul>
                <ul class="navbar-nav ms-auto text-center">
                    <li class="nav-item">
                        <RouterLink class="nav-link me-2" to="/user">
                            <i
                                class="fa fa-user opacity-6 me-1"
                                aria-hidden="true"
                                :class="isTransparent ? 'text-white' : 'text-dark'"
                                @click="isNavbarShown = false"
                            ></i>
                            使用者設定
                        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link me-2" to="/">
                            <i
                                class="fas fa-sign-out-alt opacity-6 me-1"
                                aria-hidden="true"
                                :class="isTransparent ? 'text-white' : 'text-dark'"
                                @click="isNavbarShown = false"
                            ></i>
                            登出
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <!-- End Navbar -->
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    isTransparent: {
        type: Boolean,
        default: false,
    },
});

// 控制導航欄展開/收起的狀態
const isNavbarShown = ref(false);

// 切換導航欄的函數
const toggleNavbar = () => {
    isNavbarShown.value = !isNavbarShown.value;
};
</script>
