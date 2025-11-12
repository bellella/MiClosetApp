import { create } from "zustand";
import { storage } from "../utils/storage";

type User = { id: string; name: string; email: string };

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isRestoring: boolean;
  isLoggedIn: boolean;
  restoreUser: () => Promise<void>;
  login: (data: { user: User; accessToken: string; refreshToken: string }) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isRestoring: true,
  isLoggedIn: false,
  restoreUser: async () => {
    const savedUser = await storage.getItem("user");
    const savedAccess = await storage.getItem("accessToken");
    const savedRefresh = await storage.getItem("refreshToken");

    if (savedUser && savedAccess) {
      set({
        user: JSON.parse(savedUser),
        accessToken: savedAccess,
        refreshToken: savedRefresh,
        isLoggedIn: true,
      });
    }

    set({ isRestoring: false });
  },
  login: async ({ user, accessToken, refreshToken }) => {
    set({ user, accessToken, refreshToken, isLoggedIn: true });
    await storage.setItem("user", JSON.stringify(user));
    await storage.setItem("accessToken", accessToken);
    await storage.setItem("refreshToken", refreshToken);
  },
  logout: async () => {
    set({ user: null, accessToken: null, refreshToken: null, isLoggedIn: false });
    await storage.deleteItem("user");
    await storage.deleteItem("accessToken");
    await storage.deleteItem("refreshToken");
  },
}));
