import React from "react";
import { Stack } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CookingStatusBar } from "@/components/CookingStatusBar";

export default function HomeLayout() {
  const backgroundColor = useThemeColor({}, "background");
  return (
    <>
      <CookingStatusBar />
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerShown: true,
          contentStyle: { backgroundColor },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="guides/index" options={{ title: "Guides list" }} />
        <Stack.Screen name="guides/[id]/index" />
        <Stack.Screen name="history/index" options={{ title: "Cooking history" }} />
      </Stack>
    </>
  );
}
