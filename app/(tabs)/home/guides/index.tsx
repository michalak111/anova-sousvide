import { Text } from "@/components/Text";
import React from "react";
import { Link } from "expo-router";
import { Guide, guidesCollection } from "@/app/(tabs)/home/guides/data";
import { FlatList, Pressable, SafeAreaView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function GuidesListPage() {
  return (
    <SafeAreaView>
      <FlatList
        data={guidesCollection}
        renderItem={(info) => <Item data={info.item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, marginTop: 16 }}
      />
    </SafeAreaView>
  );
}

const Item = ({ data }: { data: Guide }) => {
  const border = useThemeColor({}, "border");
  const { id, title } = data;

  return (
    <Link href={`/home/guides/${id}`} asChild>
      <Pressable
        style={{
          borderWidth: 1,
          borderColor: border,
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
        <FontAwesome name="chevron-right" size={24} color={border} />
      </Pressable>
    </Link>
  );
};
