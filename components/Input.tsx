import React, { ComponentProps } from "react";
import { StyleProp, ViewStyle, StyleSheet, TextInput } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

type Props = ComponentProps<typeof TextInput> & { style?: StyleProp<ViewStyle> };

export const Input = ({ style, ...rest }: Props) => {
  const color = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "main");
  const backgroundColor = useThemeColor({}, "background");

  return <TextInput style={[styles.input, { color, borderColor, backgroundColor }, style]} {...rest} />;
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderRadius: 12,
    flex: 1,
    height: 48,
    padding: 12,
    elevation: 1,
  },
});
