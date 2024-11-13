// src/stores/auth.js
import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const decodeJWT = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    return JSON.parse(jsonPayload);
};
export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') || null); // 初始 token
    const userData = ref(JSON.parse(localStorage.getItem('UserData')) || null); // 初始使用者資料
    const router = useRouter();
    const loginMessage = ref('');
    // 客服email
    const Contact = 'shipumofangkefu@gmail.com';
    const checkTokenExpiry = () => {
        const currentTime = Math.floor(Date.now() / 1000) //取的以秒為單位的目前時間
        if (userData.value?.Exp && userData.value.Exp < currentTime) {
            logout(); // token 已過期，進行登出
        }
    }
    const logout = () => {
        token.value = null;
        userData.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('UserData');
        localStorage.removeItem('UserId');
        localStorage.removeItem('GroupId');
        localStorage.removeItem('ExclusiveIngredients');
        localStorage.removeItem('PreferIngredients');
        router.push('/');
    };
    onMounted(() => {
        checkTokenExpiry();
    });
    const login = async (email, password) => {
        const API_URL = `${import.meta.env.VITE_API_BASEURL}/Users/SignIn`;
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            token.value = data.token;
            try {
                const decoded = decodeJWT(data.token);
                userData.value = {
                    UserId: decoded.certserialnumber,
                    Email: decoded.email,
                    UserName: decoded.unique_name,
                    Phone: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'],
                    GroupId: decoded.groupsid,
                    ExclusiveChecked: decoded.ExclusiveChecked,
                    PreferredChecked: decoded.PreferredChecked,
                    Exp: decoded.exp,
                };
                localStorage.setItem('UserData', JSON.stringify(userData.value));
                localStorage.setItem('UserId', userData.value.UserId);
                localStorage.setItem('GroupId', userData.value.GroupId);
                if (userData.value.ExclusiveChecked) {
                    try {
                        const exclusiveIngredientsResponse = await fetch(`${import.meta.env.VITE_API_BASEURL}/UserIngredients/ExclusiveIngredientsName?User_Id=${userData.value.UserId}`);
                        const exclusiveIngredientsGet = await exclusiveIngredientsResponse.json();

                        if (exclusiveIngredientsResponse.ok && exclusiveIngredientsGet.exclusiveIngredients.length > 0) {
                            const exclusiveIngredientsFormatted = exclusiveIngredientsGet.exclusiveIngredients
                                .map(ingredient => `${ingredient.ingredientId},"${ingredient.exclusiveIngredientName}",${ingredient.exclusiveIngredientId}`)
                                .join('\n');
                            localStorage.setItem('ExclusiveIngredients', exclusiveIngredientsFormatted);
                        }
                    } catch (error) {
                        console.error('沒有不可食用食材:', error);
                    }
                }
                // 根據 PreferredChecked 呼叫 API
                if (userData.value.PreferredChecked) {
                    try {
                        const preferredIngredientsResponse = await fetch(`${import.meta.env.VITE_API_BASEURL}/UserIngredients/PreferedIngredientsName?User_Id=${userData.value.UserId}`);
                        const preferredIngredientsGet = await preferredIngredientsResponse.json();

                        if (preferredIngredientsResponse.ok && preferredIngredientsGet.preferredIngredients.length > 0) {
                            const preferIngredientsFormatted = preferredIngredientsGet.preferredIngredients
                                .map(ingredient => `${ingredient.ingredientId},"${ingredient.preferIngredientName}",${ingredient.preferIngredientId}`)
                                .join('\n');
                            localStorage.setItem('PreferIngredients', preferIngredientsFormatted);
                        }
                    } catch (error) {
                        console.error('沒有偏好食材:', error);
                    }
                }
                return true; // 表示登入成功
            } catch (error) {
                console.error('解碼 JWT 失敗', error);
            }
        } else {
            loginMessage.value = data.message;
            return false; // 表示登入失敗
        }
    };
    return {
        token,
        userData,
        loginMessage,
        Contact,
        login,
        checkTokenExpiry,
        logout,
    };
});
