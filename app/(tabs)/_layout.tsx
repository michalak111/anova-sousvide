import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/Navigation/TabBarIcon";
import { Colors } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "home" : "home-outline"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="device"
        options={{
          title: "Device",
          tabBarIcon: ({ color, focused }) => <TabBarIcon name={"fast-food"} color={color} />,
        }}
      />
    </Tabs>
  );
}
