<script setup>
import Handle from '@/assets/img/ForComponent/Handle.png';
import GreenPepper from '@/assets/img/ForComponent/GreenPepper.jpg';
import SoftBadge from '@/components/SoftBadge.vue';
</script>

<template>
    <section class="banner-section">
        <div class="banner-ad bg-success-subtle block-2">
            <div class="row banner-content p-5">
                <div class="content-wrapper col-md-12">
                    <h3>Trending Products</h3>
                    <header>
                        <div class="container-fluid">
                            <div class="row py-3">
                                <div class="col-sm-10 offset-sm-2 offset-md-0 col-lg-12 d-none d-lg-block">
                                    <div
                                        class="search-bar row bg-light p-2 my-2 rounded-4 d-flex justify-content-center align-items-center"
                                    >
                                        <div class="col-md-2 d-none d-md-block">
                                            <select class="form-select border-0 bg-transparent">
                                                <option>所有分類</option>
                                                <option>XX</option>
                                            </select>
                                        </div>
                                        <div class="col-11 col-md-9">
                                            <form
                                                id="search-form"
                                                class="text-center"
                                                action="index.html"
                                                method="post"
                                            >
                                                <input
                                                    type="text"
                                                    class="form-control border-0 bg-transparent text-center"
                                                    placeholder="搜尋食材"
                                                />
                                            </form>
                                        </div>
                                        <div class="col-1" style="transform: translateX(25%)">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                </div>
            </div>
        </div>
    </section>

    <section class="py-5">
        <div class="container-fluid">
            <div class="row py-3">
                <div class="d-flex justify-content-center align-items-center p-0">
                    <nav class="main-menu blur rounded-3 d-flex navbar navbar-expand-lg justify-content-center">
                        <div
                            class="offcanvas offcanvas-end"
                            tabindex="-1"
                            id="offcanvasNavbar"
                            aria-labelledby="offcanvasNavbarLabel"
                        >
                            <div class="offcanvas-header justify-content-center">
                                <button
                                    type="button"
                                    class="btn-close"
                                    data-bs-dismiss="offcanvas"
                                    aria-label="Close"
                                ></button>
                            </div>

                            <div class="offcanvas-body">
                                <select class="filter-categories border-0 mb-0 me-5">
                                    <option>Shop by Departments</option>
                                    <option>Groceries</option>
                                    <option>Drinks</option>
                                    <option>Chocolates</option>
                                </select>

                                <ul class="justify-content-end menu-list list-unstyled d-flex gap-md-3 mb-0">
                                    <li class="nav-item active">
                                        <a href="#women" class="nav-link">Women</a>
                                    </li>
                                    <li class="nav-item dropdown">
                                        <a href="#men" class="nav-link">Men</a>
                                    </li>
                                    <li class="nav-item"><a href="#kids" class="nav-link">Kids</a></li>
                                    <li class="nav-item">
                                        <a href="#accessories" class="nav-link">Accessories</a>
                                    </li>
                                    <li class="nav-item dropdown">
                                        <a
                                            class="nav-link dropdown-toggle"
                                            role="button"
                                            id="pages"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                            >Pages</a
                                        >
                                        <ul class="dropdown-menu" aria-labelledby="pages">
                                            <li>
                                                <a href="index.html" class="dropdown-item">About Us</a>
                                            </li>
                                            <li><a href="index.html" class="dropdown-item">Shop</a></li>
                                            <!-- Add other dropdown items here -->
                                        </ul>
                                    </li>
                                    <li class="nav-item">
                                        <a href="#brand" class="nav-link">Brand</a>
                                    </li>
                                    <li class="nav-item"><a href="#sale" class="nav-link">Sale</a></li>
                                    <li class="nav-item"><a href="#blog" class="nav-link">Blog</a></li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="bootstrap-tabs product-tabs">
                        <div class="tabs-header d-flex justify-content-between border-bottom my-5">
                            <h3>Trending Products</h3>
                            <nav>
                                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                    <a
                                        href="#"
                                        class="nav-link text-uppercase fs-6 active"
                                        id="nav-all-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#nav-all"
                                        >All</a
                                    >
                                    <a
                                        href="#"
                                        class="nav-link text-uppercase fs-6"
                                        id="nav-fruits-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#nav-fruits"
                                        >Fruits & Veges</a
                                    >
                                    <a
                                        href="#"
                                        class="nav-link text-uppercase fs-6"
                                        id="nav-juices-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#nav-juices"
                                        >Juices</a
                                    >
                                </div>
                            </nav>
                        </div>
                        <div class="tab-content" id="nav-tabContent">
                            <!-- All Products Tab -->
                            <div
                                class="tab-pane fade show active"
                                id="nav-all"
                                role="tabpanel"
                                aria-labelledby="nav-all-tab"
                            >
                                <div
                                    class="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5"
                                >
                                    <div class="col">
                                        <div class="card shadow-sm position-relative">
                                            <SoftBadge
                                                variant="gradient"
                                                color="info"
                                                class="position-absolute m-2 z-index-3"
                                                >即將過期</SoftBadge
                                            >
                                            <!-- <span class="badge bg-warning text-dark position-absolute m-2">即將過期</span> -->
                                            <div class="card-body position-relative">
                                                <div class="d-flex justify-content-center align-items-center">
                                                    <img :src="GreenPepper" alt="" class="w-75 mt-3" />
                                                    <span
                                                        class="amount-badge position-absolute translate-middle"
                                                        style="top: 60%; left: 50%"
                                                        >3個</span
                                                    >
                                                </div>
                                                <h5 class="card-title mt-5 w-100 text-center">青椒</h5>
                                                <p class="card-text w-100 text-center">蔬菜類</p>
                                                <p
                                                    class="card-text position-absolute translate-middle-x"
                                                    style="bottom: 2%; left: 50%"
                                                >
                                                    2024-10-03
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Additional product items go here -->
                                </div>
                            </div>

                            <!-- Fruits and Veges Tab -->
                            <div class="tab-pane fade" id="nav-fruits" role="tabpanel" aria-labelledby="nav-fruits-tab">
                                <div
                                    class="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5"
                                >
                                    <div class="col">
                                        <div class="card shadow-sm position-relative">
                                            <SoftBadge
                                                variant="gradient"
                                                color="info"
                                                class="position-absolute m-2 z-index-3"
                                                >即將過期</SoftBadge
                                            >
                                            <!-- <span class="badge bg-warning text-dark position-absolute m-2">即將過期</span> -->
                                            <div class="card-body position-relative">
                                                <div class="d-flex justify-content-center align-items-center">
                                                    <img :src="GreenPepper" alt="" class="w-75 mt-3" />
                                                    <span
                                                        class="amount-badge position-absolute translate-middle"
                                                        style="top: 60%; left: 50%"
                                                        >3個</span
                                                    >
                                                </div>
                                                <h5 class="card-title mt-5 w-100 text-center">青椒</h5>
                                                <p class="card-text w-100 text-center">蔬菜類</p>
                                                <p
                                                    class="card-text position-absolute translate-middle-x"
                                                    style="bottom: 2%; left: 50%"
                                                >
                                                    2024-10-03
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Additional product items go here -->
                                </div>
                            </div>

                            <!-- Juices Tab -->
                            <div class="tab-pane fade" id="nav-juices" role="tabpanel" aria-labelledby="nav-juices-tab">
                                <div
                                    class="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5"
                                >
                                    <div class="col">
                                        <div class="card shadow-sm position-relative">
                                            <SoftBadge
                                                variant="gradient"
                                                color="info"
                                                class="position-absolute m-2 z-index-3"
                                                >即將過期</SoftBadge
                                            >
                                            <!-- <span class="badge bg-warning text-dark position-absolute m-2">即將過期</span> -->
                                            <div class="card-body position-relative">
                                                <div class="d-flex justify-content-center align-items-center">
                                                    <img :src="GreenPepper" alt="" class="w-75 mt-3" />
                                                    <span
                                                        class="amount-badge position-absolute translate-middle"
                                                        style="top: 60%; left: 50%"
                                                        >3個</span
                                                    >
                                                </div>
                                                <h5 class="card-title mt-5 w-100 text-center">青椒</h5>
                                                <p class="card-text w-100 text-center">蔬菜類</p>
                                                <p
                                                    class="card-text position-absolute translate-middle-x"
                                                    style="bottom: 2%; left: 50%"
                                                >
                                                    2024-10-03
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Additional product items go here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="banner-section">
        <div class="banner-ad bg-success-subtle block-2">
            <div class="row banner-content p-5">
                <div class="content-wrapper col-md-12">
                    <h3>Trending Products</h3>
                    <h3>Trending Products</h3>
                    <h3>Trending Products</h3>
                </div>
            </div>
        </div>
    </section>

    <section class="py-1">
        <div class="container-fluid">
            <div
                class="bg-secondary py-5 my-5 rounded-5"
                style="background: url('images/bg-leaves-img-pattern.png') no-repeat"
            >
                <div class="container my-5">
                    <div class="row">
                        <div class="col-md-6 p-5">
                            <div class="section-header">
                                <h2 class="section-title display-4">
                                    Get <span class="text-primary">25% Discount</span> on your first purchase
                                </h2>
                            </div>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dictumst amet, metus, sit massa
                                posuere maecenas. At tellus ut nunc amet vel egestas.
                            </p>
                        </div>
                        <div class="col-md-6 p-5">
                            <form>
                                <div class="mb-3">
                                    <label for="name" class="form-label">Name</label>
                                    <input
                                        type="text"
                                        class="form-control form-control-lg"
                                        name="name"
                                        id="name"
                                        placeholder="Name"
                                    />
                                </div>
                                <div class="mb-3">
                                    <label for="" class="form-label">Email</label>
                                    <input
                                        type="email"
                                        class="form-control form-control-lg"
                                        name="email"
                                        id="email"
                                        placeholder="abc@mail.com"
                                    />
                                </div>
                                <div class="form-check form-check-inline mb-3">
                                    <label class="form-check-label" for="subscribe">
                                        <input
                                            class="form-check-input"
                                            type="checkbox"
                                            id="subscribe"
                                            value="subscribe"
                                        />
                                        Subscribe to the newsletter</label
                                    >
                                </div>
                                <div class="d-grid gap-2">
                                    <button type="submit" class="btn btn-dark btn-lg">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="py-5">
        <div class="container-fluid">
            <h2 class="my-5">People are also looking for</h2>
            <a href="#" class="badge bg-info me-2 mb-2">Blue diamon almonds</a>
            <a href="#" class="badge bg-info me-2 mb-2">Angie’s Boomchickapop Corn</a>
            <a href="#" class="badge bg-info me-2 mb-2">Salty kettle Corn</a>
            <a href="#" class="badge bg-info me-2 mb-2">Chobani Greek Yogurt</a>
            <a href="#" class="badge bg-info me-2 mb-2">Sweet Vanilla Yogurt</a>
            <a href="#" class="badge bg-info me-2 mb-2">Foster Farms Takeout Crispy wings</a>
            <a href="#" class="badge bg-info me-2 mb-2">Warrior Blend Organic</a>
            <a href="#" class="badge bg-info me-2 mb-2">Chao Cheese Creamy</a>
            <a href="#" class="badge bg-info me-2 mb-2">Chicken meatballs</a>
            <a href="#" class="badge bg-info me-2 mb-2">Blue diamon almonds</a>
            <a href="#" class="badge bg-info me-2 mb-2">Angie’s Boomchickapop Corn</a>
            <a href="#" class="badge bg-info me-2 mb-2">Salty kettle Corn</a>
            <a href="#" class="badge bg-info me-2 mb-2">Chobani Greek Yogurt</a>
            <a href="#" class="badge bg-info me-2 mb-2">Sweet Vanilla Yogurt</a>
            <a href="#" class="badge bg-info me-2 mb-2">Foster Farms Takeout Crispy wings</a>
            <a href="#" class="badge bg-info me-2 mb-2">Warrior Blend Organic</a>
            <a href="#" class="badge bg-info me-2 mb-2">Chao Cheese Creamy</a>
            <a href="#" class="badge bg-info me-2 mb-2">Chicken meatballs</a>
        </div>
    </section>

    <section class="py-5">
        <div class="container-fluid">
            <div class="row row-cols-1 row-cols-sm-3 row-cols-lg-5">
                <div class="col">
                    <div class="card mb-3 border-0">
                        <div class="row">
                            <div class="col-md-2 text-dark">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M21.5 15a3 3 0 0 0-1.9-2.78l1.87-7a1 1 0 0 0-.18-.87A1 1 0 0 0 20.5 4H6.8l-.33-1.26A1 1 0 0 0 5.5 2h-2v2h1.23l2.48 9.26a1 1 0 0 0 1 .74H18.5a1 1 0 0 1 0 2h-13a1 1 0 0 0 0 2h1.18a3 3 0 1 0 5.64 0h2.36a3 3 0 1 0 5.82 1a2.94 2.94 0 0 0-.4-1.47A3 3 0 0 0 21.5 15Zm-3.91-3H9L7.34 6H19.2ZM9.5 20a1 1 0 1 1 1-1a1 1 0 0 1-1 1Zm8 0a1 1 0 1 1 1-1a1 1 0 0 1-1 1Z"
                                    />
                                </svg>
                            </div>
                            <div class="col-md-10">
                                <div class="card-body p-0">
                                    <h5>Free delivery</h5>
                                    <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipi elit.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card mb-3 border-0">
                        <div class="row">
                            <div class="col-md-2 text-dark">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M19.63 3.65a1 1 0 0 0-.84-.2a8 8 0 0 1-6.22-1.27a1 1 0 0 0-1.14 0a8 8 0 0 1-6.22 1.27a1 1 0 0 0-.84.2a1 1 0 0 0-.37.78v7.45a9 9 0 0 0 3.77 7.33l3.65 2.6a1 1 0 0 0 1.16 0l3.65-2.6A9 9 0 0 0 20 11.88V4.43a1 1 0 0 0-.37-.78ZM18 11.88a7 7 0 0 1-2.93 5.7L12 19.77l-3.07-2.19A7 7 0 0 1 6 11.88v-6.3a10 10 0 0 0 6-1.39a10 10 0 0 0 6 1.39Zm-4.46-2.29l-2.69 2.7l-.89-.9a1 1 0 0 0-1.42 1.42l1.6 1.6a1 1 0 0 0 1.42 0L15 11a1 1 0 0 0-1.42-1.42Z"
                                    />
                                </svg>
                            </div>
                            <div class="col-md-10">
                                <div class="card-body p-0">
                                    <h5>100% secure payment</h5>
                                    <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipi elit.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card mb-3 border-0">
                        <div class="row">
                            <div class="col-md-2 text-dark">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22 5H2a1 1 0 0 0-1 1v4a3 3 0 0 0 2 2.82V22a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-9.18A3 3 0 0 0 23 10V6a1 1 0 0 0-1-1Zm-7 2h2v3a1 1 0 0 1-2 0Zm-4 0h2v3a1 1 0 0 1-2 0ZM7 7h2v3a1 1 0 0 1-2 0Zm-3 4a1 1 0 0 1-1-1V7h2v3a1 1 0 0 1-1 1Zm10 10h-4v-2a2 2 0 0 1 4 0Zm5 0h-3v-2a4 4 0 0 0-8 0v2H5v-8.18a3.17 3.17 0 0 0 1-.6a3 3 0 0 0 4 0a3 3 0 0 0 4 0a3 3 0 0 0 4 0a3.17 3.17 0 0 0 1 .6Zm2-11a1 1 0 0 1-2 0V7h2ZM4.3 3H20a1 1 0 0 0 0-2H4.3a1 1 0 0 0 0 2Z"
                                    />
                                </svg>
                            </div>
                            <div class="col-md-10">
                                <div class="card-body p-0">
                                    <h5>Quality guarantee</h5>
                                    <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipi elit.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card mb-3 border-0">
                        <div class="row">
                            <div class="col-md-2 text-dark">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M12 8.35a3.07 3.07 0 0 0-3.54.53a3 3 0 0 0 0 4.24L11.29 16a1 1 0 0 0 1.42 0l2.83-2.83a3 3 0 0 0 0-4.24A3.07 3.07 0 0 0 12 8.35Zm2.12 3.36L12 13.83l-2.12-2.12a1 1 0 0 1 0-1.42a1 1 0 0 1 1.41 0a1 1 0 0 0 1.42 0a1 1 0 0 1 1.41 0a1 1 0 0 1 0 1.42ZM12 2A10 10 0 0 0 2 12a9.89 9.89 0 0 0 2.26 6.33l-2 2a1 1 0 0 0-.21 1.09A1 1 0 0 0 3 22h9a10 10 0 0 0 0-20Zm0 18H5.41l.93-.93a1 1 0 0 0 0-1.41A8 8 0 1 1 12 20Z"
                                    />
                                </svg>
                            </div>
                            <div class="col-md-10">
                                <div class="card-body p-0">
                                    <h5>guaranteed savings</h5>
                                    <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipi elit.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card mb-3 border-0">
                        <div class="row">
                            <div class="col-md-2 text-dark">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M18 7h-.35A3.45 3.45 0 0 0 18 5.5a3.49 3.49 0 0 0-6-2.44A3.49 3.49 0 0 0 6 5.5A3.45 3.45 0 0 0 6.35 7H6a3 3 0 0 0-3 3v2a1 1 0 0 0 1 1h1v6a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-6h1a1 1 0 0 0 1-1v-2a3 3 0 0 0-3-3Zm-7 13H8a1 1 0 0 1-1-1v-6h4Zm0-9H5v-1a1 1 0 0 1 1-1h5Zm0-4H9.5A1.5 1.5 0 1 1 11 5.5Zm2-1.5A1.5 1.5 0 1 1 14.5 7H13ZM17 19a1 1 0 0 1-1 1h-3v-7h4Zm2-8h-6V9h5a1 1 0 0 1 1 1Z"
                                    />
                                </svg>
                            </div>
                            <div class="col-md-10">
                                <div class="card-body p-0">
                                    <h5>Daily offers</h5>
                                    <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipi elit.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="css" scoped>
