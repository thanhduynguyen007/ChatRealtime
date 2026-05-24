import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios"
const api = axios.create({
    baseURL: import.meta.env.MODE === "development" ? `${import.meta.env.VITE_API_URL}/api` : "/api",
    withCredentials: true
});

// Găns access token vào req header
api.interceptors.request.use((config) => {
    const {accessToken} = useAuthStore.getState();
    if(accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config
})
//tự dộng gọi refresh token khi access token hết hạn
api.interceptors.response.use((res) => res, async(error) => {
    const originalRequest = error.config;
    // Những api không cần check
    if(originalRequest.url.includes("/auth/signin") ||originalRequest.url.includes("/auth/signup") || originalRequest.url.includes("/auth/refresh") ) {
        return Promise.reject(error);
    };
    originalRequest._retryCount = originalRequest._retryCount || 0;
    if(error.response?.status === 403 && originalRequest._retryCount < 4) {
        originalRequest._retryCount+=1;
        try {
            const res = await api.post("/auth/refresh", null, {withCredentials: true});
            const newAccessToken = res.data.accessToken;
            useAuthStore.getState().setAccessToken(newAccessToken)
            originalRequest.header.Authorization = `Bearer ${newAccessToken}`;
        } catch (refreshError) {
            console.error(refreshError);
            useAuthStore.getState().clearState();
            return Promise.reject(refreshError);
            
        }

    }
    return Promise.reject(error)
})
export default api