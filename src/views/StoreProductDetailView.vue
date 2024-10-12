<script setup>
    import '@/assets/js/store.js'
</script>

<template>
        <!-- Single Page Header start -->
        <div class="container-fluid page-header py-5">
            <h1 class="text-center custom-color display-6">商品明細</h1>
            <ol class="breadcrumb justify-content-center mb-0">
                <li class="breadcrumb-item"><a href="#">商店首頁</a></li>
                <li class="breadcrumb-item"><a href="#">Pages</a></li>
                <li class="breadcrumb-item active text-white">商品明細</li>
            </ol>
        </div>
        <!-- Single Page Header End -->

        <!-- RouterLink Start -->
        <ol class="text-center py-0" >
        <h4>
            <RouterLink :to="{ name: 'storeproduct' }" class="floating-icon"><i class="fa-solid fa-shop"></i></RouterLink>
            <RouterLink :to="{ name: 'cart' }"  class="floating-icon-cart"><i class="fa-solid fa-cart-shopping"></i></RouterLink>
            <RouterLink :to="{ name: 'chickout' }">結帳</RouterLink> |
            <RouterLink :to="{ name: 'storeProductDetail' }">商店明細</RouterLink>
        </h4>
        </ol>
        <!-- RouterLink End -->

        <!-- Single Product Start -->
        <div class="container-fluid py-5 mt-5 d-flex justify-content-center">
            <div class="container py-5">
                <div class="row g-4 mb-5">
                    <div class="col-lg-12 col-xl-12">
                        <div class="row g-4">
                            <div class="col-lg-6">
                                <div class="border rounded">
                                    <a href="#">
                                        <img src="@/assets/img/Store/single-item.jpg" class="img-fluid rounded" alt="Image">
                                    </a>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <h4 class="fw-bold mb-3">品名</h4>
                                <p class="mb-3">種類: 類別</p>
                                <h5 class="fw-bold mb-3">$100 /5 顆</h5>
                                <p class="mb-4">小白菜，又稱為小白菜心，是一種常見的綠葉蔬菜，屬於十字花科。它的葉片嫩綠，質地柔軟，口感清爽，營養豐富，富含維生素A、C和膳食纖維。小白菜適合多種烹調方式，無論是清炒、燉湯或做成涼拌菜，皆能保留其鮮美風味。因其生長迅速，易於栽培，成為農民和家庭餐桌上的熱門選擇。這種蔬菜不僅美味，還有助於促進健康，適合各年齡層食用。</p>
                                <div class="input-group quantity mb-5" style="width: 100px;">
                                    <div class="input-group-btn">
                                        <button class="btn btn-sm btn-minus rounded-circle bg-light border" >
                                            <i class="fa fa-minus"></i>
                                        </button>
                                    </div>
                                    <input type="text" class="form-control form-control-sm text-center border-0" value="1">
                                    <div class="input-group-btn">
                                        <button class="btn btn-sm btn-plus rounded-circle bg-light border">
                                            <i class="fa fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <a href="#" class="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary"><i class="fa fa-shopping-bag me-2 text-primary"></i> 加入購物車</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Single Product End -->
</template>

<style lang="css" scoped>
    @import "@/assets/css/StoreBootstrap.min.css";
    @import "@/assets/css/StoreStyle.css";
</style>