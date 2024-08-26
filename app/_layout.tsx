import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { BLEService } from "@/services/BLEService";
import { mockBLEService } from "@/services/mocks/MockBLEService";
import { View } from "@/components/View";
import { Text } from "@/components/Text";
import { useCookingStateStore } from "@/stores/cookingStore";
import { AnovaService } from "@/services/AnovaService";
import { CookingStatusBar } from "@/components/CookingStatusBar";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

if (process.env.EXPO_PUBLIC_BLE_MOCK_ENABLED === "true") {
  mockBLEService();
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

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
    </ThemeProvider>
  );
}
