import { StyleSheet } from "react-native";

import { Text } from "@/components/Text";
import { View } from "@/components/View";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Button } from "@/components/Button";
import { BottomDrawer } from "@/components/BottomDrawer";

export default function Index() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}
      >
        <View>
          <Text>Home</Text>
          <Button
            onPress={() => {
              setOpened((o) => !o);
            }}
          >
            Toogle drawer
          </Button>
        </View>
      </ParallaxScrollView>
      <BottomDrawer opened={opened}>
        <Text>Some content</Text>
      </BottomDrawer>
    </>
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
