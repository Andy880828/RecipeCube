<script setup>
import Swal from 'sweetalert2';
import RecipeFilterComponent from '@/components/RecipeFilterComponent.vue';
import RecipeDetailComponent from '@/components/RecipeDetailComponent.vue';
import { useAuthStore } from '@/stores/auth';
import { useCookingStore } from '@/stores/cookingStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useRecipeFilterStore } from '@/stores/recipeFilterStore';
import { useRecipeStore } from '@/stores/recipeStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch, nextTick, computed, inject } from 'vue';
import { useRouter } from 'vue-router';

// 設定列表是否展開
const isListExpanded = ref(true);

const authStore = useAuthStore();
const { token } = storeToRefs(authStore);
const cookingStore = useCookingStore();
const inventoryStore = useInventoryStore();
const recipeFilterStore = useRecipeFilterStore();
const recipeStore = useRecipeStore();

//檢查登入與否
const isLoggedIn = computed(() => {
    return token.value && authStore.checkTokenExpiry;
});

// 使用 filterStore 的篩選條件
const { filters, selectedIngredients } = storeToRefs(recipeFilterStore);
const { inventories } = storeToRefs(inventoryStore); // 使用庫存資料並引入 fetch 方法
const { cookingInventories, isShowingString, isUsingInventory } = storeToRefs(cookingStore); //裡面的cookingInventories拿來產生食譜
const { setCookingInventories } = cookingStore;
const recipes = ref([]); // 用來儲存 API 返回的食譜
// 設定 API 的 URL
const BaseURL = import.meta.env.VITE_API_BASEURL;
const BaseUrlWithoutApi = BaseURL.replace('/api', ''); // 去掉 "/api" 得到基本的 URL;
const apiUrl = `${BaseURL}/RecommendRecipe/Recommend`;
const scrollContainer = ref(null);
const appScrollContainer = inject('appScrollContainer');
const router = useRouter();
const userId = ref('');
// 當打開對話框時，重置子組件中的 activeStep
const onDialogOpened = () => {
    if (scrollContainer.value) {
        const psInstance = scrollContainer.value.$el; // Get the underlying DOM element of PerfectScrollbar
        psInstance.scrollTop = 0; // Reset the scroll position to top
    }
};
const getRecipeImageUrl = (fileName) => {
    return `${BaseUrlWithoutApi}/images/recipe/${fileName}`;
};
// 呼叫推薦食譜API
const fetchRecipes = async () => {
    try {
        let userId = localStorage.getItem('UserId');
        if (!userId) {
            //如果沒有userId就給他0，這是內建食譜的預設Id
            userId = '0';
        }
        // const ingredientIds = cookingInventories.value.map((inventory) => inventory.ingredientId);
        // 確保庫存和加入的食材都包含在 ingredientIds 中
        const ingredientIds = [
            ...new Set([
                ...cookingInventories.value.map((inventory) => inventory.ingredientId),
                ...(isUsingInventory.value ? inventories.value.map((inv) => inv.ingredientId) : []),
            ]),
        ];
        // console.log('Ingredient IDs for API:', ingredientIds);
        // 構造請求 body
        const requestBody = {
            UserId: userId,
            SelectedIngredients: ingredientIds,
        };
        console.log(requestBody);
        // 呼叫 API，傳入選擇的食材
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        // 檢查回應狀態
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API 回應錯誤:', errorData);
            Swal.fire({
                title: '錯誤',
                text: errorData.message || '發生未知錯誤',
                icon: 'error',
                confirmButtonText: '確定',
            });
            return;
        }

        // 解析返回的結果
        const data = await response.json();
        // 更新食譜，添加偏好和禁忌的標記
        recipes.value = data.map((recipe) => {
            // 判斷該食譜是否包含偏好食材
            const hasPreferred = recipe.ingredientIds.some((id) => preferredIngredients.value.includes(id));
            // 判斷該食譜是否包含禁忌食材
            const hasExclusive = recipe.ingredientIds.some((id) => exclusiveIngredients.value.includes(id));

            // 返回一個包含新屬性的食譜物件
            return {
                ...recipe,
                hasPreferred,
                hasExclusive,
            };
        });
        // console.log('推薦食譜:', recipes.value);
    } catch (error) {
        console.error('錯誤:', error);
    }
};
const preferredIngredients = ref([]);
const exclusiveIngredients = ref([]);

