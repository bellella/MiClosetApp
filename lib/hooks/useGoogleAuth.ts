import { useState, useEffect } from "react";
import { Platform, Alert } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useAuth } from "@/lib/hooks/useAuth";
import { authGoogleTokenLogin } from "@/lib/api/generated/auth/auth";
import { useRouter } from "expo-router";
import * as AuthSession from "expo-auth-session";

// Configure Google Sign-In for native platforms
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  scopes: ["profile", "email"],
});

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();



  // Web Google Auth configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    redirectUri: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_REDIRECT_URI,
    scopes: ["profile", "email"],
  });

  const handleGoogleAuth = async (accessToken: string) => {
    // Send Google access token to backend for authentication
    const responseData = await authGoogleTokenLogin({ accessToken });

    if (responseData.isNewUser) {
      // New user registration completed
      Alert.alert("Welcome!", "Registration completed successfully.");
    }

    // Fetch customer info and store in auth state
    await login();

    router.replace("/mypage");
  };

  // Handle web authentication response
  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      handleWebAuth(access_token);
    }
  }, [response]);

  const handleWebAuth = async (accessToken: string) => {
    try {
      setLoading(true);
      await handleGoogleAuth(accessToken);
    } catch (error: any) {
      console.error("Google login failed:", error);
      Alert.alert(
        "Login Failed",
        error.message || "An error occurred during authentication."
      );
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);

      if (Platform.OS === "web") {
        // Web: Use expo-auth-session
        await promptAsync();
      } else {
        // iOS/Android: Use Google Sign-In SDK
        await GoogleSignin.hasPlayServices();
        const { data } = await GoogleSignin.signIn();

        if (!data?.idToken) {
          throw new Error("Failed to get Google access token.");
        }
        // Get access token from Google Sign-In
        const tokens = await GoogleSignin.getTokens();
        await handleGoogleAuth(tokens.accessToken);
      }
    } catch (error: any) {
      console.error("Google login failed:", error);
      Alert.alert(
        "Login Failed",
        error.message || "An error occurred during authentication."
      );
    } finally {
      if (Platform.OS !== "web") {
        setLoading(false);
      }
    }
  };

  return {
    signInWithGoogle,
    loading: loading || (Platform.OS === "web" && !request),
  };
};
