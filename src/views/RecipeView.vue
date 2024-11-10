<script setup>
import { ref, onMounted, computed, watch, nextTick, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useRecipeStore } from '@/stores/recipeStore';
import { useIngredientStore } from '@/stores/ingredientStore';
import { useRecipeFilterStore } from '@/stores/recipeFilterStore';
import Swal from 'sweetalert2';
import BannerRecipe from '@/assets/img/ForBackground/banner-recipe.jpg';
import RecipeFilterComponent from '@/components/RecipeFilterComponent.vue';
import RecipeDetailComponent from '@/components/RecipeDetailComponent.vue';
import RecipeSkeleton from '@/components/RecipeSkeleton.vue';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import { useRouter } from 'vue-router';
const router = useRouter();
// 使用 Pinia 的 recipeStore
const recipeStore = useRecipeStore();
const ingredientStore = useIngredientStore();
const recipeFilterStore = useRecipeFilterStore();
const { ingredients, groupedIngredients } = storeToRefs(ingredientStore);
const { filters, selectedIngredients } = storeToRefs(recipeFilterStore); // 改成從 storeToRefs 中取得 filters
const { fetchIngredients } = ingredientStore;
const recipes = computed(() => recipeStore.recipes);
const currentPage = ref(1);
const pageSize = ref(8);
const BaseURL = import.meta.env.VITE_API_BASEURL; // https://localhost:7188/api
const BaseUrlWithoutApi = BaseURL.replace('/api', ''); // 去掉 "/api" 得到基本的 URL;
// 需要推薦的食譜數據
const recommendedRecipe = ref(null);
const isRandomRecommend = ref(false); // 控制是否顯示重新推薦按鈕
const UserId = localStorage.getItem('UserId'); // 從 localStorage 中取得 userId
// 判斷是否在加載
const isLoading = ref(true);

// 在組件加載後獲取數據
onMounted(async () => {
    isLoading.value = true;
    await recipeStore.fetchRecipes();
    isLoading.value = false;
});

const getRecipeImageUrl = (fileName) => {
    return `${BaseUrlWithoutApi}/images/recipe/${fileName}`;
};

// 當用戶點擊“推薦我食譜！”按鈕時，調用 API
const recommendRecipe = async () => {
    try {
        const response = await fetch(`${BaseURL}/RecommendRecipe/RandomRecommend`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('無法獲取推薦食譜');
        }

        recommendedRecipe.value = await response.json();
        recipeStore.selectRecipe(recommendedRecipe.value); // 使用 Pinia 的 store 設定選中的食譜
        isRandomRecommend.value = true; // 顯示重新推薦按鈕
        recipeStore.dialogVisible = true; // 打開對話框以顯示推薦食譜
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: '推薦失敗',
            text: '無法獲取推薦食譜，請稍後重試',
        });
    }
};

// 當用戶點擊 "重新隨機推薦" 時
const reRecommendRecipe = async () => {
    await recommendRecipe(); // 調用推薦函數重新獲取推薦食譜
    onDialogOpened();
};

const resetActiveStep = ref(false);
// Create a ref for the scrollable container
const scrollContainer = ref(null);

// 當打開對話框時，重置子組件中的 activeStep
const onDialogOpened = () => {
    if (scrollContainer.value) {
        const psInstance = scrollContainer.value.$el; // Get the underlying DOM element of PerfectScrollbar
        psInstance.scrollTop = 0; // Reset the scroll position to top
    }
    resetActiveStep.value = true;
    // 確保這個重置只發生一次
    setTimeout(() => {
        resetActiveStep.value = false;
    }, 0);
};

//#region 搜尋功能
// 處理來自篩選組件的篩選條件變更
function handleFilterChange(newFilters) {
    // console.log('Received new filters from RecipeFilterComponent:', newFilters.filter.value);
    // console.log('選擇的食材:', selectedIngredients.value); // 確認選擇的食材
    // 更新 filterStore 中的 filters
    recipeFilterStore.filters = newFilters.filters;
    recipeFilterStore.selectedIngredients = newFilters.selectedIngredients;
}