/* *** Start editing below this line *** */
.container-fluid {
    max-width: 1600px;
}
.banner-blocks {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 2rem;
}
.block-1 {
    grid-area: 1 / 1 / 3 / 8;
}
.block-2 {
    grid-area: 1 / 8 / 2 / 13;
}
.block-3 {
    grid-area: 2 / 8 / 3 / 13;
}

@media screen and (max-width: 1140px) {
    .banner-blocks {
        grid-template-columns: 1fr;
        grid-template-rows: repeat(4, 1fr);
    }
    .block-1 {
        grid-area: 1 / 1 / 3 / 2;
    }
    .block-2 {
        grid-area: 3 / 1 / 4 / 2;
    }
    .block-3 {
        grid-area: 4 / 1 / 5 / 2;
    }
}

/* banner ad */
.banner-section {
    width: 100vw; /* 讓該區塊延伸到整個頁面寬 */
    margin-left: calc(-50vw + 50%); /* 調整位置來居中對齊 */
    background-image: url('@/assets/img/ForBackground/background-pattern.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    position: relative;
}
.banner-ad {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    background: url('@/assets/img/ForBackground/ad-bg-pattern.png') no-repeat;
    background-position: center; /* 將圖片置中對齊 */
    background-size: cover; /* 使背景圖片填滿區塊 */
}
.banner-ad .banner-content .banner-title {
    letter-spacing: 0.02em;
    font-size: 33px;
}
.banner-ad.large .banner-content .categories {
    color: var(--accent-color);
}
.banner-ad.large .banner-content .banner-title {
    font-size: 54px;
}
.product-tabs .nav-tabs {
    justify-content: flex-end;
    border: none;
}
.product-tabs .nav-tabs .nav-link.active,
.product-tabs .nav-tabs .nav-item.show .nav-link {
    /* border: none; */
    border-bottom: 3px solid var(--accent-color);
}
.amount-badge {
    display: inline-block;
    padding: 0.55em 1.5em;
    font-size: 1em;
    font-weight: 700;
    line-height: 1;
    color: black;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border: 2px solid black;
    border-radius: 1.5rem;
}
.card img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 保持圖片的比例，填滿卡片區域 */
    transition: transform 0.3s ease-in-out; /* 動畫效果 */
}
.card:hover img {
    transform: scale(1.1); /* 圖片放大 1.1 倍 */
}
</style>
