import { Stack } from "expo-router";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { PageLoading } from "@/components/common/loading/PageLoading";

export default function AuthLayout() {
  const { isRestoring } = useAuthGuard();
  return isRestoring ? (
    <PageLoading />
  ) : (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
