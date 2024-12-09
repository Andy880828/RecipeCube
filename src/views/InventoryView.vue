<script setup>
import Swal from 'sweetalert2';
import SoftBadge from '@/components/SoftBadge.vue';
import { storeToRefs } from 'pinia';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useCookingStore } from '@/stores/cookingStore';
import { usePantryStore } from '@/stores/pantryStore';
import InventorySkeleton from '@/components/InventorySkeleton.vue';
import { onMounted, ref, computed } from 'vue';

const BaseURL = import.meta.env.VITE_API_BASEURL;
const BaseUrlWithoutApi = BaseURL.replace('/api', ''); // 去掉 "/api" 得到基本的 URL(抓圖片要用的);
const currentUserId = localStorage.getItem('UserId');

const inventoryStore = useInventoryStore();
const { inventories, ingredientCategory } = storeToRefs(inventoryStore); //解構inventories並轉換成響應式物件
const { fetchInventories, deleteInventory, putInventory } = inventoryStore;
const selectedInventories = ref([]); //用戶選到的庫存會被加到這
const cookingStore = useCookingStore();
const { cookingInventories, isShowingString } = storeToRefs(cookingStore);
const { setCookingInventories } = cookingStore;
const pantryStore = usePantryStore(); //用來操作紀錄功能
const { pantries } = storeToRefs(pantryStore);
const { postPantry, fetchPantries } = pantryStore;

const isLoading = ref(true); //判斷是否還在載入的flag
const allSelect = ref(false); //判斷全選與否的flag
const isInventoryModalVisible = ref(false);
const isPantryModalVisible = ref(false);
const isDrawerVisible = ref(false);

//當DOM加載完執行fetch
onMounted(() => {
    setCookingInventories();
    SetUpInventories();
});

//載入庫存
const SetUpInventories = async () => {
    isLoading.value = true;
    await fetchInventories();
    isLoading.value = false;
};

//設定庫存圖片路徑
const getIngredientImageUrl = (fileName) => {
    return `${BaseUrlWithoutApi}/images/ingredient/${fileName}`;
};

////提醒開始
// 定義公用提醒格式
const check = (text, buttonText, func, secondTitle) => {
    Swal.fire({
        title: '您確定嗎?',
        text: text,
        icon: 'warning',
        showCancelButton: true,
        heightAuto: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: buttonText,
        cancelButtonText: '取消',
    }).then((result) => {
        if (result.isConfirmed) {
            func();
            Swal.fire({
                heightAuto: false,
                title: secondTitle,
                icon: 'success',
            });
        }
    });
};

// 清空列表按鈕的提醒
const alertClearCheck = () => {
    check('即將清空所選食材列表', '清空', () => deselectAllCard(), '清空了!');
};

// 個別刪除的提醒
const alertDeleteCheck = (inventory) => {
    check('即將刪除所選食材', '刪除', () => deleteCard(inventory), '已刪除!');
};

// 群體刪除的提醒
const alertDeleteAllCheck = () => {
    if (!selectedInventories.value.length) {
        return;
    }
    check('即將刪除所選的所有食材', '刪除', () => deleteCards(), '已刪除!');
};
////提醒結束

