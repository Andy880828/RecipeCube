<script setup>
import wasteFood from '@/assets/img/ForBackground/wasteFood.jpg';
import WOW from 'wow.js';
import 'wow.js/css/libs/animate.css';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useScrollStore } from '@/stores/scrollStore';
const scrollStore = useScrollStore();
const { appScrollContainer } = storeToRefs(scrollStore);

onMounted(() => {
    if (appScrollContainer.value?.wrapRef) {
        //為滾動容器添加一個ID
        appScrollContainer.value.wrapRef.id = 'wow-scroll-container';

        const wow = new WOW({
            boxClass: 'wow',
            animateClass: 'animated',
            mobile: true,
            live: true,
            scrollContainer: '#wow-scroll-container', //使用ID選擇器
        });
        wow.init();
    }
});
</script>

<template>
    <section>
        <div class="header">
            <div class="title">
                <h1>關於我們</h1>
                <h1>About Us</h1>
            </div>
        </div>
    </section>

    <!-- 聲明 -->
    <section class="mt-5">
        <div class="d-flex justify-content-center">
            <div class="text-center">
                <p class="fs-4">此網頁僅供學習用途，所有圖片均來自網路資源，如有侵權將盡速撤銷</p>
                <p class="fs-4">
                    This website is for educational purposes only. All image are sourced from Internet, if there is any
                    infringement, we will remove it ASAP.
                </p>
            </div>
        </div>
    </section>

    <!-- 簡介理念 -->
    <section class="mt-5">
        <div class="brief-section container-fluid">
            <div class="row g-5 align-items-center">
                <div class="col-md-6">
                    <img :src="wasteFood" alt="" />
                </div>
                <div class="col-md-6">
                    <p class="intro">認識我們——</p>
                    <h2 class="subject">我們的理念</h2>
                    <p class="content mt-3 mb-5">
                        你知道嗎？每年有將近<strong>三分之一</strong>的食物在還沒上桌前就變成了垃圾，而我們家中的冰箱恰恰是這些浪費的來源之一。
                        當你打開冰箱，看著那堆不知何時買的青菜、剩下一半的洋蔥，然後心想：「我真的會用到它們嗎？」答案通常是——<strong>不會</strong>，它們最後總會進垃圾桶。
                        這個網站就是為了改變這種情況誕生的！我們的目標是幫助每個人利用現有的食材隨時找到創意十足的食譜，讓剩餘食材變身一道道美味。
                        希望透過這樣的工具，幫助大家實現“零浪費”的夢想，共同創造一個更永續、環保的未來。
                    </p>
                    <a href="https://www.foodbank-taiwan.org.tw/food-resource"><button>了解更多</button></a>
                </div>
            </div>
        </div>
    </section>
    <!-- 成員介紹 -->
    <section class="mt-6">
        <div class="team container-fluid pt-5">
            <div class="row text-center">
                <h2>團隊成員</h2>
                <p class="content">每個優秀團隊成員各司其職，在各自的功能開發上追求盡善盡美</p>
            </div>
            <div class="row mt-3">
                <div class="offset-xl-1 col-md-6 col-lg-6 col-xl-2 wow fadeInUp" data-wow-delay="0.2s">
                    <div class="team-item">
                        <div class="team-img">
                            <img src="@/assets/img/ForComponent/members/識齊.jpg" class="img-fluid" alt="" />
                        </div>
                        <div class="team-title">
                            <h4 class="mb-0">王識齊</h4>
                            <p class="mb-0">組長 Leader</p>
                            <div class="team-icon">
                                <span class="badge bg-dark">專案整合與管理</span>
                                <span class="badge bg-dark">前後端開發</span>
                                <span class="badge bg-dark">商城功能負責人</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-6 col-xl-2 wow fadeInUp" data-wow-delay="0.4s">
                    <div class="team-item">
                        <div class="team-img">
                            <img src="@/assets/img/ForComponent/members/柏霖.png" class="img-fluid" alt="" />
                        </div>
                        <div class="team-title">
                            <h4 class="mb-0">蘇柏霖</h4>
                            <p class="mb-0">技術長 CTO</p>
                            <div class="team-icon">
                                <span class="badge bg-dark">前後端技術援助</span>
                                <span class="badge bg-dark">前後端開發</span>
                                <span class="badge bg-dark">食譜功能負責人</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-6 col-xl-2 wow fadeInUp" data-wow-delay="0.6s">
                    <div class="team-item">
                        <div class="team-img">
                            <img src="@/assets/img/ForComponent/members/維謙.png" class="img-fluid" alt="" />
                        </div>
                        <div class="team-title">
                            <h4 class="mb-0">洪維謙</h4>
                            <p class="mb-0">組員 Member</p>
                            <div class="team-icon">
                                <span class="badge bg-dark">個人資訊安全管理</span>
                                <span class="badge bg-dark">前後端開發</span>
                                <span class="badge bg-dark">會員功能負責人</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-6 col-xl-2 wow fadeInUp" data-wow-delay="0.8s">
                    <div class="team-item">
                        <div class="team-img">
                            <img src="@/assets/img/ForComponent/members/家豐.jpg" class="img-fluid" alt="" />
                        </div>
                        <div class="team-title">
                            <h4 class="mb-0">宋家豐</h4>
                            <p class="mb-0">組員 Member</p>
                            <div class="team-icon">
                                <span class="badge bg-dark">協助系統測試</span>
                                <span class="badge bg-dark">資料統籌管理</span>
                                <span class="badge bg-dark">資料庫負責人</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-6 col-xl-2 wow fadeInUp" data-wow-delay="1s">
                    <div class="team-item">
                        <div class="team-img">
                            <img src="@/assets/img/ForComponent/members/敬勛.png" class="img-fluid" alt="" />
                        </div>
                        <div class="team-title">
                            <h4 class="mb-0">林敬勛</h4>
                            <p class="mb-0">組員 Member</p>
                            <div class="team-icon">
                                <span class="badge bg-dark">前端結構與樣式設計</span>
                                <span class="badge bg-dark">前後端開發</span>
                                <span class="badge bg-dark">庫存功能負責人</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="css" scoped>
