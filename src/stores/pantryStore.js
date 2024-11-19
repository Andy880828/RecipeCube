import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useIngredientStore } from './ingredientStore';
import { useAuthStore } from './auth';
import { useOAuthStore } from './oauth';
import { useOAuthLineStore } from './oauthLine';

export const usePantryStore = defineStore('pantryStore', () => {
    const BaseURL = import.meta.env.VITE_API_BASEURL;
    const pantryApiURL = `${BaseURL}/PantryManagements`;
    const ingredientStore = useIngredientStore();
    const { fetchIngredient } = ingredientStore;
    const authStore = useAuthStore();
    const oauthStore = useOAuthStore();
    const oauthLineStore = useOAuthLineStore();

    const pantries = ref([]);
    const userId = ref(null);
    const groupId = ref(null);

    const fetchPantries = async () => {
        try {
            userId.value =
                authStore.userData.value.UserId ||
                oauthStore.userData.value.UserId ||
                oauthLineStore.userData.value.UserId;
            const pantriesURL = `${pantryApiURL}/${userId.value}`;
            const response = await fetch(pantriesURL);
            if (!response.ok) {
                throw new Error('網路連線有異常');
            }
            const data = await response.json();
            pantries.value = data;
        } catch (error) {
            console.error('獲取紀錄資料失敗:', error);
            throw error;
        }
    };

    const postPantry = async ({ userId, ownerId, ingredientId, quantity, action }) => {
        try {
            groupId.value =
                authStore.userData.value.GroupId ||
                oauthStore.userData.value.GroupId ||
                oauthLineStore.userData.value.GroupId;
            const finalOwnerId = ownerId ?? userId;
            const response = await fetch(pantryApiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    PantryId: 0,
                    UserId: userId,
                    GroupId: groupId,
                    OwnerId: finalOwnerId,
                    IngredientId: ingredientId,
                    Quantity: quantity,
                    action: action,
                    time: new Date(),
                }),
            });
            if (!response.ok) {
                throw new Error('網路連線有異常');
            }
            await fetchPantries();
        } catch (error) {
            console.error('紀錄失敗:', error);
            throw error;
        }
    };

    const getFrequentlyUsedIngredients = async (threshold) => {
        //先抓資料
        await fetchPantries();

        //生出每個食材的使用次數表
        const ingredientCount = pantries.value.reduce((usedCount, pantry) => {
            //遍歷每個item生成使用次數表物件，利用key概念，避免重複的同時生成項次
            usedCount[pantry.ingredientId] = (usedCount[pantry.ingredientId] || 0) + 1;
            //回傳次數表
            return usedCount;
        }, {});

        //抓使用總次數
        const totalCount = pantries.value.length;

        //把次數少於總次數20%以下的食材過濾掉
        //先用key()取出所有key，filter過篩，map輸出Id陣列
        const frequentlyUsedIngredientId = Object.keys(ingredientCount)
            .filter((ingredientId) => ingredientCount[ingredientId] / totalCount > threshold)
            .map((ingredientId) => ingredientId);

        let frequentlyUsedIngredients;

        if (frequentlyUsedIngredientId.length === 0) {
            frequentlyUsedIngredients = [];
        } else {
            frequentlyUsedIngredients = await Promise.all(
                frequentlyUsedIngredientId.map((ingredientId) => fetchIngredient(ingredientId))
            );
        }

        //回傳結果
        return frequentlyUsedIngredients;
    };

    return { pantries, fetchPantries, postPantry, getFrequentlyUsedIngredients };
});