////篩選功能
//先給定響應式物件存條件資料
const filters = ref({
    category: '',
    visibility: '',
    expiry: '',
    searchWord: '',
});
//利用computed的監測特性來實時更改篩選庫存
const filteredInventories = computed(() => {
    return inventories.value.filter((inventory) => {
        //利用filter逐項遍歷每個inventory項目作篩選，利用4個Boolean來決定項目要不要顯示
        //分類篩選(用戶沒篩選或篩選符合會回傳true)
        const categoryMatch = !filters.value.category || inventory.category === filters.value.category;
        //權限篩選
        const visibilityMatch =
            !filters.value.visibility || //沒篩選
            (filters.value.visibility === 'group' && !inventory.visibility) || //當用戶選群組而我們的項目剛好是群組項目時true
            (filters.value.visibility === 'private' && inventory.visibility); //同理
        //期限篩選
        const expiryMatch =
            !filters.value.expiry ||
            (filters.value.expiry === 'expiring' && inventory.isExpiring) ||
            (filters.value.expiry === 'expired' && inventory.isExpired) ||
            (filters.value.expiry === 'normal' && !inventory.isExpiring && !inventory.isExpired);
        //搜尋篩選
        const searchMatch =
            !filters.value.searchWord ||
            inventory.ingredientName.toLowerCase().includes(filters.value.searchWord.toLowerCase()) || //因為有英文，要lower一下
            //也要篩一下同義字陣列，因為多一層要再用一個some(檢查是否有item符合條件，就是filter的"只檢查"版本)包起來
            inventory.synonymArray.some((synonym) =>
                synonym.toLowerCase().includes(filters.value.searchWord.toLowerCase())
            );

        //因為filter只會傳回結果是true的項目回陣列，所以可以這樣回傳Boolean來控制
        return categoryMatch && visibilityMatch && expiryMatch && searchMatch;
    });
});
////篩選功能結束

//卡片點擊
const activateCard = (event, inventory) => {
    const selectedCard = event.currentTarget.closest('.card');
    if (!selectedCard.classList.contains('active')) {
        selectedCard.classList.add('active');
        selectedInventories.value.push(inventory);
    } else {
        selectedCard.classList.remove('active');
        const deletingIndex = selectedInventories.value.indexOf(inventory);
        if (deletingIndex > -1) {
            selectedInventories.value.splice(deletingIndex, 1);
        }
    }
};

//全選按鈕
const selectAllCard = () => {
    filteredInventories.value.forEach((inventory) => {
        const card = document.querySelector(`.card[data-inventoryId="${inventory.inventoryId}"]`);
        if (card && !card.classList.contains('active')) {
            card.classList.add('active');
            if (!selectedInventories.value.includes(inventory)) {
                selectedInventories.value.push(inventory);
            }
        }
    });
    allSelect.value = true;
};

//取消全選按鈕
const deselectAllCard = () => {
    selectedInventories.value.forEach((inventory) => {
        const card = document.querySelector(`.card[data-inventoryId="${inventory.inventoryId}"]`);
        //找到有data-inventoryId="已選擇號碼"的card
        if (card) {
            //存在的話，刪掉active
            card.classList.remove('active');
        }
    });
    selectedInventories.value = []; //清掉所選
    allSelect.value = false;
};

////修改功能
//先設置響應式物件存資料
const editInventory = ref({
    inventoryId: '',
    userId: '',
    userName: '',
    ingredientName: '',
    quantity: 0,
    unit: '',
    expiryDate: new Date(),
    visibility: true,
});
//用一個變數存原本數量
let previousQuantity = 0;
//將傳入的inventory值存進響應式物件
const editCard = (inventory) => {
    editInventory.value = { ...inventory };
    previousQuantity = editInventory.value.quantity;
    isInventoryModalVisible.value = true;
};
//按鈕行為
const saveEditedInventory = async () => {
    isLoading.value = true;
    // 如果新數量為 0，則刪除
    if (editInventory.value.quantity === 0) {
        await deleteInventory(editInventory.value.inventoryId);
    } else {
        // 修改
        await putInventory(editInventory.value);
    }
    // 紀錄
    const change = editInventory.value.quantity - previousQuantity;
    if (change !== 0) {
        const { userId, ingredientId } = editInventory.value;
        const action = change > 0 ? '增加' : '減少'; //判斷action
        await postPantry({
            userId: currentUserId,
            ownerId: userId,
            ingredientId: ingredientId,
            quantity: Math.abs(change),
            action: action,
        });
    }
    isInventoryModalVisible.value = false;
    isLoading.value = false;
};
////修改功能結束

////刪除功能
//個別刪除功能
const deleteCard = async (inventory) => {
    isLoading.value = true;
    await deleteInventory(inventory.inventoryId);
    const { userId, ingredientId, quantity } = inventory;
    const action = '減少';
    await postPantry({
        userId: currentUserId,
        ownerId: userId,
        ingredientId: ingredientId,
        quantity: quantity,
        action: action,
    });
    isLoading.value = false;
};
//群體刪除功能
const deleteCards = () => {
    for (let inventory of selectedInventories.value) {
        deleteCard(inventory);
    }
    selectedInventories.value = [];
};
////刪除功能結束

