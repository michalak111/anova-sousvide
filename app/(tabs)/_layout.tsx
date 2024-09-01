import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/Navigation/TabBarIcon";
import { Colors } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Tabs
        initialRouteName="home"
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            unmountOnBlur: true,
            title: "Home",
            tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "home" : "home-outline"} color={color} />,
          }}
        />
        <Tabs.Screen
          name="index"
          redirect={true}
          options={{
            href: null,
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
    </>
  );
}
