import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { View } from "@/components/View";
import React, { useEffect, useRef } from "react";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Dimensions } from "react-native";
import { StyleSheet } from "react-native";

type Props = {
  opened: boolean;
  children: React.ReactNode;
};

export const BottomDrawer = ({ opened, children }: Props) => {
  const screenHeight = Dimensions.get("screen").height;
  const tabBarHeight = useBottomTabBarHeight();
  const minHeight = 200;
  const contentHeight = useRef<number>(minHeight);
  const transformY = useSharedValue<number>(screenHeight);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(transformY.value, { damping: 100 }) }],
  }));

  useEffect(() => {
    if (opened) {
      transformY.value = screenHeight - tabBarHeight - contentHeight.current;
    } else {
      transformY.value = screenHeight;
    }
  }, [opened]);

  return (
    <Animated.View
      onLayout={(e) => {
        contentHeight.current = e.nativeEvent.layout.height;
      }}
      style={[
        animatedStyles,
        styles.root,
        {
          minHeight,
        },
      ]}
    >
      <View style={styles.content}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    width: "100%",
  },
  content: {
    elevation: 10,
    shadowColor: "black",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingTop: 30,
    paddingHorizontal: 20,
    flex: 1,
  },
});
