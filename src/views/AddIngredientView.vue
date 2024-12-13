<script setup>
import CategorySwiperComponent from '@/components/CategorySwiperComponent.vue';
import Swal from 'sweetalert2';
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import UnitConversionComponent from '@/components/UnitConversionComponent.vue';
import { useInventoryStore } from '@/stores/inventoryStore';
import { usePantryStore } from '@/stores/pantryStore';
import { useScrollStore } from '@/stores/scrollStore';

const inventoryStore = useInventoryStore();
const { postInventory } = inventoryStore;
const pantryStore = usePantryStore();
const { postPantry } = pantryStore;
const scrollStore = useScrollStore();
const { appScrollContainer } = storeToRefs(scrollStore);

const selectedIngredients = ref([]); //用一個selectedIngredients當作子組建的同名物件供操作
const addingInventories = ref([]); //定義要加入庫存的食材

const isValidated = computed(() => {
    //所有食材的數量都必須大於0
    return !addingInventories.value.some((inventory) => inventory.quantity <= 0);
});

//利用watch監測selectedIngredients，即時更新addingInventories
watch(
    selectedIngredients,
    (newIngredients) => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        const expiryDate = date.toISOString().split('T')[0];

        //更新addingInventories 的值
        addingInventories.value = newIngredients.map((ingredient) => {
            return {
                ...ingredient,
                quantity: 1, //初始數量
                expiryDate: expiryDate, //到期日期
                visibility: false, //預設 visibility
            };
        });
    },
    { immediate: true }
);

////提醒
//確認公版
const check = (text, icon, buttonText, func, secondTitle) => {
    Swal.fire({
        title: '您確定嗎?',
        text: text,
        icon: icon,
        heightAuto: false,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: buttonText,
        cancelButtonText: '取消',
    }).then((result) => {
        if (result.isConfirmed) {
            func();
            Swal.fire({
                title: secondTitle,
                heightAuto: false,
                icon: 'success',
            });
        }
    });
};
// 清空列表按鈕的提醒
const alertClearCheck = () => {
    check(
        '即將清空所選食材列表',
        'warning',
        '清空',
        () => {
            deleteInventories();
        },
        '清空了!'
    );
};
//加入食材庫存提醒
const alertAddCheck = () => {
    check(
        '即將加入食材至庫存',
        'question',
        '加入',
        () => {
            addInventories();
        },
        '成功加入!'
    );
};
//提醒公版
const swalAlert = (text) => {
    Swal.fire({
        title: '提醒您',
        text: text,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK',
    });
};
////提醒結束

//刪除食材按鈕
const deleteInventory = (inventory) => {
    const deletingIndex = selectedIngredients.value.findIndex((item) => item.ingredientId === inventory.ingredientId);
    if (deletingIndex > -1) {
        selectedIngredients.value = [
            //為了讓watch讀到，需要直接賦值
            ...selectedIngredients.value.slice(0, deletingIndex), //第一個到要刪的(不包含要刪的)
            ...selectedIngredients.value.slice(deletingIndex + 1), //要刪的+1到最後
        ];
    }
};

//刪除全部食材按鈕
const deleteInventories = () => {
    selectedIngredients.value = [];
};

//加入食材按鈕
const addInventories = async () => {
    console.log(addingInventories.value);
    for (let inventory of addingInventories.value) {
        if (inventory.quantity === null) {
            console.log('數量不可為空');
            return;
        }
        if (inventory.quantity <= 0) {
            console.log('數量不可小於或等於 0');
            return;
        }
    }
    // 如果所有庫存項目都是有效的，則繼續處理
    const inventories = addingInventories.value.map((inventory) => ({
        ingredientId: inventory.ingredientId,
        quantity: inventory.quantity,
        expiryDate: inventory.expiryDate,
        visibility: inventory.visibility,
    }));
    console.log(inventories);
    if (inventories.length === 0) {
        swalAlert('請再次檢查您的輸入');
        return;
    }
    const userId = localStorage.getItem('UserId');
    const action = '增加';
    try {
        for (let inventory of inventories) {
            const { ingredientId, quantity, expiryDate, visibility } = inventory;
            // 執行 POST 請求
            await postInventory({
                ingredientId: ingredientId,
                quantity: quantity,
                expiryDate: expiryDate,
                visibility: visibility,
            });
            await postPantry({
                userId: userId,
                ownerId: undefined,
                ingredientId: ingredientId,
                quantity: quantity,
                action: action,
            });
        }
        // 清空已選食材
        selectedIngredients.value = [];
    } catch (error) {
        console.error('新增庫存時出錯:', error);
        swalAlert('發生錯誤，請稍後再試');
    }
    appScrollContainer.value.setScrollTop(0);
    appScrollContainer.value.update();
};
</script>

