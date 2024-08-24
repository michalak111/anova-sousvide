import React, { ComponentProps } from "react";
import { StyleProp, ViewStyle, StyleSheet, TextInput } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

type Props = ComponentProps<typeof TextInput> & { style?: StyleProp<ViewStyle> };

export const Input = ({ style, ...rest }: Props) => {
  const color = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "main");

  return <TextInput style={[styles.input, { color, borderColor }, style]} {...rest} />;
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 12,
    flex: 1,
    height: 48,
    padding: 12,
  },
});