const fetchUserPreferences = async () => {
    try {
        // 從 localStorage 中獲取偏好食材
        const preferredIngredientsString = localStorage.getItem('PreferIngredients');
        if (preferredIngredientsString) {
            const preferredIngredientsArray = preferredIngredientsString.split('\n');
            const preferredIngredientIds = preferredIngredientsArray.map((item) => parseInt(item.split(',')[0]));
            preferredIngredients.value = preferredIngredientIds;
            console.log('偏好食材 ID 列表:', preferredIngredientIds);
        } else {
            console.warn('偏好食材沒有儲存在 localStorage 中');
        }

        // 從 localStorage 獲取 ExclusiveIngredients 資料
        const exclusiveIngredientsString = localStorage.getItem('ExclusiveIngredients');
        if (exclusiveIngredientsString) {
            // 將資料拆分為陣列，以換行符作為分隔符
            const exclusiveIngredientsArray = exclusiveIngredientsString.split('\n');

            // 使用 map() 來提取所有的 id (每行的第一個值)
            const exclusiveIngredientIds = exclusiveIngredientsArray.map((item) => {
                // 以逗號分隔，取出第一部分（即 id 值），並轉換為數字
                return parseInt(item.split(',')[0]);
            });
            exclusiveIngredients.value = exclusiveIngredientIds;

            console.log('禁忌食材 ID 列表:', exclusiveIngredientIds);
        } else {
            console.log('未找到 ExclusiveIngredients 資料於 localStorage 中');
        }
    } catch (error) {
        console.error('錯誤:', error);
    }
};
// 在DOM載入後抓食材
onMounted(async () => {
    console.log('Store values:', {
        cookingInventories: cookingInventories.value,
        isShowingString: isShowingString.value,
        isUsingInventory: isUsingInventory.value,
    });
    console.log('食材:', { cookingInventories: cookingInventories.value });
    // 1. 先加載庫存(已登入才會加載)
    if (isLoggedIn.value) {
        await inventoryStore.fetchInventories();
    }
    // 2. 從 localStorage 中取出保存的食材 ID
    setCookingInventories();

    // 3. 合併庫存食材到選擇的食材

    // 3. fetch推薦食譜 API
    await fetchUserPreferences();
    await fetchRecipes();
    // console.log('偏好食材:', preferredIngredients.value);
    // console.log('不可食材:', exclusiveIngredients.value);
    setupIntersectionObserver();
    // 4. 設定列表是否展開
    if (isUsingInventory.value) isListExpanded.value = false;
});

watch(cookingInventories, (newInventories) => {
    const ingredientIds = newInventories.map((inventory) => inventory.ingredientId);
    localStorage.setItem('selectedIngredients', JSON.stringify(ingredientIds));
});

// 監聽篩選條件的變化
function handleFilterChange(newFilters) {
    console.log('Received new filters:', newFilters);
    filters.value = newFilters.filters;
    selectedIngredients.value = newFilters.selectedIngredients;
    // 在篩選條件變更時，重新調用 fetchRecipes
    fetchRecipes();
}
//#region 淡入動畫
watch(recipes, (newRecipes) => {
    if (newRecipes.length > 0) {
        setupIntersectionObserver();
    }
});

const setupIntersectionObserver = () => {
    nextTick(() => {
        const cards = document.querySelectorAll('.card');

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        };

        const observerCallback = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // console.log('卡片進入視窗:', entry.target);
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        cards.forEach((card) => {
            observer.observe(card);
        });
    });
};
//#endregion 淡入動畫

//#region 分類 完全符合/不符合食譜
const filteredRecipes = computed(() => {
    return recipes.value.filter((recipe) => {
        // 根據篩選條件來過濾食譜
        const categoryMatch = !filters.value.category || recipe.category === filters.value.category;
        const subcategoryMatch = !filters.value.subcategory || recipe.detailedCategory === filters.value.subcategory;
        const restrictionMatch = filters.value.restriction === '' || recipe.restriction === filters.value.restriction;
        const styleMatch = filters.value.style === '' || recipe.westEast === filters.value.style;

        // 必須符合所有條件
        return categoryMatch && subcategoryMatch && restrictionMatch && styleMatch;
    });
});
// 1. 定義分類的計算屬性
const completeMatchRecipes = computed(() => {
    const completeRecipes = filteredRecipes.value.filter((recipe) => {
        return recipe.ingredientIds.every((id) => cookingInventories.value.some((inv) => inv.ingredientId === id));
    });
    // console.log('完全匹配的食譜:', completeRecipes);
    return completeRecipes;
});

