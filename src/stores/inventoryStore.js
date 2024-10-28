import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useIngredientStore } from './ingredientStore';
import { usePantryStore } from './pantryStore';

export const useInventoryStore = defineStore('inventoryStore', () => {
    const BaseURL = import.meta.env.VITE_API_BASEURL;
    const inventoryApiURL = `${BaseURL}/Inventories`;
    const userId = localStorage.getItem('UserId');
    const groupId = localStorage.getItem('GroupId');
    const InventoriesURL = `${inventoryApiURL}/${userId}`;
    const ingredientStore = useIngredientStore();
    const { getDefaultExpiryDate } = ingredientStore;
    const pantryStore = usePantryStore();
    const { getFrequentlyUsedIngredients } = pantryStore;

    const inventories = ref([]); //庫存放這
    const ingredientCategory = ref(new Set()); //分類放這，用Set避免重複

    const fetchInventories = async () => {
        try {
            const response = await fetch(InventoriesURL);
            if (!response.ok) {
                throw new Error('網路連線有異常');
            }
            const data = await response.json();
            inventories.value = data.map((inventory) => ({
                ...inventory,
                synonymArray: inventory.synonym?.split(',').map((synonym) => synonym.trim()) || [],
            }));
            ingredientCategory.value = new Set(inventories.value.map((i) => i.category));
        } catch (error) {
            console.error('獲取庫存資料失敗:', error);
            throw error;
        }
    };

    const postInventory = async ({ ingredientId, quantity, expiryDate, visibility }) => {
        // 在函數內部處理預設值
        const finalExpiryDate = expiryDate ?? (await getDefaultExpiryDate(ingredientId));
        const finalVisibility = visibility ?? false;

        try {
            const response = await fetch(inventoryApiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    InventoryId: 0,
                    GroupId: groupId,
                    UserId: userId,
                    IngredientId: ingredientId,
                    Quantity: quantity,
                    ExpiryDate: finalExpiryDate,
                    IsExpiring: false,
                    Visibility: finalVisibility,
                }),
            });
            if (!response.ok) {
                throw new Error('新增失敗，網路連線有異常');
            }
            await fetchInventories();
        } catch (error) {
            console.error('新增庫存失敗:', error);
            throw error;
        }
    };

    const deleteInventory = async (inventoryId) => {
        try {
            const deleteURL = `${inventoryApiURL}/${inventoryId}`;
            const response = await fetch(deleteURL, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('刪除失敗，網路連線有異常');
            }
            await fetchInventories();
        } catch (error) {
            console.error('刪除庫存失敗:', error);
            throw error;
        }
    };

    const putInventory = async (inventory) => {
        try {
            const putURL = `${inventoryApiURL}/${inventory.inventoryId}`;
            console.log(putURL);
            const response = await fetch(putURL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    InventoryId: inventory.inventoryId,
                    UserId: inventory.userId,
                    GroupId: inventory.groupId,
                    IngredientId: inventory.ingredientId,
                    Quantity: inventory.quantity,
                    ExpiryDate: inventory.expiryDate,
                    IsExpiring: inventory.isExpiring,
                    Visibility: inventory.visibility,
                }),
            });
            if (!response.ok) {
                throw new Error('修改失敗，網路連線有異常');
            }
            await fetchInventories();
        } catch (error) {
            console.error('修改庫存失敗:', error);
            throw error;
        }
    };

    const getRunningOutIngredients = async () => {
        if (!inventories.value.length) await fetchInventories();

        const frequentlyUsedIngredientIds = (await getFrequentlyUsedIngredients(0.05)).map(
            (ingredient) => ingredient.ingredientId
        );
        const frequentlyUsedIngredients = inventories.value
            .filter(
                (ingredient) =>
                    frequentlyUsedIngredientIds.includes(ingredient.ingredientId) && ingredient.isExpired === false
            )
            .map((ingredient) => ({
                ingredientId: ingredient.ingredientId,
                ingredientName: ingredient.ingredientName,
                quantity: ingredient.quantity,
                unit: ingredient.unit,
                source: '常用食材',
            }));
        const isExpiredIngredients = inventories.value
            .filter((inventory) => inventory.isExpired === true)
            .map((inventory) => ({ ...inventory, source: '已經過期' }));

        const runningOutIngredients = [...frequentlyUsedIngredients, ...isExpiredIngredients];
        return runningOutIngredients.map((ingredient) => ({
            ingredientId: ingredient.ingredientId,
            ingredientName: ingredient.ingredientName,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            source: ingredient.source,
        }));
    };

    return {
        inventories,
        ingredientCategory,
        fetchInventories,
        postInventory,
        deleteInventory,
        putInventory,
        getRunningOutIngredients,
    };
});