/* header 本人 */
.header {
    position: relative;
    overflow: hidden;
    height: 40vh;
    width: 100vw;
    margin-left: calc(50% - 50vw);
    color: #eee;
    z-index: 0;
}
/* 背景 */
.header:before {
    content: '';
    width: 100%;
    height: 200%;
    position: absolute;
    top: 0;
    left: 0;
    transform: translateZ(0) scale(1, 1);
    background: #1b2030 url('@/assets/img/ForBackground/bg-header.jpg') 50% 0 no-repeat;
    background-size: cover;
    background-attachment: fixed;
    animation: grow 180s linear 10ms infinite;
    transition: all 0.4s ease-in-out;
    z-index: -2;
}
/* 下方 mask */
.header:after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 40%, rgb(254, 254, 254) 100%);
}
/* 文字 */
.title {
    width: 100%;
    padding-top: 5%;
    text-align: center;
    text-shadow: 0 2px 3px rgba(255, 255, 255, 0.4);
}
/* 上下移動縮放特效 */
@keyframes grow {
    0% {
        transform: scale(1) translateY(0px);
    }
    50% {
        transform: scale(1.2) translateY(-250px);
    }
}

.content {
    color: rgb(62, 62, 62);
    line-height: 3rem;
}

/* 理念 */
.brief-section img {
    width: 100%;
    height: 80vh;
    border-radius: 2rem;
    object-fit: cover;
}
.brief-section .intro {
    color: gray;
}
.brief-section button {
    background-color: transparent;
    border: 3px solid #354868;
    border-radius: 1rem;
    font-size: larger;
    font-weight: 400;
    padding: auto;
    box-shadow: 1px 1px 1px rgb(30, 30, 30);
}
.brief-section button:hover {
    background-color: rgb(240, 249, 252);
    border: 3px solid #43516a;
    box-shadow: 1px 1px 2px rgb(30, 30, 30);
}

.team {
    background-color: rgba(212, 212, 212, 0.3);
    width: 100vw;
    margin-left: calc(50% - 50vw);
}

.team .team-item {
    position: relative;
    padding: 0 25px 25px 25px;
    margin-bottom: 3rem;
    border-radius: 10px;
    transition: 0.5s;
}

.team .team-item::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0;
    left: 0;
    background: var(--bs-light);
    border-radius: 10px;
    transition: 0.5s;
    z-index: -1;
}

.team .team-item:hover::before {
    height: 0;
}

.team .team-item::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 0;
    bottom: 0;
    left: 0;
    border-radius: 10px;
    transition: 0.5s;
    z-index: -1;
}

.team .team-item:hover::after {
    height: 100%;
    background: var(--bs-dark);
}

.team .team-item .team-img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
    position: relative;
    margin-top: 50%;
    transform: translateY(-50%);
    margin-bottom: -50%;
    display: flex;
    justify-content: center;
    border: 4px solid var(--bs-dark);
    border-style: dotted;
    padding: 4px;
    background: var(--bs-white);
    transition: 0.5s;
}

.team .team-item:hover .team-img {
    border: 4px solid var(--bs-white);
    border-style: dotted;
    background: 0;
}

.team .team-item .team-img img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
    transition: 0.5s;
}

.team .team-item .team-title {
    padding: 25px 0 15px 0;
    text-align: center;
}

.team .team-item .team-title h4,
.team .team-item .team-title p {
    transition: 0.5s;
}

.team .team-item:hover .team-title h4,
.team .team-item:hover .team-title p {
    color: var(--bs-white);
}

.team .team-item .team-icon {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 0.5rem;
}

.team .team-item .team-icon span {
    transition: 0.5s;
}

.team .team-item:hover .team-icon span {
    color: var(--bs-dark);
    background: var(--bs-white) !important;
}

.team .team-item:hover .team-icon span:hover {
    color: var(--bs-dark);
    background: var(--bs-dark);
}
</style>