const partialMatchRecipes = computed(() => {
    const partialRecipes = filteredRecipes.value
        .filter((recipe) => {
            // 判斷該食譜是否缺少某些食材
            return recipe.ingredientIds.some((id) => !cookingInventories.value.some((inv) => inv.ingredientId === id));
        })
        .map((recipe) => {
            // 確認缺少的食材
            const missingIngredients = recipe.ingredientIds
                .filter((id) => !cookingInventories.value.some((inv) => inv.ingredientId === id))
                .map((id) => {
                    // 獲取食材名稱
                    const ingredientName = recipe.ingredientNames[recipe.ingredientIds.indexOf(id)];
                    // 如果是訪客，只顯示食材名稱
                    if (!isLoggedIn) {
                        return {
                            ingredientId: id,
                            ingredientName,
                        };
                    }
                    // 解構 missingIngredients
                    const missingIngredientsList = JSON.parse(JSON.stringify(recipe.missingIngredients));

                    // 使用 IngredientId 查找缺少的食材詳細資訊
                    const missingIngredientDetail = missingIngredientsList.find(
                        (missing) => missing.ingredientId === id
                    );

                    // 檢查是否找到對應的食材詳細資訊
                    let missingQuantity = missingIngredientDetail?.missingQuantity;
                    let ingredientUnit = missingIngredientDetail?.unit;

                    // 如果找不到缺少的食材，且該食材在庫存中但未被選擇(已登入才會加入庫存篩選機制)
                    if (
                        isLoggedIn &&
                        missingQuantity === undefined &&
                        inventories.value.some((inv) => inv.ingredientId === id)
                    ) {
                        missingQuantity = '未選擇食材';
                        ingredientUnit = '';
                    } else {
                        // 保留食材的單位和缺少的數量
                        missingQuantity = missingQuantity || 0;
                        ingredientUnit = ingredientUnit || '未知單位';
                    }

                    // 回傳包含完整資訊的缺少食材物件
                    return {
                        ingredientId: id,
                        ingredientName,
                        missingQuantity,
                        unit: ingredientUnit,
                    };
                });

            // 將調試資訊顯示在控制台
            // console.log(`食譜 ${recipe.recipeName} 缺少的食材詳情:`, missingIngredients);

            return {
                ...recipe,
                missingIngredients,
            };
        });

    // 顯示最終部分匹配的食譜資訊
    // console.log('部分匹配的食譜:', partialRecipes);
    return partialRecipes;
});

//#endregion 分類 完全符合/不符合食譜

function useSelectedRecipe() {
    const recipeId = recipeStore.selectedRecipe.recipeId;
    if (!recipeId) {
        console.error('無法獲取食譜 ID');
        return;
    }
    // 這裡寫你需要執行的邏輯
    console.log('使用選定的食譜', recipeId);
    // 在使用食譜時，關閉 el-dialog
    recipeStore.dialogVisible = false;
    // 比如導航到新的頁面或者呼叫 API
    // 使用 Vue Router 導航到新的頁面
    localStorage.setItem('isFromGenerateRecipe', 'true');
    router.push(`/generaterecipe/recipeDetail/${recipeStore.selectedRecipe.recipeId}`);
}

//收起列表的時候把滾動軸條回頂端
const ListClose = async () => {
    console.log('listclose');
    isListExpanded.value = false;
    await nextTick(); // 確保在 DOM 更新後操作滾動
    console.log(appScrollContainer.value);

    const container = appScrollContainer?.value?.$el || appScrollContainer?.value;
    if (container && container.scrollTop !== undefined) {
        container.scrollTop = 10;
        console.log('滾動到頂端成功');
    } else {
        console.error('無法找到滾動容器');
    }
};
</script>

