import { Text } from "@/components/Text";
import React from "react";
import { View } from "@/components/View";
import { Link } from "expo-router";
import { guidesCollection } from "@/app/(tabs)/home/guides/data";
import { Pressable, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export type Guide = {
  id: string;
  title: string;
  category: string[];
  variants: {
    name: string;
    cookerState: {
      temperatureCelsius: string;
      temperatureFahrenheit: string;
      timeInMinutes: string;
    };
  }[];
};

// TODO - refactor into FlatList

export default function GuidesListPage() {
  return (
    <ScrollView>
      <View style={{ paddingHorizontal: 16, gap: 8, marginTop: 16 }}>
        {guidesCollection.map((guide) => {
          const { id, title } = guide;
          return (
            <Link key={id} href={`/home/guides/${id}`} asChild>
              <Pressable
                style={{
                  borderWidth: 1,
                  padding: 16,
                  borderRadius: 8,
                  flexDirection: "row",
                  flex: 1,
                  display: "flex",
                  width: "100%",
                }}
              >
                <Text type="defaultSemiBold" style={{ flex: 1 }}>
                  {title}
                </Text>
                <FontAwesome name="chevron-right" size={24} color="black" />
              </Pressable>
            </Link>
          );
        })}
      </View>
    </ScrollView>
  );
}
