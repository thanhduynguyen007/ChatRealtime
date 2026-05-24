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
    }return config
})
export default api