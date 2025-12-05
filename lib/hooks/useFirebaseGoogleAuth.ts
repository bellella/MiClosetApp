// import { useState } from "react";
// import { Platform, Alert } from "react-native";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import auth from "@react-native-firebase/auth";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";
// import { auth as webAuth } from "@/lib/firebase/config";
// import { useAuth } from "@/lib/hooks/useAuth";
// import { authFirebaseLogin } from "@/lib/api/generated/auth/auth";
// import { useRouter } from "expo-router";

// // Configure Google Sign-In for native platforms
// GoogleSignin.configure({
//   webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
//   scopes: ["profile", "email"],
// });

// export const useFirebaseGoogleAuth = () => {
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const router = useRouter();

//   const handleFirebaseAuth = async (idToken: string) => {
//     // Send Firebase ID Token to backend for authentication
//     const response = await authFirebaseLogin("google", { idToken });

//     if (response.isNewUser) {
//       // New user registration completed
//       Alert.alert("Welcome!", "Registration completed successfully.");
//     }

//     // Fetch customer info and store in auth state
//     await login(idToken);

//     router.replace("/mypage");
//   };

//   const signInWithGoogle = async () => {
//     try {
//       setLoading(true);

//       if (Platform.OS === "web") {
//         // Web: Use signInWithPopup
//         const provider = new GoogleAuthProvider();
//         const result = await signInWithPopup(webAuth, provider);
//         const user = result.user;

//         // Get Firebase ID Token
//         const idToken = await user.getIdToken();
//         await handleFirebaseAuth(idToken);
//       } else {
//         // iOS/Android: Google Sign-In SDK + Firebase Auth
//         // 1. Get ID Token from Google Sign-In
//         await GoogleSignin.hasPlayServices();
//         const { data } = await GoogleSignin.signIn();

//         if (!data?.idToken) {
//           throw new Error("Failed to get Google ID Token.");
//         }

//         // 2. Sign in to Firebase Auth with Google credential
//         const googleCredential = auth.GoogleAuthProvider.credential(
//           data.idToken
//         );
//         const { user } = await auth().signInWithCredential(googleCredential);

//         // Get Firebase ID Token
//         const idToken = await user.getIdToken();
//         await handleFirebaseAuth(idToken);
//       }
//     } catch (error: any) {
//       console.error("Google login failed:", error);
//       Alert.alert("Login Failed", error.message || "An error occurred during authentication.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     signInWithGoogle,
//     loading,
//   };
// };