const filteredRecipes = computed(() => {
    if (!filters.value) {
        return recipes.value; // 如果 filters 沒有定義，返回所有食譜
    }
    return recipes.value.filter((recipe) => {
        // console.log("正在篩選的食譜:", recipe.recipeName);

        // 取得選擇的食材 ID 列表
        const selectedIngredientIds = selectedIngredients.value.map((ingredient) => ingredient.ingredientId);
        // console.log('選擇的食材 ID 列表:', selectedIngredientIds); // 確認選擇的食材 ID 列表是否正確
        // 分類篩選
        const categoryMatch = !filters.value.category || recipe.category === filters.value.category;

        // 細部類別篩選
        const subcategoryMatch = !filters.value.subcategory || recipe.detailedCategory === filters.value.subcategory;

        let searchMatch = true;

        // 如果沒有選擇搜尋類型，預設不篩選
        if (filters.value.searchType === 'recipeName') {
            searchMatch = recipe.recipeName.toLowerCase().includes(filters.value.searchWord.toLowerCase());
        } else if (filters.value.searchType === 'ingredient') {
            searchMatch =
                selectedIngredientIds.length === 0 ||
                recipe.selectedIngredients.some((ingredient) => {
                    return selectedIngredientIds.includes(ingredient);
                });
        }
        // console.log(`該食譜 (${recipe.recipeName}) 是否匹配:`, searchMatch);
        // return searchMatch;
        // 葷素篩選
        const restrictionMatch = filters.value.restriction === '' || recipe.restriction === filters.value.restriction;

        // 中西式篩選
        const styleMatch = filters.value.style === '' || recipe.westEast === filters.value.style;

        // 必須符合所有條件
        return categoryMatch && subcategoryMatch && searchMatch && restrictionMatch && styleMatch;
    });
});

watch(
    filters,
    () => {
        currentPage.value = 1; // 重置為第一頁
        // console.log(filters.value)
    },
    { deep: true }
);

//#endregion 搜尋功能end

//#region 自訂食譜
const showCustomRecipes = ref(false);
const toggleRecipesView = () => {
    showCustomRecipes.value = !showCustomRecipes.value;
};
// 自訂食譜的篩選邏輯
const customRecipes = computed(() => {
    if (!recipeStore.recipes) {
        return [];
    }
    return recipeStore.recipes.filter((recipe) => recipe.isCustom && recipe.userId === UserId);
});

const filteredRecipesList = computed(() => {
    return showCustomRecipes.value ? customRecipes.value : filteredRecipes.value;
});
//#region 分頁功能 start

// all-data
const totalRecipes = computed(() => filteredRecipesList.value.length);
const totalPages = computed(() => Math.ceil(totalRecipes.value / pageSize.value));

const paginatedRecipes = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredRecipesList.value.slice(start, end);
});
const handlePageSizeChange = (newSize) => {
    pageSize.value = newSize;
    currentPage.value = 1; // 當每頁顯示的數量改變時，重置到第一頁
};

const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
};

watch(totalPages, (newTotalPages) => {
    if (currentPage.value > newTotalPages) {
        currentPage.value = newTotalPages;
    }
});
//#endregion 分頁功能 end
const editCustomRecipe = (recipeId) => {
    const selectedRecipe = recipeStore.recipes.find((recipe) => recipe.recipeId === recipeId);
    if (selectedRecipe) {
        recipeStore.setEditingRecipe(selectedRecipe); // 設置選中的食譜到 editingRecipe
        recipeStore.setEditMode(true); // 設置編輯模式
        router.push({ path: `/customrecipe/${recipeId}` });
    }
};
//#endregion 自訂食譜

