import React from "react";
import { Href, Link } from "expo-router";
import { View } from "@/components/View";
import { Text } from "@/components/Text";
import { Pressable } from "react-native";

export default function IndexHome() {
  return (
    <View style={{ padding: 16, gap: 16 }}>
      <Box href={"/home/guides"} title={"Guides"} />
      <Box href={"/home/history"} title={"History"} />
    </View>
  );
}

type BoxProps<T extends string | object> = {
  href: Href<T>;
  title: string;
};

const Box = <T extends string | object>({ href, title }: BoxProps<T>) => {
  return (
    <Link href={href} style={{ display: "flex", width: "100%" }} asChild>
      <Pressable>
        <View
          style={{
            display: "flex",
            borderWidth: 1,
            padding: 40,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
            elevation: 2,
          }}
        >
          <Text type="subtitle">{title}</Text>
        </View>
      </Pressable>
    </Link>
  );
};
