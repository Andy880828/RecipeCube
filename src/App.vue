<style>
body {
    font-family: 'Cinzel', 'Chocolate Classical Sans', system-ui, sans-serif !important;
    margin: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    z-index: 0;
}

body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(5px);
    z-index: -1;
}

.main-content {
    margin-top: 75px;
}
</style>

<template>
    <Loader></Loader>
    <Navbar></Navbar>
    <main class="main-content container position-relative">
        <RouterView />
    </main>
    <Footer></Footer>
</template>

<script setup>
import Navbar from './components/Layout/Navbar.vue';
import Footer from './components/Layout/Footer.vue';
import Loader from './components/Layout/Loader.vue';
</script>
