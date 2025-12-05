import { useAuthStore } from "@/lib/stores/auth.store";
import { shopifyGetCustomer } from "@/lib/api/generated/shopify/shopify";
import type { User } from "@/lib/api/model/user";

export const useAuth = () => {
  const { login: storeLogin, logout: storeLogout } = useAuthStore();

  /**
   * Login with backend user data
   * Fetches customer info from Shopify and stores in auth state
   */
  const login = async () => {
    // Fetch customer information from Shopify using access token
    const customer = await shopifyGetCustomer();

    // Store user info in auth state
    await storeLogin(customer);
  };

  /**
   * Logout and clear auth state
   */
  const logout = async () => {
    await storeLogout();
  };

  return {
    login,
    logout,
  };
};