////歷史紀錄功能
//表頭
const headers = [
    { text: '擁有者名稱', value: 'ownerName', sortable: true },
    { text: '編輯者名稱', value: 'userName', sortable: true },
    { text: '食材名稱', value: 'ingredientName', sortable: true },
    { text: '數量', value: 'quantity' },
    { text: '動作', value: 'action' },
    { text: '編輯時間', value: 'time' },
];
//內容，利用computed動態監測pantries改變並同步匯入tableData
const tableData = computed(() => {
    return pantries.value
        .map((pantry) => ({
            ownerName: pantry.ownerName,
            userName: pantry.userName,
            ingredientName: pantry.ingredientName,
            quantity: pantry.quantity,
            action: pantry.action,
            time: new Date(new Date(pantry.time).getTime() + 8 * 60 * 60 * 1000).toLocaleString(),
            //new Date(pantry.time)是資料庫時間，getTime()取毫秒(故要*這麼多)，外面再用new Date接毫秒轉型為時間
            //最後使用toLocaleString轉乘本地時間格式
        }))
        .reverse(); //反轉陣列讓新內容在前面
});
//按鈕行為
const showPantryDialog = async () => {
    await fetchPantries();
    isPantryModalVisible.value = true;
};
////紀錄功能結束

//將所選食材送至產生食譜介面
const exportInventories = () => {
    if (!selectedInventories.value.length) {
        return;
    }
    isShowingString.value = false;
    cookingInventories.value = [...selectedInventories.value];
    localStorage.setItem('cookingInventories', JSON.stringify(cookingInventories.value));
    localStorage.setItem('isShowingString', JSON.stringify(isShowingString.value));
    localStorage.setItem('source', 'inventoryManagement'); // 標識來源為庫存管理
};
</script>

