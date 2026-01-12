import { create } from "zustand";
import { storage } from "../utils/storage";
import { ShopifyCustomer } from "../api/model";
import { shopifyGetCustomer } from "../api/generated/shopify/shopify";
import { authLogout } from "../api/generated/auth/auth";

// type User = { id: string; name: string; email: string };

type AuthState = {
  user: ShopifyCustomer | null;
  accessToken: string | null;
  refreshToken: string | null;
  isRestoring: boolean;
  isLoggedIn: boolean;
  restoreUser: () => Promise<void>;
  login: (user: ShopifyCustomer) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isRestoring: true,
  isLoggedIn: false,
  restoreUser: async () => {
    try {
      const customer = await shopifyGetCustomer();
      if (customer) {
        set({ user: customer, isLoggedIn: true });
      }
    } catch (error) {
      set({ user: null, isLoggedIn: false });
    } finally {
      set({ isRestoring: false });
    }
  },
  login: async (user: ShopifyCustomer) => {
    set({ user, isLoggedIn: true });
  },
  logout: async () => {
    authLogout();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
    });
  },
}));
