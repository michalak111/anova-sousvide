import { StyleSheet } from "react-native";

import { Text } from "@/components/Text";
import { View } from "@/components/View";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";

export default function Index() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}
    >
      <View>
        <Text>Home</Text>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
});
