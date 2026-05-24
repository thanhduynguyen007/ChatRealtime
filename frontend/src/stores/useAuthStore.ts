import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    clearState: () => {
        set({ accessToken: null, user: null, loading: false });
    },

    signUp: async (username, password, email, firstName, lastName) => {
        try {
            set({ loading: true });

            await authService.signUp(username, password, email, firstName, lastName);

            toast.success("Đăng kí thành công! Bạn sẽ được chuyển sang trang đăng nhập");
        } catch (error) {
            console.error(error);
            toast.error("Đăng kí không thành công");
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    signIn: async (username, password) => {
        try {
            set({ loading: true });

           const {accessToken} = await authService.signIn(username, password);
           get().setAccessToken(accessToken)
            await get().fetchMe();

            toast.success("Chào mừng bạn quay trở lại với ChatRealtime");
        } catch (error) {
            console.error(error);
            toast.error("Đăng nhập không thành công");
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    signOut: async () => {
        try {
            get().clearState();

            await authService.signOut();

            toast.success("Logout thành công");
        } catch (error) {
            console.error(error);
            toast.error("Lỗi xảy ra khi logout");
            throw error;
        }
    },
    fetchMe: async() => {
        try {
            set({loading: true});
            const user = await authService.fetchMe();
            set({user});
        } catch (error) {
            console.error(error);
            set({user: null, accessToken: null});
            toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng!");
        }finally{
            set({loading: false})
        }
    },
    refresh: async() => {
        try {
            const {user, fetchMe, setAccessToken} = get();
            const accessToken = await authService.refresh();
           setAccessToken(accessToken)
            if(!user) {
                await fetchMe();
            }
        } catch (error) {
             console.error(error);
            get().clearState();
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại")
        }finally{
            set({loading: false})
        }
    },
    setAccessToken: (accessToken) => {
        set({accessToken});
    }
}));