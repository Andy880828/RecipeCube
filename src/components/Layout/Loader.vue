<script setup>
import { ref, onMounted } from 'vue';
const isLoaded = ref(false);

// onMounted(() => {
//     document.onreadystatechange = () => {
//         if (document.readyState === 'complete') {
//             isLoaded.value = true;
//         }
//     };
// });

onMounted(() => {
    document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
            // 稍微延遲一下不然看不到preloaderXD，之後東西多在改用上面那段
            setTimeout(() => {
                isLoaded.value = true;
            }, 1500);
        }
    };
});
</script>

<template>
    <div class="loader" v-if="!isLoaded">
        <div class="cube">
            <div class="face front"></div>
            <div class="face back"></div>
            <div class="face left"></div>
            <div class="face right"></div>
            <div class="face top"></div>
            <div class="face bottom"></div>
        </div>
    </div>
</template>

<style lang="css" scoped>
.loader {
    perspective: 800px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgb(233, 248, 255);
    display: -webkit-box;
    display: flex;
    -webkit-box-align: center;
    align-items: center; /* 垂直置中 */
    -webkit-box-pack: center;
    justify-content: center; /* 水平置中 */
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    opacity: 1;
    visibility: visible;
    z-index: 9999;
    -webkit-transition: opacity 0.25s ease;
    transition: opacity 0.25s ease;
}

.cube {
    width: 40px;
    height: 40px;
    position: relative;
    transform-style: preserve-3d;
    animation: spin 3s linear infinite;
}

.face {
    width: 40px;
    height: 40px;
    position: absolute;
    opacity: 0.8;
}

.front {
    transform: translateZ(20px);
    background-color: #3498db;
}

.back {
    transform: translateZ(-20px);
    background-color: #e74c3c;
}

.left {
    transform: rotateY(90deg) translateZ(20px);
    background-color: #2ecc71;
}

.right {
    transform: rotateY(-90deg) translateZ(20px);
    background-color: #f39c12;
}

.top {
    transform: rotateX(90deg) translateZ(20px);
    background-color: #9b59b6;
}

.bottom {
    transform: rotateX(-90deg) translateZ(20px);
    background-color: #e67e22;
}

@keyframes spin {
    0% {
        transform: rotateX(0) rotateY(0) rotateZ(0);
    }

    100% {
        transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
    }
}
</style>
