import React, { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { View, Text, Platform } from "react-native";
import { AppContainer } from "@/components/app/app-container";
import { CheckoutWaitingAlert } from "@/components/common/CheckoutWaitingAlert";

export default function CheckoutWebScreen() {
  const [isCheckoutInProgress, setIsCheckoutInProgress] = useState(true);
  const { url } = useLocalSearchParams<{ url: string }>();
  if (!url) return null;

  const decodedUrl = decodeURIComponent(url);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const popup = window.open(decodedUrl, "_blank", "width=480,height=800");

    if (!popup) {
      alert("팝업 차단이 되어있습니다. 팝업을 허용해주세요.");
      return;
    }

    // 2) URL 변화 + 팝업 종료 감지
    const interval = setInterval(() => {
      if (popup.closed) {
        clearInterval(interval);
        router.push("/order");
        return;
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppContainer headerTitle="checkout">
      <CheckoutWaitingAlert isOpen={isCheckoutInProgress} />
    </AppContainer>
  );
}
