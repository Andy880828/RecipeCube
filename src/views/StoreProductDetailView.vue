<script setup>
import Swal from 'sweetalert2';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import SideBarCartComponent from '@/components/SideBarCartComponent.vue'; // 引入購物車的 component
import ShoppingListComponent from '@/components/ShoppingListComponent.vue';
import CouponComponent from '@/components/CouponComponent.vue';
import StoreChatComponent from '@/components/StoreChatComponent.vue';
import StoreChartComponent from '@/components/StoreChartComponent.vue';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
const BaseURL = import.meta.env.VITE_API_BASEURL;
const BaseUrlWithoutApi = BaseURL.replace('/api', ''); // 去掉 "/api" 得到基本的 URL;
const userId = localStorage.getItem('UserId');

const route = useRoute(); // 獲取當前路由
const products = ref([]);

onMounted(() => {
    initTippy();
});

const initTippy = function () {
    tippy('#store-home', {
        content: '商店首頁',
        placement: 'right-end',
        animation: 'fade',
    });
    tippy('#my-order', {
        content: '查看我的訂單',
        placement: 'right-end',
        animation: 'fade',
    });
    tippy('#my-cart', {
        content: '前往我的購物車',
        placement: 'right-end',
        animation: 'fade',
    });
};

// 取得商品id 獲取單一商品
const loadProductById = async (id) => {
    try {
        const response = await fetch(`${BaseURL}/Products/ProductsNcategory/${id}`);
        if (!response) {
            alert('請求商品失敗');
            return;
        }
        const data = await response.json();
        products.value = [data]; // 找到一個商品 將結果放入 products 列表
        console.log(data);
        console.log(`商品id=${route.params.id}`);
        // console.log(products)
        // console.log(products.value[0].unitQuantity)
    } catch (error) {
        console.log('fetch 請求商品失敗', error);
    }
};

loadProductById(route.params.id);
// 將商品加入購物車

const addToCart = (product) => {
    // 購物車清空邏輯=========================================================================

    const currentUserId = localStorage.getItem('UserId');
    // console.log(`目前登入的userId : ${currentUserId}`);
    const storeUserId = localStorage.getItem('storeUserId');
    // console.log(`目前的storeUserId : ${storeUserId}`);

    // 檢查用戶ID是否一致
    if (storeUserId !== currentUserId) {
        //如果 目前登入的userId 不等於 localStorage 裡的userId 清空 localStorage
        localStorage.setItem('productCart', JSON.stringify([]));
        localStorage.setItem('storeUserId', currentUserId);
        // console.log(`已經完成更改 localStorage_storeUserId : ${currentUserId} 且清除購物車`)
    } else {
        // console.log("跟上一個使用者是相同id不清除購物車")
    }
    // ===================================================================================
    if (userId && userId.length > 0) {
        // 從 localStorage 取得購物車資料 如果還沒有名為cart的localStorage 則為空陣列
        let cart = JSON.parse(localStorage.getItem('productCart')) || [];

        // 檢查是否已經有這商品
        const existingProduct = cart.find((item) => item.productId === product.productId);

        if (existingProduct) {
            const totalQuantity =
                existingProduct.quantity * product.unitQuantity + product.unitQuantity * selectQuantity.value;
            console.log(`商品已存在 判斷式數量 ${totalQuantity}`);
            if (totalQuantity <= product.stock) {
                // 如果商品存在購物車數量增加'商品數量選擇input_selectQuantity的value'
                existingProduct.quantity += selectQuantity.value;

                // 將購物車內容存進localStorage
                localStorage.setItem('productCart', JSON.stringify(cart));
                Swal.fire(`${product.productName} 已加入購物車！`);
                //加入成功後將 selectQuantity 重設為1
                selectQuantity.value = 1;
            } else {
                Swal.fire(
                    `不能超過庫存量，庫存為：${Math.floor(product.stock / product.unitQuantity)}，已經將 ${
                        existingProduct.quantity
                    } 個單位加入購物車`
                );
            }
        } else {
            const totalQuantity = product.unitQuantity * selectQuantity.value;
            console.log(`商品不存在 判斷式數量${totalQuantity}`);
            if (totalQuantity <= product.stock) {
                cart.push({ ...product, quantity: selectQuantity.value });

                // 將購物車內容存進localStorage
                localStorage.setItem('productCart', JSON.stringify(cart));
                Swal.fire(`${product.productName} 已加入購物車！`);
                //加入成功後將 selectQuantity 重設為1
                selectQuantity.value = 1;
            } else {
                Swal.fire(`不能超過庫存量，庫存為：${Math.floor(product.stock / product.unitQuantity)} 個單位`);
            }
        }
    } else {
        Swal.fire('請先登入或註冊會員！');
    }
    window.dispatchEvent(new Event('cart-updated'));
};

