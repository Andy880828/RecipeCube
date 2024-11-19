// src/stores/oauth.js
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

export const useOAuthStore = defineStore('oauth', () => {
    const oAuthGemail = ref(null);
    const token = ref(null); // 初始 token
    const userData = ref(null); // 初始使用者資料
    const router = useRouter();
    const loginMessage = ref('');
    const jwt = ref(null);

    onMounted(() => {
        initializeStore();
    });

    const initializeStore = () => {
        token.value = localStorage.getItem('token') || null;
        userData.value = JSON.parse(localStorage.getItem('UserData')) || null;
    };

    const callback = async (response) => {
        if (response.credential) {
            jwt.value = response.credential;
            const Gemail = decodeJWT(jwt.value);
            oAuthGemail.value = {
                GEmail: Gemail.email,
            };
            await oAuthGooglelogin();
        }
    };
    const oAuthGooglelogin = async () => {
        const API_URL = `${import.meta.env.VITE_API_BASEURL}/OAuth/VerifyAudience`;
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ oAuthGoogleJwt: jwt.value }),
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
                        const exclusiveIngredientsResponse = await fetch(
                            `${import.meta.env.VITE_API_BASEURL}/UserIngredients/ExclusiveIngredientsName?User_Id=${userData.value.UserId}`
                        );
                        const exclusiveIngredientsGet = await exclusiveIngredientsResponse.json();

                        if (
                            exclusiveIngredientsResponse.ok &&
                            exclusiveIngredientsGet.exclusiveIngredients.length > 0
                        ) {
                            const exclusiveIngredientsFormatted = exclusiveIngredientsGet.exclusiveIngredients
                                .map(
                                    (ingredient) =>
                                        `${ingredient.ingredientId},"${ingredient.exclusiveIngredientName},${ingredient.exclusiveIngredientId},"`
                                )
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
                        const preferredIngredientsResponse = await fetch(
                            `${import.meta.env.VITE_API_BASEURL}/UserIngredients/PreferedIngredientsName?User_Id=${userData.value.UserId}`
                        );
                        const preferredIngredientsGet = await preferredIngredientsResponse.json();

                        if (
                            preferredIngredientsResponse.ok &&
                            preferredIngredientsGet.preferredIngredients.length > 0
                        ) {
                            const preferIngredientsFormatted = preferredIngredientsGet.preferredIngredients
                                .map(
                                    (ingredient) =>
                                        `${ingredient.ingredientId},"${ingredient.preferIngredientName},${ingredient.preferIngredientId},"`
                                )
                                .join('\n');
                            localStorage.setItem('PreferIngredients', preferIngredientsFormatted);
                        }
                    } catch (error) {
                        console.error('沒有偏好食材:', error);
                    }
                }
                window.location.href = '/'; // 頁面跳轉到主頁
                // router.push('/');
                return true; // 表示登入成功
            } catch (error) {
                console.error('解碼 JWT 失敗', error);
            }
        } else {
            router.push('/oAuthFirstSignIn');
        }
    };

    const oAuthFirstSignIn = async (Vegetarianrestrictions) => {
        const API_URL = `${import.meta.env.VITE_API_BASEURL}/OAuth/oAuthFirstSignIn`;
        const response = await fetch(API_URL, {
            method: 'PUT',
            body: JSON.stringify({ oAuthEmail: oAuthGemail.value.GEmail, dietaryRestrictions: Vegetarianrestrictions }), // 傳遞 jwt
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
                        const exclusiveIngredientsResponse = await fetch(
                            `${import.meta.env.VITE_API_BASEURL}/UserIngredients/ExclusiveIngredientsName?User_Id=${userData.value.UserId}`
                        );
                        const exclusiveIngredientsGet = await exclusiveIngredientsResponse.json();

                        if (
                            exclusiveIngredientsResponse.ok &&
                            exclusiveIngredientsGet.exclusiveIngredients.length > 0
                        ) {
                            const exclusiveIngredientsFormatted = exclusiveIngredientsGet.exclusiveIngredients
                                .map(
                                    (ingredient) =>
                                        `${ingredient.ingredientId},"${ingredient.exclusiveIngredientName},${ingredient.exclusiveIngredientId},"`
                                )
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
                        const preferredIngredientsResponse = await fetch(
                            `${import.meta.env.VITE_API_BASEURL}/UserIngredients/PreferedIngredientsName?User_Id=${userData.value.UserId}`
                        );
                        const preferredIngredientsGet = await preferredIngredientsResponse.json();

                        if (
                            preferredIngredientsResponse.ok &&
                            preferredIngredientsGet.preferredIngredients.length > 0
                        ) {
                            const preferIngredientsFormatted = preferredIngredientsGet.preferredIngredients
                                .map(
                                    (ingredient) =>
                                        `${ingredient.ingredientId},"${ingredient.preferIngredientName},${ingredient.preferIngredientId},"`
                                )
                                .join('\n');
                            localStorage.setItem('PreferIngredients', preferIngredientsFormatted);
                        }
                    } catch (error) {
                        console.error('沒有偏好食材:', error);
                    }
                }
                window.location.href = '/'; // 頁面跳轉到主頁
                // router.push('/');
                return true; // 表示登入成功
            } catch (error) {
                console.error('解碼 JWT 失敗', error);
            }
        } else {
            console.log('失敗');
            console.error('Error:', data.Message);
        }
    };
    return {
        token,
        userData,
        oAuthGemail,
        oAuthFirstSignIn,
        callback,
    };
});