<template>
    <section>
        <div class="header">
            <div class="title">
                <h1>食譜產生</h1>
                <h1>Recipe Generating</h1>
            </div>
        </div>
    </section>

    <section class="pt-5">
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="text-center">
                    <h4>
                        您輸入了
                        <span class="text-success text-gradient">{{ cookingInventories.length }}</span>
                        樣食材<span v-if="isShowingString && isLoggedIn"
                            >，並決定
                            <span v-if="isUsingInventory" class="text-success text-gradient">納入</span>
                            <span v-else class="text-success text-gradient">不納入</span>
                            庫存食材一起檢索</span
                        >
                    </h4>
                </div>
            </div>
        </div>
        <div class="container-fluid pt-3 pb-5">
            <div class="row justify-content-center">
                <div class="table-responsive p-1 w-60">
                    <table class="table table-borderless text-center align-middle rounded-4">
                        <thead>
                            <tr>
                                <th scope="col" class="text-dark">No</th>
                                <th scope="col" class="text-dark">食材分類</th>
                                <th scope="col" class="text-dark">食材名稱</th>
                                <th scope="col" class="text-dark">數量</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-if="isListExpanded"
                                v-for="(inventory, index) in cookingInventories"
                                :key="cookingInventories.inventoryId"
                            >
                                <td scope="row" class="text-dark">{{ index + 1 }}</td>
                                <td class="text-dark">{{ inventory.category }}</td>
                                <td class="text-dark">{{ inventory.ingredientName }}</td>
                                <td class="text-dark">
                                    {{ inventory.quantity }}
                                    {{ inventory.unit }}
                                </td>
                            </tr>
                            <tr v-else v-for="(inventory, index) in cookingInventories.slice(0, 10)" :key="index">
                                <td scope="row" class="text-dark">{{ index + 1 }}</td>
                                <td class="text-dark">{{ inventory.category }}</td>
                                <td class="text-dark">{{ inventory.ingredientName }}</td>
                                <td class="text-dark">
                                    {{ inventory.quantity }}
                                    {{ inventory.unit }}
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="4" class="text-dark">
                                    <h6
                                        v-if="!isListExpanded && cookingInventories.length > 10"
                                        class="collapse-button"
                                        @click="isListExpanded = true"
                                    >
                                        與其他 {{ cookingInventories.length - 10 }} 個食材...
                                    </h6>
                                    <h6
                                        v-if="isListExpanded && isUsingInventory"
                                        class="collapse-button"
                                        @click="ListClose"
                                    >
                                        收起列表
                                    </h6>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="text-center">
                    <h4>以下為符合您需求的食譜</h4>
                    <p class="text-muted">點擊可查看食譜</p>
                </div>
            </div>
        </div>
    </section>
    <!-- 搜尋 -->
    <section class="mt-1 px-2">
        <div class="container-fluid">
            <div class="col-12">
                <RecipeFilterComponent @filterChange="handleFilterChange" :showSearchField="false">
                </RecipeFilterComponent>
            </div>
        </div>
    </section>
    <!-- 產生的食譜 -->
    <section>
        <div class="container-fluid mt-3">
            <!-- 完全匹配的食譜 -->
            <h3>符合所有食材的食譜</h3>
            <div class="row row-cols-1 row-cols-md-2 g-3">
                <div v-for="(recipe, index) in completeMatchRecipes" :key="index">
                    <div
                        class="card recipe-card shadow-sm rounded-3 d-flex flex-row align-items-center p-0"
                        @click="recipeStore.selectRecipe(recipe)"
                    >
                        <div class="image-container">
                            <img
                                :src="getRecipeImageUrl(recipe.photoName)"
                                :alt="recipe.recipeName"
                                class="recipe-image"
                            />
                        </div>
                        <div class="p-3 w-100 d-flex flex-column justify-content-start align-items-center">
                            <h5 class="mt-3 text-center">
                                {{ recipe.recipeName }}
                                <el-tag
                                    v-if="recipe.hasExclusive"
                                    size="large"
                                    type="danger"
                                    class="position-absolute top-3 end-1"
                                >
                                    包含禁忌食材
                                </el-tag>
                                <el-tag
                                    v-else-if="recipe.hasPreferred"
                                    type="success"
                                    size="large"
                                    class="position-absolute top-3 end-1"
                                >
                                    包含偏好食材
                                </el-tag>
                            </h5>
                            <div class="d-flex flex-wrap gap-2 mb-1 mx-auto">
                                <div class="d-flex gap-2">
                                    <span class="text-secondary">#{{ recipe.restriction ? '素' : '葷' }}</span>
                                    <span class="text-secondary">#{{ recipe.westEast ? '中式' : '西式' }}</span>
                                </div>
                                <div class="d-flex gap-2">
                                    <span class="text-secondary">#{{ recipe.category }}</span>
                                    <span class="text-secondary">#{{ recipe.detailedCategory }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 部分匹配的食譜 -->
            <h3 class="mt-5">缺少某些食材的食譜</h3>
            <div class="row row-cols-1 row-cols-md-2 g-3">
                <div v-for="(recipe, index) in partialMatchRecipes" :key="index">
                    <div
                        class="card recipe-card shadow-sm rounded-3 d-flex flex-row align-items-center p-0"
                        @click="recipeStore.selectRecipe(recipe)"
                    >
                        <div class="image-container">
                            <img
                                :src="getRecipeImageUrl(recipe.photoName)"
                                :alt="recipe.recipeName"
                                class="recipe-image"
                            />
                        </div>
                        <div class="p-3 w-100 d-flex flex-column justify-content-start align-items-center">
                            <h5 class="mt-3 text-center">
                                {{ recipe.recipeName }}
                                <el-tag
                                    v-if="recipe.hasExclusive"
                                    type="danger"
                                    size="large"
                                    class="position-absolute top-3 end-1"
                                >
                                    包含禁忌食材
                                </el-tag>
                                <el-tag
                                    v-else-if="recipe.hasPreferred"
                                    type="success"
                                    size="large"
                                    class="position-absolute top-3 end-1"
                                >
                                    包含偏好食材
                                </el-tag>
                            </h5>

                            <div class="d-flex flex-wrap gap-2 mb-1 mx-auto">
                                <div class="d-flex gap-2">
                                    <span class="text-secondary">#{{ recipe.restriction ? '素' : '葷' }}</span>
                                    <span class="text-secondary">#{{ recipe.westEast ? '中式' : '西式' }}</span>
                                </div>
                                <div class="d-flex gap-2">
                                    <span class="text-secondary">#{{ recipe.category }}</span>
                                    <span class="text-secondary">#{{ recipe.detailedCategory }}</span>
                                </div>
                            </div>
                            <p class="text-danger mt-2">
                                缺少的食材:
                                <span v-for="(ingredient, index) in recipe.missingIngredients" :key="index">
                                    {{ ingredient.ingredientName }}
                                    <span v-if="isLoggedIn && ingredient.missingQuantity !== undefined">
                                        ({{ ingredient.missingQuantity }} {{ ingredient.unit }})
                                    </span>
                                    <span v-if="index < recipe.missingIngredients.length - 1">, </span>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- el-dialog -->
    <el-dialog
        v-model="recipeStore.dialogVisible"
        title="食譜詳細資訊"
        width="75%"
        @close="recipeStore.closeDialog"
        center
        class="bg-primary-subtle"
        destroy-on-close
        @opended="onDialogOpened"
    >
        <PerfectScrollbar ref="scrollContainer" class="custom-scroll-container">
            <div class="dialog-content">
                <RecipeDetailComponent :recipe="recipeStore.selectedRecipe" v-if="recipeStore.selectedRecipe" />
            </div>
        </PerfectScrollbar>
        <span slot="footer" class="dialog-footer d-flex justify-content-center mt-3">
            <el-button @click="useSelectedRecipe" type="primary">使用該食譜</el-button>
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

@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.collapse-button {
    text-decoration: underline;
}
.collapse-button:hover {
    opacity: 0.8;
    cursor: pointer;
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

.fade-in {
    animation: fadeIn 1s ease-in-out forwards;
}

.custom-scroll-container {
    max-height: 350px;
    overflow: hidden;
}

.dialog-content {
    max-height: 100%;
    padding-right: 15px;
    /* Adjust as needed to avoid content overflow */
}

.recipe-tag {
    font-size: 0.8rem; /* 調整標籤的字體大小 */
    line-height: 1.2; /* 控制標籤的行高，減少標籤占用的垂直空間 */
    padding: 2px 6px; /* 調整標籤內部的間距 */
}

:deep(.card .el-tag) {
    font-size: 0.8rem;
    line-height: 1.2;
    padding: 2px 6px;
    border: none;
    background-color: transparent;
}
</style>