// 商品數量選擇
// 數量的響應式變量
const selectQuantity = ref(1);

// 減少數量但不能低於1
const decQuantity = (product) => {
    if (selectQuantity.value > 1) {
        selectQuantity.value -= 1;
        console.log(`目前商品數量選擇:${selectQuantity.value}`);
        console.log(`目前商品庫存:${product.stock}`);
    } else {
        Swal.fire('不能小於 1');
    }
};
// 增加單位量但不能超過stock
const incQuantity = (product) => {
    // 從 localStorage 取得購物車資料 如果還沒有名為cart的localStorage 則為空陣列
    let cart = JSON.parse(localStorage.getItem('productCart')) || [];

    // 檢查是否已經有這商品
    const existingProduct = cart.find((item) => item.productId === product.productId);

    if (existingProduct) {
        // 如果商品存在
        const totalQuantity =
            existingProduct.quantity * product.unitQuantity + product.unitQuantity * (selectQuantity.value + 1);

        totalQuantity <= product.stock
            ? (selectQuantity.value += 1)
            : Swal.fire(
                  `不能超過庫存量，庫存為：${Math.floor(product.stock / product.unitQuantity)}，已經將 ${
                      existingProduct.quantity
                  } 個單位加入購物車`
              );
    } else {
        // 如果商品不存在
        const totalQuantity = product.unitQuantity * (selectQuantity.value + 1);

        totalQuantity <= product.stock
            ? (selectQuantity.value += 1)
            : Swal.fire(`不能超過庫存量，庫存為：${Math.floor(product.stock / product.unitQuantity)} 個單位`);
    }
};

// 取得評論 Start
const evaluate = ref([]);

const loadEvaluates = async (productId) => {
    try {
        const response = await fetch(`${BaseURL}/ProductEvaluates/GetProductEvaluateWithUserName`);
        const data = await response.json();
        evaluate.value = data;
        // console.log('所有評論', evaluate.value);
        loadEvaluatesWithProductId(productId);
    } catch (error) {
        console.log(`fetch 請求商品評論失敗`, error);
    }
};

const evaluateByProductId = ref([]);
const loadEvaluatesWithProductId = (productId) => {
    if (evaluate.value && evaluate.value.length > 0) {
        // console.log('所有評論', evaluate.value);
        evaluateByProductId.value = evaluate.value.filter((comment) => comment.productId === productId);
        console.log('單商品評論', evaluateByProductId.value);
        // console.log('評論的商品ID=', productId);
        // console.log(`路由参数ID=${route.params.id}`);
    } else {
        evaluateByProductId.value = [];
        console.log('沒有評論');
    }
    // console.log(evaluateByProductId.value);
};
const productId = Number(route.params.id);
loadEvaluates(productId);
// 取得評論 End
</script>

