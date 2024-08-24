import React, { ComponentProps } from "react";
import { ThemedText } from "@/components/ThemedText";
import { Pressable, StyleProp, ViewStyle, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

type Props = ComponentProps<typeof Pressable> & { style?: StyleProp<ViewStyle>; children: React.ReactNode };

export const Button = ({ style, disabled, children, ...rest }: Props) => {
  const color = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "main");
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor },
        pressed && { opacity: 0.7 },
        disabled && { opacity: 0.7, backgroundColor: "gray" },
        style,
      ]}
      disabled={disabled}
      {...rest}
    >
      <ThemedText style={[styles.text, { color }]}>{children}</ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
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
