<template>
    <div class="skeleton-card">
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
            <div class="skeleton-title"></div>
            <div class="skeleton-tags"></div>
            <div class="skeleton-missing-ingredients"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RecipeSkeleton',
};
</script>

<style scoped>
.skeleton-card {
    display: flex;
    align-items: center;
    padding: 10px;
    height: 140px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.skeleton-image {
    width: 150px;
    height: 120px;
    background-color: #ccc;
    border-radius: 8px;
    margin-right: 15px;
}

.skeleton-content {
    flex-grow: 1;
}

.skeleton-title {
    width: 150px;
    height: 20px;
    background-color: #ccc;
    margin-bottom: 10px;
    border-radius: 4px;
}

.skeleton-tags {
    width: 200px;
    height: 15px;
    background-color: #ddd;
    margin-bottom: 10px;
    border-radius: 4px;
}

.skeleton-missing-ingredients {
    width: 100px;
    height: 15px;
    background-color: #e2e2e2;
    border-radius: 4px;
}

@keyframes skeleton-loading {
    0% {
        background-color: #ccc;
    }
    50% {
        background-color: #f0f0f0;
    }
    100% {
        background-color: #ccc;
    }
}
.skeleton-title,
.skeleton-tags,
.skeleton-missing-ingredients {
    animation: skeleton-loading 0.8s infinite ease-in-out;
}
</style>
