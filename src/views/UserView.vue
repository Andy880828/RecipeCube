<script setup>
// 引入 ref API，用來管理響應式狀態
import { ref, onMounted } from 'vue';

const ingredients = ref([]); // 存儲所有食材資料
const selectedCategory = ref(''); // 使用者選擇的分類
const filteredIngredients = ref([]); // 選取分類後過濾的食材
const selectedIngredientId = ref(null); // 儲存選擇的食材 ID
const foodtype = ref('');
const isFoodModalVisible = ref(false);
const isCreateGroupModalVisible = ref(false);
const isChangeGroupModalVisible = ref(false);

// 定義一個響應式變數 username，儲存使用者名稱
const username = ref('');

// 從 localStorage 取得使用者資料並解析為 JSON，儲存到 storedUserData 中
const storedUserData = JSON.parse(localStorage.getItem('UserData'));
console.log(storedUserData);
// 定義選單項目，包含標籤名稱；activeIndex 將會控制選擇的項目
const menuItems = ref(['基本資料', '飲食偏好', '群組']);

const activeIndex = ref(-1);

// setActive 函式用於設定目前選中的選單項目
const setActive = (index) => {
    activeIndex.value = index; // 更新 activeIndex，根據點擊的項目
};

const AccountSettings = ref({
    user_Id: storedUserData?.UserId, // 從 localStorage 中取得使用者ID
    userName: storedUserData?.UserName || '', // 預設使用者名稱
    phone: storedUserData?.Phone || '', // 預設使用者電話
});
// 發送請求的函式
const sendBasic = async () => {
    const response = await fetch(API_URL_AccountSettings, {
        method: 'PUT',
        body: JSON.stringify(AccountSettings.value), // 將 AccountSettings 轉為 JSON 格式
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        const updatedUserData = {
            ...storedUserData, // 保留其他資料
            UserName: AccountSettings.value.userName, // 更新姓名
            Phone: AccountSettings.value.phone, // 更新電話
        };

        // 更新 localStorage
        localStorage.setItem('UserData', JSON.stringify(updatedUserData));
        alert('修改成功！'); // 顯示成功訊息
    } else {
        const data = await response.json();
        alert('修改失敗：' + data.Message); // 顯示錯誤訊息
    }
};

const API_URL_AccountSettings = `${import.meta.env.VITE_API_BASEURL}/Users/AccountSettings`;
const preferIngredientsArray = ref([]); // 儲存偏好食材
const exclusiveIngredientsArray = ref([]); // 儲存不可食用食材

const loadPreferIngredients = () => {
    const preferIngredientsString = localStorage.getItem('PreferIngredients');
    preferIngredientsArray.value = preferIngredientsString
        ? preferIngredientsString.split('\n').map((item) => {
              const parts = item.split(',');
              return { id: parts[0], name: parts[1].replace(/"/g, '') };
          })
        : [];
};
loadPreferIngredients();

const loadExclusiveIngredients = () => {
    const exclusiveIngredientsString = localStorage.getItem('ExclusiveIngredients');
    exclusiveIngredientsArray.value = exclusiveIngredientsString
        ? exclusiveIngredientsString.split('\n').map((item) => {
              const parts = item.split(',');
              return { id: parts[0], name: parts[1].replace(/"/g, '') };
          })
        : [];
};
loadExclusiveIngredients();

// 處理按鈕點擊事件
const handleButtonClick = (id) => {
    console.log(`按鈕 ID: ${id} 被點擊`); // 你可以在這裡添加更多處理邏輯
};

const API_URL_ExclusiveIngredientsDelete = `${
    import.meta.env.VITE_API_BASEURL
}/UserIngredients/ExclusiveIngredientsDelete`;
const API_URL_PreferedIngredientsDelete = `${
    import.meta.env.VITE_API_BASEURL
}/UserIngredients/PreferedIngrediensDelete`;

// 刪除 API 呼叫
const sendDelPreFood = async (ingredientId) => {
    try {
        const response = await fetch(`${API_URL_PreferedIngredientsDelete}?id=${ingredientId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            alert('刪除成功！');
            preferIngredientsArray.value = preferIngredientsArray.value.filter((item) => item.id !== ingredientId);
            updateLocalStorage(); // 同步更新 localStorage
        } else {
            const data = await response.json();
            alert('刪除失敗：' + data.Message);
        }
    } catch (error) {
        alert('刪除請求失敗：' + error.message);
    }
};

const sendDelEXFood = async (ingredientId) => {
    try {
        const response = await fetch(`${API_URL_ExclusiveIngredientsDelete}?id=${ingredientId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            alert('刪除成功！');
            exclusiveIngredientsArray.value = exclusiveIngredientsArray.value.filter(
                (item) => item.id !== ingredientId
            );
            updateLocalStorage(); // 同步更新 localStorage
        } else {
            const data = await response.json();
            alert('刪除失敗：' + data.Message);
        }
    } catch (error) {
        alert('刪除請求失敗：' + error.message);
    }
};

// 更新 localStorage 的方法
const updateLocalStorage = () => {
    const exingredientsString = exclusiveIngredientsArray.value.map((item) => `${item.id},"${item.name}"`).join('\n');
    localStorage.setItem('ExclusiveIngredients', exingredientsString);
    const preingredientsString = preferIngredientsArray.value.map((item) => `${item.id},"${item.name}"`).join('\n');
    localStorage.setItem('PreferIngredients', preingredientsString);
};

// 點擊 X 按鈕的處理函式
const handleEXDelete = (ingredientId) => {
    sendDelEXFood(ingredientId);
};

// 點擊 X 按鈕的處理函式
const handlePreDelete = (ingredientId) => {
    sendDelPreFood(ingredientId);
};
const API_URL_Ingredients = `${import.meta.env.VITE_API_BASEURL}/Ingredients`;

// 在組件載入時執行 API 呼叫取出食材名稱
onMounted(async () => {
    try {
        const response = await fetch(API_URL_Ingredients);
        if (response.ok) {
            const data = await response.json();
            ingredients.value = data.map((item) => ({
                ingredientId: item.ingredientId,
                ingredientName: item.ingredientName,
                category: item.category,
            }));
        } else {
            console.error('無法取得資料');
        }
    } catch (error) {
        console.error('API 請求錯誤:', error);
    }
    activeIndex.value = 0;
});

// 取出食材名稱
const filterIngredientsByCategory = () => {
    if (selectedCategory.value) {
        filteredIngredients.value = ingredients.value.filter((item) => item.category === selectedCategory.value);
    } else {
        filteredIngredients.value = [];
    }
};

// 取值 (增加群組)
const addFoot = ref({
    user_Id: '',
    ingredient_Id: 0,
});
// 溝通API (增加食材)
const API_URL_IngredientsAdd = ref('');
const preferIngredientModal = (prefer) => {
    foodtype.value = '偏好食材';
    isFoodModalVisible.value = true;
    API_URL_IngredientsAdd.value = `${import.meta.env.VITE_API_BASEURL}/UserIngredients/PreferedIngredientsAdd`;
    selectedCategory.value = ''; // 使用者選擇的分類
    filteredIngredients.value = []; // 選取分類後過濾的食材
    selectedIngredientId.value = ''; // 儲存選擇的食材 ID
};
const exclusiveIngredientModal = (exclusive) => {
    foodtype.value = '不可食用食材';
    isFoodModalVisible.value = true;
    API_URL_IngredientsAdd.value = `${import.meta.env.VITE_API_BASEURL}/UserIngredients/ExclusiveIngredientsAdd`;
    selectedCategory.value = ''; // 使用者選擇的分類
    filteredIngredients.value = []; // 選取分類後過濾的食材
    selectedIngredientId.value = ''; // 儲存選擇的食材 ID
};
const sendAddIngredientModal = async () => {
    try {
        addFoot.value.user_Id = storedUserData?.UserId;
        addFoot.value.ingredient_Id = selectedIngredientId.value;
        const response = await fetch(API_URL_IngredientsAdd.value, {
            method: 'POST',
            body: JSON.stringify(addFoot.value),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            alert('新增成功！');
            if (foodtype.value === '偏好食材') {
                const preferredIngredientsResponse = await fetch(
                    `${import.meta.env.VITE_API_BASEURL}/UserIngredients/PreferedIngredientsName?User_Id=${storedUserData?.UserId}`
                );
                const preferredIngredientsGet = await preferredIngredientsResponse.json();

                if (preferredIngredientsResponse.ok && preferredIngredientsGet.preferredIngredients.length > 0) {
                    const preferIngredientsFormatted = preferredIngredientsGet.preferredIngredients
                        .map((ingredient) => `${ingredient.preferIngredientId},"${ingredient.preferIngredientName}"`)
                        .join('\n');
                    localStorage.setItem('PreferIngredients', preferIngredientsFormatted);
                    loadPreferIngredients();
                }
            } else if (foodtype.value === '不可食用食材') {
                const exclusiveIngredientsResponse = await fetch(
                    `${import.meta.env.VITE_API_BASEURL}/UserIngredients/ExclusiveIngredientsName?User_Id=${storedUserData?.UserId}`
                );
                const exclusiveIngredientsGet = await exclusiveIngredientsResponse.json();

                if (exclusiveIngredientsResponse.ok && exclusiveIngredientsGet.exclusiveIngredients.length > 0) {
                    const exclusiveIngredientsFormatted = exclusiveIngredientsGet.exclusiveIngredients
                        .map(
                            (ingredient) =>
                                `${ingredient.exclusiveIngredientId},"${ingredient.exclusiveIngredientName}"`
                        )
                        .join('\n');
                    localStorage.setItem('ExclusiveIngredients', exclusiveIngredientsFormatted);
                    loadExclusiveIngredients();
                }
            }
        } else {
            const data = await response.json();
            alert('新增失敗：' + data.Message);
        }
    } catch (error) {
        alert('新增請求失敗：' + error.message);
    } finally {
        isFoodModalVisible.value = false;
    }
};

// 取值 (建立群組)
const groupName = ref(storedUserData?.UserName + '的群組');
const CreateGroup = ref({
    group_name: groupName.value,
    group_Admin_Id: storedUserData?.UserId,
});
// 溝通API (建立群組)
const API_URL_CreateGroup = `${import.meta.env.VITE_API_BASEURL}/UserGroups/CreateGroup`;
const sendCreateGroup = async () => {
    try {
        const response = await fetch(API_URL_CreateGroup, {
            method: 'POST',
            body: JSON.stringify(CreateGroup.value),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            alert('新增成功！');
        } else {
            const data = await response.json();
            alert('新增失敗：' + '已有群組');
        }
    } catch (error) {
        alert('新增請求失敗：' + error.message);
    }
};

// 取值 (更換群組)
const changeGroup = ref({
    change_user_Id: storedUserData?.UserId,
    change_Group_Id: storedUserData?.GroupId,
});
// 溝通API (更換群組)
const API_URL_ChangeGroup = `${import.meta.env.VITE_API_BASEURL}/Users/changeGroup`;
const sendchangeGroup = async () => {
    try {
        const response = await fetch(API_URL_ChangeGroup, {
            method: 'PUT',
            body: JSON.stringify(changeGroup.value),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            const updatedUserData = {
                ...storedUserData, // 保留其他資料
                GroupId: changeGroup.value.change_Group_Id, // 更新群組id
            };
            // 更新 localStorage
            localStorage.setItem('UserData', JSON.stringify(updatedUserData));
            alert('新增成功！');
        } else {
            const data = await response.json();
            alert('新增失敗：' + data.message);
        }
    } catch (error) {
        alert('新增請求失敗：' + error.message);
    }
};
</script>

<template>
    <!-- 橫幅區塊 -->
    <section>
        <div class="header">
            <div class="title">
                <h1>帳戶設定</h1>
                <h1>Account settings</h1>
            </div>
        </div>
    </section>

    <div class="row">
        <!-- 左側選單 -->
        <div class="col-12 col-md-3 p-5 mt-5">
            <div class="list-group">
                <!-- 使用 v-for 迴圈渲染選單項目 -->
                <!-- 根據activeIndex 動態設定選單項目樣式 -->
                <!-- ARIA 屬性幫助無障礙性 -->
                <a
                    v-for="(item, index) in menuItems"
                    :key="index"
                    href="#"
                    class="list-group-item list-group-item-action"
                    :class="{ active: activeIndex === index }"
                    :aria-current="activeIndex === index ? 'true' : null"
                    @click="setActive(index)"
                >
                    <!-- 點擊事件，調用 setActive 函式 -->
                    {{ item }}
                </a>
            </div>
        </div>

        <!-- 右側內容區域 -->
        <div class="col-12 col-md-9 d-flex flex-column mx-auto">
            <!-- 根據 activeIndex 動態顯示對應的內容 -->
            <div v-if="activeIndex === 0">
                <h4 class="mt-5 text-center">您的基本資料</h4>
                <form @submit.prevent="sendBasic">
                    <div class="mt-3 w-60 mx-auto min-vh-50">
                        <label for="name" class="fs-6">姓名</label>
                        <input
                            type="text"
                            class="form-control text-center"
                            name="name"
                            v-model="AccountSettings.userName"
                            id="name"
                            placeholder="姓名"
                            required
                        />
                        <label class="fs-6 mt-3">Email</label>
                        <p class="form-control text-center">
                            {{ storedUserData?.Email }}
                        </p>
                        <label for="phone" class="fs-6">電話</label>
                        <input
                            type="text"
                            class="form-control text-center"
                            name="phone"
                            v-model="AccountSettings.phone"
                            id="phone"
                            placeholder="電話"
                            required
                        />
                        <div class="text-center">
                            <button type="submit" class="btn bg-gradient-success w-100 mt-5 mb-4 fs-6">確認修改</button>
                        </div>
                    </div>
                </form>
            </div>
            <!-- 飲食偏好區塊內容 -->
            <div v-else-if="activeIndex === 1">
                <h4 class="mt-5 text-center">您的飲食偏好</h4>
                <div class="mt-3 w-60 mx-auto min-vh-50">
                    <h5>
                        偏好食材<button class="add-button" @click="preferIngredientModal('prefer')">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </h5>
                    <span
                        v-for="(item, index) in preferIngredientsArray"
                        :key="index"
                        :id="item.id"
                        class="btn btn-sm btn-success m-1 px-3"
                        @click="handleButtonClick(item.id)"
                    >
                        {{ item.name }}
                        <!-- X 按鈕 -->
                        <button
                            class="btn-close ms-2 p-1"
                            aria-label="Close"
                            @click="handlePreDelete(item.id)"
                        ></button>
                    </span>
                    <span v-if="!preferIngredientsArray.length">目前無偏好食材</span>
                    <h5 class="mt-5">
                        不可食用食材<button class="add-button" @click="exclusiveIngredientModal('exclusive')">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </h5>
                    <span
                        v-for="(item, index) in exclusiveIngredientsArray"
                        :key="index"
                        :id="item.id"
                        class="btn btn-sm btn-danger m-1 px-3"
                        @click="handleButtonClick(item.id)"
                    >
                        {{ item.name }}
                        <!-- X 按鈕 -->
                        <button
                            class="btn-close ms-2 p-1"
                            aria-label="Close"
                            @click="handlePreDelete(item.id)"
                        ></button>
                    </span>
                    <span v-if="!exclusiveIngredientsArray.length">目前無偏好食材</span>
                </div>
            </div>
            <!-- 群組區塊內容 -->
            <div v-else-if="activeIndex === 2">
                <h4 class="mt-5 text-center">您的群組</h4>
                <div class="mt-3 w-60 mx-auto">
                    <p class="group-text text-center">{{ storedUserData?.GroupId }}</p>
                    <p class="text-black text-center fs-6">是您目前的群組編號</p>
                    <div class="d-flex justify-content-center">
                        <button class="btn bg-gradient-success m-1 fs-6" @click="isCreateGroupModalVisible = true">
                            新增群組
                        </button>
                        <button class="btn bg-gradient-success m-1 fs-6" @click="isChangeGroupModalVisible = true">
                            更換群組
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 食材選擇 -->
    <el-dialog
        v-model="isFoodModalVisible"
        width="50%"
        center
        :modal-append-to-body="true"
        :append-to-body="true"
        :z-index="1000"
    >
        <h5 class="text-center">新增{{ foodtype }}</h5>
        <div class="bg-white rounded-4 p-3">
            <div class="d-flex justify-content-center align-items-center pb-3">
                <!-- 分類選擇 -->
                <label for="categorySelect" class="fs-6 mt-2">選擇類別</label>
                <select
                    id="categorySelect"
                    v-model="selectedCategory"
                    @change="filterIngredientsByCategory"
                    class="form-select mx-3 w-30 fs-6"
                >
                    <option value="">選擇類別</option>
                    <option
                        v-for="category in [...new Set(ingredients.map((i) => i.category))]"
                        :key="category"
                        :value="category"
                    >
                        {{ category }}
                    </option>
                </select>

                <!-- 食材選擇 -->
                <label for="ingredientSelect" class="fs-6 mt-2">選擇食材</label>
                <select id="ingredientSelect" v-model="selectedIngredientId" class="form-select mx-3 w-30 fs-6">
                    <option value="">選擇食材</option>
                    <option
                        v-for="ingredient in filteredIngredients"
                        :key="ingredient.ingredientId"
                        :value="ingredient.ingredientId"
                    >
                        {{ ingredient.ingredientName }}
                    </option>
                </select>
            </div>
        </div>
        <div class="d-flex justify-content-center">
            <button type="submit" class="btn btn-primary me-2" @click="sendAddIngredientModal">
                加入{{ foodtype }}
            </button>
            <button class="btn btn-secondary" @click="isFoodModalVisible = false">關閉</button>
        </div>
    </el-dialog>

    <!-- 創建群組 Modal -->
    <el-dialog
        v-model="isCreateGroupModalVisible"
        width="50%"
        center
        :modal-append-to-body="true"
        :append-to-body="true"
        :z-index="1000"
    >
        <h5 class="text-center">新增群組</h5>
        <div class="d-flex justify-content-center align-items-center pb-3">
            <label for="groupNameInput" class="fs-6 mt-2">群組名稱</label>
            <input
                type="text"
                id="groupNameInput"
                v-model="CreateGroup.group_name"
                class="form-control m-3 w-50 fs-6 text-center"
            />
        </div>
        <div class="d-flex justify-content-center">
            <button class="btn btn-primary me-2" @click="sendCreateGroup">創建群組</button>
            <button class="btn btn-secondary" @click="isCreateGroupModalVisible = false">關閉</button>
        </div>
    </el-dialog>

    <!-- 更換群組 Modal -->
    <el-dialog
        v-model="isChangeGroupModalVisible"
        width="50%"
        center
        :modal-append-to-body="true"
        :append-to-body="true"
        :z-index="1000"
    >
        <h5 class="text-center">更換群組</h5>
        <div class="d-flex justify-content-center align-items-center pb-3">
            <label for="groupNameInput" class="fs-6 mt-2">群組ID</label>
            <input
                type="text"
                id="groupNameInput"
                v-model="changeGroup.change_Group_Id"
                class="form-control m-3 w-50 fs-6 text-center"
            />
        </div>
        <div class="d-flex justify-content-center">
            <button type="button" class="btn btn-primary me-2" @click="sendchangeGroup">確認更換群組</button>
            <button type="button" class="btn btn-secondary" @click="isChangeGroupModalVisible = false">關閉</button>
        </div>
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

.add-button {
    border: none;
    background-color: transparent;
    color: rgb(48, 48, 48);
    font-weight: 600;
    font-size: 1.5 rem;
}
.add-button:hover {
    color: #595959;
    /* 懸停時變色 */
    cursor: pointer;
    transform: scale(1.1);
    /* 懸停時放大效果 */
    transition:
        transform 0.2s,
        background-color 0.2s;
    /* 添加平滑動畫 */
}
.group-text {
    color: #595959;
    font-weight: 600;
    font-size: 5rem;
}
</style>
