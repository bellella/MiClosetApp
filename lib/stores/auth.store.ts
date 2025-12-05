import { create } from "zustand";
import { storage } from "../utils/storage";
import { ShopifyCustomer } from "../api/model";
import { shopifyGetCustomer } from "../api/generated/shopify/shopify";

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
    const customer = await shopifyGetCustomer();

    if (customer) {
      set({ user: customer, isLoggedIn: true });
    }

    set({ isRestoring: false });
  },
  login: async (user: ShopifyCustomer) => {
    set({ user, isLoggedIn: true });
    // await storage.setItem("user", JSON.stringify(user));
    // await storage.setItem("accessToken", accessToken);
    // await storage.setItem("refreshToken", refreshToken);
  },
  logout: async () => {
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
    });
    // await storage.deleteItem("user");
    // await storage.deleteItem("accessToken");
    // await storage.deleteItem("refreshToken");
  },
}));