<template>
    <!-- Single Page Header start -->
    <section>
        <div class="header">
            <div class="title">
                <h1>商品明細</h1>
                <h1>Product Details</h1>
            </div>
        </div>
    </section>
    <!-- Single Page Header End -->

    <!-- RouterLink Start -->
    <ol class="text-center py-0">
        <h4>
            <RouterLink :to="{ name: 'storeproduct' }" class="floating-icon" id="store-home"
                ><i class="fa-solid fa-shop"></i
            ></RouterLink>
            <RouterLink :to="{ name: 'cart' }" class="floating-icon-cart" id="my-cart"
                ><i class="fa-solid fa-cart-shopping"></i
            ></RouterLink>
            <RouterLink :to="{ name: 'order' }" class="floating-icon-order" id="my-order"
                ><i class="fa-solid fa-clipboard-list"></i
            ></RouterLink>
        </h4>
    </ol>
    <!-- RouterLink End -->

    <!-- 引入購物車 sidebar -->
    <SideBarCartComponent />
    <!-- 引入購物清單 -->
    <ShoppingListComponent />
    <!-- 引入我的優惠券 -->
    <CouponComponent />
    <!-- 引入聊天機器人 -->
    <StoreChatComponent />
    <!-- 引入消費統計圖表 -->
    <StoreChartComponent />

    <!-- Single Product Start -->
    <div class="container-fluid py-1 mt-5 d-flex justify-content-center">
        <div class="container py-1">
            <div class="row g-4 mb-5">
                <div class="col-lg-12 col-xl-12">
                    <div class="row g-4" v-for="product in products" :key="product.productId">
                        <div class="col-lg-4">
                            <div>
                                <!-- 商品圖片 -->
                                <div>
                                    <img
                                        :src="`${BaseUrlWithoutApi}/images/ingredient/${product.photo}?t=${Date.now()}`"
                                        class="img-fluid rounded"
                                        alt="Image"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-8">
                            <!-- 商品名稱 -->
                            <h4 class="fw-bold mb-3">{{ product.productName }}</h4>
                            <!-- 商品類別 -->
                            <p class="mb-3">類別: {{ product.category }}</p>
                            <!-- 商品價格 單位量 單位 -->
                            <h5 class="fw-bold mb-3">
                                $ {{ product.price }} / {{ product.unitQuantity }} {{ product.unit }}
                            </h5>
                            <!-- 商品描述 -->
                            <p class="mb-4">{{ product.description }}</p>
                            <!-- 商品數量input btn -->
                            <div class="quantity-control mb-4" style="width: 100px">
                                <div class="input-group-btn">
                                    <button class="quantity-btn" @click="decQuantity(product)">
                                        <i class="fa fa-minus"></i>
                                    </button>
                                </div>
                                <input type="text" class="quantity-input" :value="selectQuantity" readonly />
                                <div class="input-group-btn">
                                    <button class="quantity-btn" @click="incQuantity(product)">
                                        <i class="fa fa-plus"></i>
                                    </button>
                                </div>
                                <!-- <div v-if="isSoldout">
                                        <p>商品已無多餘庫存</p>
                                    </div> -->
                            </div>
                            <!-- 加入購物車按鈕 -->
                            <button
                                @click="addToCart(product)"
                                class="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary"
                            >
                                <i class="fa fa-shopping-bag me-2 text-primary"></i> 加入購物車
                            </button>
                            <!-- <button  :disabled="isSoldout" @click="addToCart(product)" class="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary"><i class="fa fa-shopping-bag me-2 text-primary"></i> 加入購物車</button> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Single Product End -->

    <!-- Comment Section Start -->
    <div class="container-fluid py-4 mt-0">
        <h3 class="text-center mb-4">評論區</h3>
        <div class="row g-3">
            <div class="col-12">
                <div v-if="evaluateByProductId.length > 0">
                    <div
                        class="card border-light shadow-sm mb-3"
                        v-for="evaluate in evaluateByProductId"
                        :key="evaluate.evaluateId"
                    >
                        <div class="card-body">
                            <!-- 評論者名稱和日期 -->
                            <div class="d-flex justify-content-between mb-2">
                                <h5 class="card-title mb-0">{{ evaluate.userName }}</h5>
                                <small class="text-muted">{{ evaluate.date }}</small>
                            </div>
                            <!-- 評論分數 -->
                            <p class="mb-2">
                                評分:
                                <el-rate
                                    v-model="evaluate.commentStars"
                                    size="large"
                                    :texts="['糟透了', '有點失望', '正常', '不錯', '太棒了']"
                                    show-text
                                    disabled
                                    disabled-void-color="#ebeab7"
                                />
                            </p>
                            <!-- 評論內容 -->
                            <p class="card-text">{{ evaluate.commentMessage }}</p>
                        </div>
                    </div>
                </div>
                <!-- 若無評論時顯示 -->
                <div v-else class="text-center">
                    <p class="text-muted">目前沒有評論</p>
                </div>
            </div>
        </div>
    </div>
    <!-- Comment Section End -->
</template>

<style lang="css" scoped>
@import '@/assets/css/StoreStyle.css';
/* header本人 */
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
/* 下方mask */
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

.quantity-control {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.quantity-btn {
    background: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.quantity-btn:hover {
    background: #e9ecef;
}

.quantity-input {
    width: 50px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
}
</style>
