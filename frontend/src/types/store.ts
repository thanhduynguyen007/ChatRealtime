import type { User } from "@/types/user";

export interface AuthState {
    accessToken: string | null;
    user: User | null,
    loading: boolean,
    clearState: () => void,

    signUp: (username: string, email: string, password: string, firstName: string, lastName: string) => Promise<void>;
    signIn: (username:  string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    fetchMe: () => Promise<void>
}