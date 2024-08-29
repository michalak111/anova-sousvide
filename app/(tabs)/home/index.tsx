import React from "react";
import { Link } from "expo-router";
import { View } from "@/components/View";
import { Text } from "@/components/Text";
import { Pressable } from "react-native";

export default function IndexHome() {
  return (
    <View style={{ padding: 16 }}>
      <Link href="/home/guides" style={{ display: "flex", width: "100%" }} asChild>
        <Pressable>
          <View
            style={{
              display: "flex",
              borderWidth: 2,
              padding: 40,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <Text type="subtitle">Guides</Text>
          </View>
        </Pressable>
      </Link>
    </View>
  );
}