<template>
    <section>
        <div class="header">
            <div class="title">
                <h1>庫存管理</h1>
                <h1>Inventory</h1>
            </div>
        </div>
    </section>

    <section class="pt-5">
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="text-center">
                    <h4>在下方食材列表，您可以看到您所屬群組的庫存食材，您可以進行兩種操作</h4>
                </div>
            </div>
            <div class="row justify-content-center my-5">
                <div class="col-lg-3">
                    <div class="d-flex gap-4 justify-content-center align-items-center">
                        <div class="driver text-center px-3 m-1 rounded-3" @click="startEditTutorial">
                            <h5><i class="fa-solid fa-box-open mt-3"></i> 管理食材</h5>
                            <p>對個別食材進行數量的修改或刪除</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3">
                    <div class="d-flex gap-4 justify-content-center align-items-center">
                        <div class="driver text-center px-3 m-1 rounded-3" @click="startCookTutorial">
                            <h5><i class="fa-solid fa-utensils mt-3"></i> 產生食譜</h5>
                            <p>選取食材讓我們為您自動生成食譜</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="py-1">
        <div class="container-fluid">
            <div class="col-12">
                <div class="row g-3 pb-2 px-3 my-3 d-flex bg-primary-subtle rounded-4 shadow justify-content-between">
                    <div class="col-md-2">
                        <p class="fw-bold mb-0">分類 CATEGORY</p>
                    </div>
                    <div class="col-md-2 mt-2">
                        <select class="form-select" v-model="filters.category">
                            <option value="">類別</option>
                            <option v-for="category in ingredientCategory" :value="category">
                                {{ category }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-2 mt-2">
                        <select class="form-select" v-model="filters.visibility">
                            <option value="">群組/私有</option>
                            <option value="group">群組</option>
                            <option value="private">私有</option>
                        </select>
                    </div>
                    <div class="col-md-2 mt-2">
                        <select class="form-select" v-model="filters.expiry">
                            <option value="">期限</option>
                            <option value="expiring">即期</option>
                            <option value="expired">過期</option>
                            <option value="normal">正常</option>
                        </select>
                    </div>
                    <div class="col-md-3 mt-2">
                        <input
                            type="text"
                            class="form-control w-100 text-center"
                            placeholder="搜尋"
                            v-model="filters.searchWord"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="p-3">
                        <div class="tabs-header d-flex justify-content-between">
                            <h3>食材列表</h3>
                            <div>
                                <button class="btn blur shadow fs-6 me-1" id="historyButton" @click="showPantryDialog">
                                    歷史編輯紀錄
                                </button>
                                <button v-if="allSelect" class="btn blur shadow fs-6 me-1" @click="deselectAllCard">
                                    取消全選
                                </button>
                                <button v-else class="btn blur shadow fs-6 me-1" @click="selectAllCard">全選</button>
                                <button class="btn blur shadow fs-6 text-danger me-1" @click="alertDeleteAllCheck">
                                    刪除
                                </button>
                            </div>
                        </div>
                        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
                            <div v-if="isLoading" class="col">
                                <InventorySkeleton></InventorySkeleton>
                            </div>
                            <div
                                v-else
                                class="col"
                                v-for="inventory in filteredInventories"
                                :key="inventory.inventoryId"
                            >
                                <div
                                    class="card h-100 p-0 shadow-sm position-relative"
                                    :data-inventoryId="inventory.inventoryId"
                                >
                                    <SoftBadge
                                        v-if="inventory.isExpiring"
                                        variant="gradient"
                                        color="info"
                                        class="position-absolute top-2 start-2"
                                    >
                                        即將過期
                                    </SoftBadge>
                                    <SoftBadge
                                        v-if="inventory.isExpired"
                                        variant="gradient"
                                        color="warning"
                                        class="position-absolute top-2 start-2"
                                    >
                                        已過期
                                    </SoftBadge>
                                    <span class="position-absolute top-0 end-0 p-2 z-index-3">
                                        <button class="card-control" @click.stop="editCard(inventory)">
                                            <i class="fa-solid fa-pencil"></i>
                                        </button>
                                        <button class="card-control" @click.stop="alertDeleteCheck(inventory)">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </span>
                                    <div class="card-body d-flex flex-column" @click="activateCard($event, inventory)">
                                        <div class="image-container mb-3">
                                            <img
                                                :src="getIngredientImageUrl(inventory.photo)"
                                                :alt="inventory.ingredientName"
                                                class="product-image"
                                            />
                                            <span class="amount-badge"
                                                >{{ inventory.quantity }}{{ inventory.unit }}</span
                                            >
                                        </div>
                                        <h5 class="card-title text-center">{{ inventory.ingredientName }}</h5>
                                        <p class="card-text text-center">{{ inventory.category }}</p>
                                        <p class="card-text text-center mt-auto">{{ inventory.expiryDate }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section>
        <el-dialog v-model="isPantryModalVisible" title="歷史編輯紀錄" width="70%" center class="bg-primary-subtle">
            <EasyDataTable
                :headers="headers"
                :items="tableData"
                :rows-per-page="10"
                table-class="customize-table"
                header-text-direction="center"
                body-text-direction="center"
                class="w-100"
            >
                <template #empty-message>
                    <div class="empty-state">
                        <p>沒有歷史紀錄</p>
                    </div>
                </template>
            </EasyDataTable>
            <span slot="footer" class="dialog-footer d-flex justify-content-center mt-2">
                <el-button type="danger" @click="isPantryModalVisible = false">關閉</el-button>
            </span>
        </el-dialog>
    </section>

    <section>
        <el-dialog
            v-model="isInventoryModalVisible"
            title="修改庫存內容"
            width="40%"
            center
            class="bg-primary-subtle pb-2"
        >
            <div class="d-flex justify-content-center align-items-center bg-white rounded-4" style="height: 410px">
                <div class="p-3 w-90">
                    <div class="my-3">
                        <label for="userId" class="m-0 p-0 fs-6">庫存所有者</label>
                        <input
                            v-model="editInventory.userName"
                            name="userId"
                            type="text"
                            class="form-control w-100 text-center"
                            disabled
                        />
                    </div>
                    <div class="mb-3">
                        <label for="ingredientName" class="m-0 p-0 fs-6">食材名稱</label>
                        <input
                            v-model="editInventory.ingredientName"
                            name="ingredientName"
                            type="text"
                            placeholder="食材名稱"
                            class="form-control w-100 text-center"
                            disabled
                        />
                    </div>
                    <div class="mb-3">
                        <label for="quantity" class="m-0 p-0 fs-6">數量</label>
                        <div class="d-flex justify-content-between align-items-center gap-3">
                            <input
                                v-model="editInventory.quantity"
                                name="quantity"
                                type="text"
                                placeholder="數量"
                                class="form-control w-100 text-center"
                            />
                            <span>{{ editInventory.unit }}</span>
                        </div>
                        <span v-if="editInventory.quantity <= 0" class="m-0 p-0 text-danger">數量不可小於或等於0</span>
                    </div>
                    <div class="mb-3">
                        <label for="expiryDate" class="m-0 p-0 fs-6">到期日</label>
                        <input
                            v-model="editInventory.expiryDate"
                            name="expiryDate"
                            type="date"
                            placeholder="到期日"
                            class="form-control w-100 text-center"
                        />
                    </div>
                    <div class="mb-4">
                        <label for="visibility" class="m-0 p-0 fs-6">權限</label>
                        <select
                            v-model="editInventory.visibility"
                            :placeholder="editInventory.visibility"
                            name="visibility"
                            class="form-control w-100 text-center"
                            :disabled="currentUserId !== editInventory.userId"
                        >
                            <option :value="true">私有</option>
                            <option :value="false">群組</option>
                        </select>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer d-flex justify-content-center mt-2">
                <el-button v-if="editInventory.quantity > 0" type="primary" @click="saveEditedInventory"
                    >儲存</el-button
                >
                <el-button type="danger" @click="isInventoryModalVisible = false">關閉</el-button>
            </span>
        </el-dialog>
    </section>

    <section>
        <el-drawer v-model="isDrawerVisible" title="食材列表" :direction="rtl" :zIndex="200">
            <div class="order-md-last">
                <h4 class="d-flex justify-content-between align-items-center mb-3">
                    <span class="text-dark">您所選的食材</span>
                    <span class="badge bg-dark rounded-pill">{{ selectedInventories.length }}</span>
                </h4>
                <ul class="list-group mb-3">
                    <li
                        v-for="inventory in selectedInventories"
                        :key="inventory.inventoryId"
                        class="list-group-item d-flex justify-content-between lh-sm"
                    >
                        <div>
                            <h6 class="my-0">{{ inventory.ingredientName }}</h6>
                            <small class="text-body-secondary">{{ inventory.category }}</small>
                        </div>
                        <span class="text-body-secondary">到期日: {{ inventory.expiryDate }}</span>
                    </li>
                </ul>

                <RouterLink
                    class="w-100 btn shadow fs-5 text-black"
                    :class="selectedInventories.length ? 'bg-primary-subtle' : 'bg-secondary disabled-link'"
                    :to="selectedInventories.length ? { name: 'GenerateRecipe' } : ''"
                    @click="exportInventories"
                >
                    產生食譜
                </RouterLink>
                <button class="w-100 btn blur text-danger shadow fs-5" @click="alertClearCheck">清空所選食材</button>
            </div>
        </el-drawer>
    </section>

    <section>
        <!-- 固定在左側的導航欄 -->
        <nav class="fixed-left-nav d-none d-lg-block">
            <div class="nav-container bg-white shadow-lg rounded-end-4 p-2">
                <div class="d-flex flex-column gap-2">
                    <RouterLink
                        class="btn text-dark shadow fs-5 mb-0 vertical-btn"
                        :class="{
                            'bg-primary-subtle': selectedInventories.length,
                            'bg-secondary disabled-link': !selectedInventories.length,
                        }"
                        :to="selectedInventories.length ? { name: 'GenerateRecipe' } : ''"
                        @click="exportInventories"
                    >
                        <i class="fa-solid fa-wand-magic-sparkles mb-1"></i>
                        <span class="vertical-text">產生食譜</span>
                    </RouterLink>
                    <button
                        type="button"
                        class="btn blur shadow text-dark fs-5 mb-0 vertical-btn"
                        @click="isDrawerVisible = true"
                    >
                        <i class="fa-solid fa-list-ul mb-1"></i>
                        <span class="vertical-text">已選食材</span>
                        <span class="badge bg-dark rounded-pill mt-2">{{ selectedInventories.length }}</span>
                    </button>
                </div>
            </div>
        </nav>

        <!-- 小螢幕上顯示的底部導航欄 -->
        <nav class="fixed-bottom-nav d-block d-lg-none">
            <div class="container-fluid pt-2 pb-3 shadow-lg">
                <div class="row justify-content-center gap-2">
                    <div class="col-5">
                        <RouterLink
                            class="btn text-dark shadow fs-5 mb-0 w-100"
                            :class="{
                                'bg-primary-subtle': selectedInventories.length,
                                'bg-secondary disabled-link': !selectedInventories.length,
                            }"
                            :to="selectedInventories.length ? { name: 'GenerateRecipe' } : ''"
                            @click="exportInventories"
                        >
                            <i class="fa-solid fa-wand-magic-sparkles"></i>
                            產生食譜
                        </RouterLink>
                    </div>
                    <div class="col-5">
                        <button
                            type="button"
                            class="btn blur shadow text-dark fs-5 mb-0 w-100"
                            @click="isDrawerVisible = true"
                        >
                            <i class="fa-solid fa-list-ul"></i>
                            已選食材
                            <span class="badge bg-dark rounded-pill ms-1">{{ selectedInventories.length }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    </section>
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

.card {
    height: 100%;
    display: flex;
    flex-direction: column;
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
}

.card.active {
    background-color: #d5f5e5;
    opacity: 1;
    box-shadow: 0px 4px 15px rgba(253, 203, 110, 0.6); /* 添加陰影 */
    animation: blink 1s infinite alternate; /* 閃爍效果 */
}

@keyframes blink {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0.8;
    }
}

