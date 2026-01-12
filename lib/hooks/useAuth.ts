import { useAuthStore } from "@/lib/stores/auth.store";
import { shopifyGetCustomer } from "@/lib/api/generated/shopify/shopify";
import {
  prefetchWishlistData,
  QUERY_KEY_IDS,
  QUERY_KEY_PRODUCTS,
} from "./useWishlist";
import { useQueryClient } from "@tanstack/react-query";
import { authLogout } from "../api/generated/auth/auth";

export const useAuth = () => {
  const { login: storeLogin, logout: storeLogout } = useAuthStore();
  const queryClient = useQueryClient();
  /**
   * Login with backend user data
   * Fetches customer info from Shopify and stores in auth state
   */
  const login = async () => {
    // Fetch customer information from Shopify using access token
    const customer = await shopifyGetCustomer();
    // Fetch wishlist ids
    //prefetchWishlistData(queryClient);
    // Store user info in auth state
    //queryClient.removeQueries({ queryKey: [QUERY_KEY_IDS] });
    await storeLogin(customer);
  };

  /**
   * Logout and clear auth state
   */
  const logout = async () => {
    await authLogout();
    // Clear wishlist data from React Query cache
    queryClient.removeQueries({ queryKey: [QUERY_KEY_IDS] });
    console.log("확실히 지웠음.");
    queryClient.removeQueries({ queryKey: [QUERY_KEY_PRODUCTS] });
    await storeLogout();
  };

  return {
    login,
    logout,
  };
};
