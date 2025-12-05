import { Stack } from "expo-router";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";

export default function AuthLayout() {
  useAuthGuard();
  return <Stack screenOptions={{ headerShown: false }} />;
}
