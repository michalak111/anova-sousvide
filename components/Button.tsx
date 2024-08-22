import React, { ComponentProps } from "react";
import { ThemedText } from "@/components/ThemedText";
import { Pressable, StyleProp, ViewStyle, StyleSheet } from "react-native";

type ButtonProps = ComponentProps<typeof Pressable> & { title: string; style?: StyleProp<ViewStyle> };

export const Button = ({ title, style, disabled, ...rest }: ButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && { opacity: 0.7 },
        disabled && { opacity: 0.7, backgroundColor: "gray" },
        style,
      ]}
      disabled={disabled}
      {...rest}
    >
      <ThemedText style={styles.text}>{title}</ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2095f3",
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    height: 48,
    flex: 1,
  },
  text: {
    fontWeight: 700,
  },
});
