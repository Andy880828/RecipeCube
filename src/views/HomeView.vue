<script setup>
import CountUp from 'vue-countup-v3';
import WOW from 'wow.js';
import { storeToRefs } from 'pinia';
// swiper
// import { Swiper, SwiperSlide } from 'swiper/vue';
// import { EffectCreative, Pagination, Autoplay, Navigation } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/effect-creative';
// import 'wow.js/css/libs/animate.css';
import { ref, onMounted, onBeforeMount, watch, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
import { useScrollStore } from '@/stores/scrollStore';
const scrollStore = useScrollStore();
const { appScrollContainer, scrollPosition } = storeToRefs(scrollStore);

const BaseURL = import.meta.env.VITE_API_BASEURL;
const BaseUrlWithoutApi = BaseURL.replace('/api', '');
const homeApiURL = `${BaseURL}/home`;

const startCount = ref(false);

// swiper
// 設定
// const isDataLoaded = ref(false);

// const swiperOptions = {
//     spaceBetween: 80,
//     initialSlide: 3,
//     grabCursor: true,
//     centeredSlides: true,
//     slidesPerView: 'auto',
//     navigation: true,
//     pagination: {
//         clickable: true,
//     },
//     autoplay: {
//         delay: 3000,
//         disableOnInteraction: false,
//         pauseOnMouseEnter: true,
//     },
//     modules: [EffectCreative, Pagination, Autoplay, Navigation],
//     loop: true,
// };

// Swiper 初始化完成的處理函數
// const onSwiperInit = (swiper) => {
//     if (swiper && randomRecipes.value.length > 0) {
//         swiper.update();
//         swiper.autoplay.start();
//     }
// };

// 確保在數據加載完成後再渲染 Swiper
// const shouldRenderSwiper = computed(() => {
//     return isDataLoaded.value && randomRecipes.value.length > 0;
// });

// 響應式物件存資料庫統計數據
const amounts = ref({
    recipeAmount: 0,
    ingredientAmount: 0,
    groupAmount: 0,
    userAmount: 0,
});

// 響應式物件存隨機3食譜
// const randomRecipes = ref([]);

// mount前先抓好資料
onBeforeMount(async () => {
    //fetch資料庫統計數據
    const AmountResponse = await fetch(homeApiURL);
    if (!AmountResponse.ok) {
        throw new Error('API有異常');
    }
    const data = await AmountResponse.json();
    amounts.value = {
        recipeAmount: data.recipeAmount,
        ingredientAmount: data.ingredientAmount,
        groupAmount: data.groupAmount,
        userAmount: data.userAmount,
    };

    //fetch抓隨機5個內建食譜
    // const randomRecipeResponse = await fetch(`${homeApiURL}/Recommend`);
    // if (!randomRecipeResponse.ok) {
    //     throw new Error('API有異常');
    // }
    // randomRecipes.value = await randomRecipeResponse.json();
    // isDataLoaded.value = true;
});

onMounted(() => {
    if (appScrollContainer.value?.wrapRef) {
        //為滾動容器添加一個ID
        appScrollContainer.value.wrapRef.id = 'wow-scroll-container';

        const wow = new WOW({
            boxClass: 'wow',
            animateClass: 'animated',
            offset: 100,
            mobile: true,
            live: true,
            scrollContainer: '#wow-scroll-container', //使用ID選擇器
        });
        wow.init();
    }
});

watch(scrollPosition, (newPosition) => {
    if (newPosition >= 800) {
        startCount.value = true;
    }
});
</script>

<template>
    <section>
        <div class="banner-wrapper">
            <div class="banner-section hero-area hero-bg">
                <div class="container py-5">
                    <div class="row">
                        <div>
                            <div class="hero-text">
                                <div class="hero-text-tablecell">
                                    <p class="subtitle">總是擔心浪費食材嗎?</p>
                                    <h1>食譜魔方 RecipeCube</h1>
                                    <div class="mt-3">
                                        <RouterLink to="/buyandcook"
                                            ><button class="btn bg-gradient-warning me-3">
                                                試用隨買隨煮
                                            </button></RouterLink
                                        >
                                        <RouterLink
                                            v-if="!authStore.token || !authStore.checkTokenExpiry"
                                            :to="{ name: 'signup' }"
                                            ><button class="btn btn-outline-warning">註冊會員</button></RouterLink
                                        >
                                        <RouterLink v-else to="/store"
                                            ><button class="btn btn-outline-warning">立即採購食材</button></RouterLink
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- <section>
        <swiper v-if="shouldRenderSwiper" v-bind="swiperOptions" @swiper="onSwiperInit">
            <swiper-slide v-for="(recipe, index) in randomRecipes" :key="recipe.recipeId" class="swiper-slide">
                <img :src="`${BaseUrlWithoutApi}/images/recipe/${recipe.photo}`" class="swiper-img" />
            </swiper-slide>
        </swiper>
    </section> -->

    <section class="service-section banner-wrapper">
        <div class="container-fluid pb-6 pt-5">
            <div class="container">
                <div class="row g-5 mb-4 wow animate__fadeInUp" data-wow-delay="0.1s">
                    <div class="col">
                        <h1 class="display-4 mb-0 pb-0" style="font-weight: 800">特色功能</h1>
                    </div>
                </div>
                <div class="row g-4 p-0">
                    <div class="col-lg-6 wow animate__fadeInUp" data-wow-delay="0.1s">
                        <div class="service-item d-flex flex-column flex-sm-row blur rounded-3 h-100 p-4">
                            <div class="bg-icon flex-shrink-0 mb-3">
                                <i class="fa fa-utensils fa-2x text-warning"></i>
                            </div>
                            <div class="ms-sm-4">
                                <h4 class="mb-3">食材管理</h4>
                                <span
                                    >輕鬆管理您的食材庫存，追蹤保鮮期，避免浪費。系統會提醒您即將到期的食材，並推薦相關食譜。</span
                                >
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 wow animate__fadeInUp" data-wow-delay="0.3s">
                        <div class="service-item d-flex flex-column flex-sm-row blur rounded-3 h-100 p-4">
                            <div class="bg-icon flex-shrink-0 mb-3">
                                <i class="fa fa-book-open fa-2x text-warning"></i>
                            </div>
                            <div class="ms-sm-4">
                                <h4 class="mb-3">動態食譜推薦</h4>
                                <span>根據您選擇的食材庫存，自動推薦最適合的食譜，讓您充分利用現有食材。</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 wow animate__fadeInUp" data-wow-delay="0.1s">
                        <div class="service-item d-flex flex-column flex-sm-row blur rounded-3 h-100 p-4">
                            <div class="bg-icon flex-shrink-0 mb-3">
                                <i class="fa fa-users fa-2x text-warning"></i>
                            </div>
                            <div class="ms-sm-4">
                                <h4 class="mb-3">「隨買隨煮」</h4>
                                <span
                                    >您也可以不使用庫存中的食材，讓我們為您推薦食譜，並在料理後再幫您將食材加入庫存，這適用於剛買完食材的狀況。</span
                                >
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 wow animate__fadeInUp" data-wow-delay="0.3s">
                        <div class="service-item d-flex flex-column flex-sm-row blur rounded-3 h-100 p-4">
                            <div class="bg-icon flex-shrink-0 mb-3">
                                <i class="fa fa-mobile-alt fa-2x text-warning"></i>
                            </div>
                            <div class="ms-sm-4">
                                <h4 class="mb-3">行動購物清單</h4>
                                <span
                                    >根據庫存消耗狀態自動生成採購清單，讓您在購物時更有效率。支援多人共享，方便家庭成員協作。</span
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section>
        <div class="container-fluid py-6">
            <div class="container">
                <div class="row g-4">
                    <div class="col-lg-3 col-md-6 wow animate__fadeInDown" data-wow-delay="0.1s">
                        <div class="fact-item blur rounded-3 text-center h-100 p-5">
                            <i class="fa-solid fa-book fa-4x text-dark mb-4"></i>
                            <p class="mb-2 fs-5">我們擁有的食譜</p>
                            <CountUp
                                v-if="startCount"
                                class="counter text-dark display-4 mb-0"
                                :end-val="amounts.recipeAmount"
                                :duration="2.5"
                            />
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 wow animate__fadeInDown" data-wow-delay="0.3s">
                        <div class="fact-item blur rounded-3 text-center h-100 p-5">
                            <i class="fa-solid fa-bread-slice fa-4x text-dark mb-4"></i>
                            <p class="mb-2 fs-5">提供已定義的食材</p>
                            <CountUp
                                v-if="startCount"
                                class="counter text-dark display-4 mb-0"
                                :end-val="amounts.ingredientAmount"
                                :duration="2.5"
                            />
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 wow animate__fadeInDown" data-wow-delay="0.5s">
                        <div class="fact-item blur rounded-3 text-center h-100 p-5">
                            <i class="fa-solid fa-users fa-4x text-dark mb-4"></i>
                            <p class="mb-2 fs-5">目前的群組</p>
                            <CountUp
                                v-if="startCount"
                                class="counter text-dark display-4 mb-0"
                                :end-val="amounts.groupAmount"
                                :duration="2.5"
                            />
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 wow animate__fadeInDown" data-wow-delay="0.7s">
                        <div class="fact-item blur rounded-3 text-center h-100 p-5">
                            <i class="fa-solid fa-user fa-4x text-dark mb-4"></i>
                            <p class="mb-2 fs-5">目前的使用者</p>
                            <CountUp
                                v-if="startCount"
                                class="counter text-dark display-4 mb-0"
                                :end-val="amounts.userAmount"
                                :duration="2.5"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section>
        <div class="container-fluid py-3">
            <div class="shop-section rounded-3">
                <div class="shop-box">
                    <div class="shop-logo">cube</div>
                    <h2 class="shop-title">商店</h2>
                    <p class="shop-description">
                        我們另附設有賣場，您可於我們的賣場中買到我們為您準備的新鮮食材，除有專人宅配到府，還會在到貨後自動與我們的系統聯動，將食材加入庫存，進一步節省您的寶貴時間。
                    </p>
                    <RouterLink class="shop-link" to="/store">點擊進入商店 →</RouterLink>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="css" scoped>
.banner-wrapper {
    position: relative;
    width: 100vw;
    margin-left: calc(50% - 50vw);
    overflow: hidden;
}

.banner-section {
    width: 100%;
    position: relative;
}

.hero-bg {
    background-image: url('@/assets/img/ForBackground/header.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
}

.hero-text {
    display: table;
    height: 100%;
    width: 100%;
}

.hero-text-tablecell {
    display: table-cell;
    padding: 150px 0;
}

.hero-area {
    position: relative;
    z-index: 1;
}

.hero-area:after {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    content: '';
    background-color: #07212e;
    z-index: -1;
    opacity: 0.6;
}

.hero-text p.subtitle {
    color: #f28123;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 7px;
    font-size: 20px;
}

.hero-text h1 {
    font-size: 64px;
    font-weight: 700;
    line-height: 1.3;
    color: #fff;
}

.service-section {
    background-image: url('@/assets/img/ForBackground/inventory1.jpg'); /* Replace with your image path */
    background-size: cover;
    background-position: center;
}

.service-item {
    transition: all 0.3s ease;
    border: 1px solid #eee;
}

.service-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.bg-icon {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff3cd;
    border-radius: 50%;
}

.fact-item {
    margin-bottom: 2rem;
    transition: all 0.5s ease;
    border: 4px solid rgba(80, 80, 80, 0.1);
}

.fact-item:hover {
    transform: translateY(-10px);
    background: #ffffff !important;
    box-shadow: 0 0 45px rgba(0, 0, 0, 0.07);
}

.shop-section {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 2rem;
    background-image: url('@/assets/img/ForBackground/inventory.jpg');
    background-size: cover;
    background-position: center;
    height: 100vh;
}

.shop-box {
    background-color: rgba(255, 255, 255, 0.9);
    padding: 2rem;
    max-width: 400px;
    text-align: center;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.shop-logo {
    display: inline-block;
    background-color: black;
    color: white;
    font-weight: bold;
    padding: 0.5rem;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
}

.shop-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0.5rem 0;
    letter-spacing: 0.1em;
}

.shop-description {
    font-size: 1rem;
    color: #555;
    margin-bottom: 1rem;
}

.shop-link {
    display: inline-block;
    color: #d35400;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-decoration: none;
    margin-top: 1rem;
    padding-bottom: 0.2rem;
    border-bottom: 2px solid #d35400;
}

.shop-link:hover {
    color: #e67e22;
    border-bottom-color: #e67e22;
}

.floating-buttons {
    position: absolute;
    right: 2rem;
    bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.floating-buttons .button {
    background-color: #ff9f43;
    color: white;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

.floating-buttons .button:hover {
    background-color: #f39c12;
}

.swiper {
    width: 100%;
    padding-top: 30px;
    padding-bottom: 50px;
}

.swiper-slide {
    background-position: center;
    background-size: cover;
    width: 300px;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 10px;
}

.swiper-img {
    display: block;
    width: 300px;
    height: 250px;
    object-fit: cover;
    border-radius: 10px;
}
</style>
