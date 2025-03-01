import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { BLEService } from "@/services/BLEService";
import { mockBLEService } from "@/services/mocks/MockBLEService";
import { useEasUpdate } from "@/hooks/useEasUpdate";
import { AcceptUpdateDrawer } from "@/components/AcceptUpdateDrawer";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

if (process.env.EXPO_PUBLIC_BLE_MOCK_ENABLED === "true") {
  mockBLEService();
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const { loaded: updateLoded, isUpdateAvailable, acceptUpdate, declineUpdate } = useEasUpdate();
  const loaded = fontsLoaded && updateLoded;

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync();
      (async () => {
        await BLEService.initializeBLE();
      })();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <AcceptUpdateDrawer opened={!!isUpdateAvailable} onAccept={acceptUpdate} onDecline={declineUpdate} />
    </ThemeProvider>
  );
}
