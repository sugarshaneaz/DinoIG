import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  AndroidSoftInputModes,
  KeyboardController,
  KeyboardProvider,
} from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  setBaseUrl,
  setDefaultHeadersGetter,
} from "@workspace/api-client-react";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { initializeRevenueCat, SubscriptionProvider } from "@/lib/revenuecat";
import { getDeviceId } from "@/lib/deviceId";

// Set the base URL for the API client so Expo can reach the server
setBaseUrl(`https://${process.env.EXPO_PUBLIC_DOMAIN}`);

// Attach a stable per-install device id so the server can dedupe likes
setDefaultHeadersGetter(async () => ({
  "X-Device-Id": await getDeviceId(),
}));

// Initialize RevenueCat at app startup. Returns false (and logs) when keys
// aren't configured for the current platform — app continues to run without IAP.
initializeRevenueCat();

// Edge-to-edge mode (Expo SDK 54 default) ignores the AndroidManifest's
// windowSoftInputMode, so adjustResize has to be requested at runtime
// from the keyboard-controller native module. Without this, the chat
// input bar stays hidden under the IME on Android.
if (Platform.OS === "android") {
  KeyboardController.setInputMode(
    AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE,
  );
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="detail" options={{ presentation: "card" }} />
      <Stack.Screen name="chat" options={{ presentation: "card" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <SubscriptionProvider>
            <GestureHandlerRootView>
              <KeyboardProvider>
                <RootLayoutNav />
              </KeyboardProvider>
            </GestureHandlerRootView>
          </SubscriptionProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