<template>
    <section>
        <div class="header">
            <div class="title">
                <h1>加入食材</h1>
                <h1>Add Ingredients</h1>
            </div>
        </div>
    </section>

    <section class="pt-5 overflow-hidden">
        <div class="container-fluid">
            <!-- 在子component用v-model相當於繫結它內部的props.modelValue，後面放什麼就會被傳過去 -->
            <CategorySwiperComponent v-model="selectedIngredients"></CategorySwiperComponent>
        </div>
    </section>

    <section v-if="selectedIngredients.length" class="py-3 overflow-hidden">
        <div class="d-flex justify-content-center mb-5">
            <hr class="horizontal dark my-0 w-50" />
        </div>
        <div class="container-fluid post-it shadow">
            <div class="row">
                <div class="col-md-12">
                    <div class="d-flex justify-content-between mt-2">
                        <h4>您今天買了 {{ selectedIngredients.length }} 樣食材</h4>
                        <UnitConversionComponent :addingInventoriesList="addingInventories"></UnitConversionComponent>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="table-responsive p-3">
                    <table class="table table-borderless text-center table-hover align-middle mb-0">
                        <thead>
                            <tr>
                                <th scope="col" class="text-dark">No</th>
                                <th scope="col" class="text-dark">食材</th>
                                <th scope="col" class="text-dark">數量</th>
                                <th scope="col" class="text-dark">權限</th>
                                <th scope="col" class="text-dark">期限</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(inventory, index) in addingInventories" :key="inventory.ingredientId">
                                <th scope="row" class="text-dark">{{ index + 1 }}</th>
                                <td class="text-dark">{{ inventory.ingredientName }}</td>
                                <td class="text-dark">
                                    <input
                                        v-model="inventory.quantity"
                                        type="number"
                                        class="form-control inline-control text-center w-30"
                                        placeholder="數量必須大於0"
                                    />
                                    {{ inventory.unit }}
                                </td>
                                <td class="text-dark">
                                    <select
                                        v-model="inventory.visibility"
                                        class="form-control inline-control text-center"
                                    >
                                        <option :value="false">群組</option>
                                        <option :value="true">私人</option>
                                    </select>
                                </td>
                                <td class="text-dark">
                                    <input
                                        v-model="inventory.expiryDate"
                                        type="date"
                                        class="form-control inline-control text-center"
                                    />
                                </td>
                                <td class="text-dark">
                                    <button class="delete-icon" @click="deleteInventory(inventory)">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="container-fluid pt-5">
            <div class="row justify-content-center">
                <div class="col-lg-3">
                    <button
                        class="btn text-dark shadow fs-5 w-100"
                        :class="isValidated ? 'bg-primary-subtle' : 'bg-secondary'"
                        :disabled="!isValidated"
                        @click="alertAddCheck"
                    >
                        加入食材
                    </button>
                </div>
                <div class="col-lg-3">
                    <button class="w-100 btn blur text-danger shadow fs-5" @click="alertClearCheck">
                        清空所選食材
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="css" scoped>
/* General Styles */
.container-fluid {
    padding: 0;
    margin: 0;
    max-width: 100vw;
}

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

.post-it {
    background: #fffaa2;
    padding: 0.5% 2% 2%;
    text-align: center;
}

.delete-icon {
    cursor: pointer;
    background: transparent;
    border: none;
    padding: 0 3px 0 3px;
}

.delete-icon:hover {
    transform: scale(1.1);
    transition: transform 0.2s;
    box-shadow: 0px 21px 44px rgba(0, 0, 0, 0.08);
}
</style>