//刪除功能
// SweetAlert 提醒刪除自訂食譜
const alertDeleteCheck = (recipeId) => {
    Swal.fire({
        title: '確定刪除此食譜？',
        text: '此操作將把該食譜刪除',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '確定刪除',
        cancelButtonText: '取消',
    }).then((result) => {
        if (result.isConfirmed) {
            deleteRecipe(recipeId);
        }
    });
};

// 刪除食譜（標記為無效）
const deleteRecipe = async (recipeId) => {
    try {
        await recipeStore.deleteRecipe(recipeId, false); // 調用 API 將狀態設為 false
        Swal.fire('已刪除!', '您的食譜已被刪除。', 'success');
        await recipeStore.fetchRecipes(); // 刷新食譜列表
    } catch (error) {
        Swal.fire('刪除失敗', '無法刪除食譜，請稍後重試。', 'error');
    }
};
</script>

<template>
    <!-- 食譜header start -->
    <section>
        <div class="header">
            <div class="title">
                <h1>食譜總覽</h1>
                <h1>Recipe</h1>
            </div>
        </div>
    </section>
    <!-- 食譜header end -->
    <!-- 推薦食譜 start -->
    <section class="pt-5">
        <div class="container-fluid">
            <div
                class="pt-5 rounded-4"
                :style="{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${BannerRecipe})`,
                    backgroundSize: 'fill',
                    backgroundPosition: 'center',
                }"
            >
                <div class="row p-3">
                    <div class="d-flex flex-column align-items-center">
                        <h2 class="mt-3 text-dark text-gradient">左思右想還是不知道煮什麼嗎?</h2>
                        <div class="d-flex gap-2 flex-wrap mb-5">
                            <button class="btn btn-lg bg-gradient-success text-white fs-6" @click="recommendRecipe">
                                推薦我食譜!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid mt-5">
            <div class="row">
                <div class="col-12 text-center">
                    <h3 style="color: lightslategray; display: block">- 或是 -</h3>
                    <h4 class="mt-3" style="color: lightslategray; display: block">利用檢索功能查找您想要的食譜</h4>
                </div>
            </div>
        </div>
    </section>
    <!-- 推薦食譜 end -->
    <!-- 搜尋食譜 start -->
    <section class="pt-3 p-2">
        <div class="container-fluid">
            <div class="col-12">
                <RecipeFilterComponent v-if="filters" @filterChange="handleFilterChange" :showSearchField="true">
                </RecipeFilterComponent>
            </div>
        </div>
    </section>
    <!-- 搜尋食譜 end -->

    <!-- 顯示食譜 start -->
    <section class="recipe-list">
        <div class="container-fluid mt-3">
            <div class="row">
                <div class="col-md-12">
                    <div class="bootstrap-tabs product-tabs p-3">
                        <div class="tabs-header d-flex justify-content-between align-items-center">
                            <h3>{{ showCustomRecipes ? '自訂食譜列表' : '食譜列表' }}</h3>
                            <el-switch
                                v-model="showCustomRecipes"
                                style="--el-switch-on-color: #41b883"
                                active-text="查看自訂食譜"
                                inactive-text="查看所有食譜"
                            />
                        </div>
                        <div>
                            <!-- 分頁導航 -->

                            <el-pagination
                                v-model:current-page="currentPage"
                                v-model:page-size="pageSize"
                                :total="totalRecipes"
                                background
                                layout="sizes, total, ->,prev, pager, next, jumper "
                                :page-sizes="[8, 12, 16, 20]"
                                @size-change="handlePageSizeChange"
                                @current-change="handleCurrentChange"
                                class="mt-4 d-flex justify-content-end align-items-center gap-2"
                            >
                            </el-pagination>

                            <!-- 分頁導航結束 -->
                        </div>
                        <div class="mt-1 row row-cols-1 row-cols-md-2 g-3">
                            <RecipeSkeleton v-if="isLoading"></RecipeSkeleton>
                            <div v-else v-for="recipe in paginatedRecipes" :key="recipe.recipeId">
                                <div
                                    class="card recipe-card shadow-sm rounded-3 d-flex flex-row align-items-center"
                                    @click="recipeStore.selectRecipe(recipe)"
                                >
                                    <span class="position-absolute top-0 end-0 z-index-3">
                                        <button
                                            v-if="showCustomRecipes"
                                            class="edit-button btn btn-outline-secondary card-control"
                                            @click.stop="editCustomRecipe(recipe.recipeId)"
                                        >
                                            <i class="fa-solid fa-pencil"></i>
                                        </button>
                                        <button
                                            v-if="showCustomRecipes"
                                            class="edit-button btn btn-outline-secondary card-control"
                                            @click.stop="alertDeleteCheck(recipe.recipeId)"
                                        >
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </span>
                                    <!-- 編輯按鈕 -->

                                    <div class="image-container">
                                        <img
                                            :src="getRecipeImageUrl(recipe.photoName) || 'default_image.jpg'"
                                            :alt="recipe.recipeName"
                                            class="recipe-image"
                                        />
                                    </div>
                                    <div
                                        class="recipe-content p-3 w-100 d-flex flex-column justify-content-center align-items-center"
                                    >
                                        <h5 class="mb-3">{{ recipe.recipeName }}</h5>
                                        <div class="d-flex gap-2">
                                            <span class="badge bg-secondary" v-if="recipe.restriction">素食</span>
                                            <span class="badge bg-secondary" v-else>葷食</span>
                                            <span class="badge bg-secondary" v-if="recipe.westEast">中式</span>
                                            <span class="badge bg-secondary" v-else>西式</span>
                                            <span class="badge bg-secondary">{{ recipe.category }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- 顯示食譜end -->
    <!-- Recipe Detail Component -->
    <!-- <RecipeDetailComponent v-if="recipeStore.selectedRecipe" :recipe="recipeStore.selectedRecipe">
    </RecipeDetailComponent> -->
    <el-dialog
        v-model="recipeStore.dialogVisible"
        title="食譜詳細資訊"
        width="75%"
        @close="recipeStore.closeDialog"
        center
        class="bg-primary-subtle"
        @opened="onDialogOpened"
    >
        <PerfectScrollbar ref="scrollContainer" class="custom-scroll-container">
            <div class="dialog-content">
                <RecipeDetailComponent
                    :recipe="recipeStore.selectedRecipe"
                    :reset-active-step="resetActiveStep"
                    v-if="recipeStore.selectedRecipe"
                />
            </div>
        </PerfectScrollbar>
        <span slot="footer" class="dialog-footer d-flex justify-content-center mt-3">
            <el-button v-if="isRandomRecommend" @click="reRecommendRecipe" type="primary">重新推薦</el-button>
            <el-button @click="recipeStore.closeDialog" type="danger">關閉</el-button>
        </span>
    </el-dialog>
</template>

<style lang="css" scoped>
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
.custom-scroll-container {
    max-height: 410px;
    overflow: hidden;
}

.dialog-content {
    max-height: 100%;
    padding-right: 15px;
    /* Adjust as needed to avoid content overflow */
}

.recipe-card {
    height: 140px;
    width: 100%;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

.recipe-card:hover {
    transform: scale(1.02) !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
}

.image-container {
    width: 200px;
    height: 100%;
}

.recipe-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-top-left-radius: 0.75rem;
    border-bottom-left-radius: 0.75rem;
}

:deep(.el-pagination.is-background .el-pager li.is-active) {
    background-color: #41b883 !important;
}

/* 修改開啟狀態的標籤顏色 */
:deep(.el-switch__label--left.is-active) {
    color: #41b883 !important;
}

/* 修改開啟狀態的標籤顏色 */
:deep(.el-switch__label--right.is-active) {
    color: #41b883 !important;
}
.card-control {
    color: red;
    cursor: pointer;
    background: transparent;
    border: none;
    padding: 10px 20px 10px 20px;
}

.card-control:hover {
    transform: scale(1.1);
}
</style>