.card-body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.card-control {
    cursor: pointer;
    background: transparent;
    border: none;
    padding: 0 3px 0 3px;
}

.card-control:hover {
    transform: scale(1.1);
}

.image-container {
    width: 100%;
    height: 200px;
    margin-top: 15px;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    border-radius: 10px;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.amount-badge {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.25em 0.75em;
    font-size: 0.875rem;
    font-weight: 700;
    color: black;
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid black;
    border-radius: 1rem;
}

.product-name {
    margin-top: 20px;
    text-align: center;
    width: 100%;
}

.product-category,
.expiry-date {
    text-align: center;
    width: 100%;
}

.expiry-date {
    position: absolute;
    bottom: 0%;
    left: 50%;
    transform: translateX(-50%);
}

.driver {
    box-shadow:
        rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
        rgba(0, 0, 0, 0.06) 0px 0px 0px 1px !important;
}

/* 左側固定導航欄樣式 */
.fixed-left-nav {
    position: fixed;
    left: 0;
    top: 70%;
    transform: translateY(-50%);
    width: auto;
}

.nav-container {
    min-width: 50px;
    transition: all 0.3s ease;
}

.vertical-btn {
    width: 50px;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 5px;
}

.vertical-text {
    writing-mode: vertical-rl;
    text-orientation: upright;
    white-space: nowrap;
    font-size: 1.125rem;
    transform: translateX(-10%);
}

/* 調整主內容區域的左側間距 */
@media (min-width: 992px) {
    .container-fluid {
        padding-left: calc(10px + 1rem) !important;
    }
}

/* 按鈕hover效果 */
.btn:hover:not(.disabled-link) {
    transform: translateX(5px);
}

/* 底部導航欄樣式（用於小螢幕） */
.fixed-bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1030;
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
}

/* 為了確保卡片區域不被導航欄遮擋 */
.row-cols-1 {
    margin-bottom: 1rem;
}
</style>
