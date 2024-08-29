import React, { ComponentProps, ComponentRef, forwardRef } from "react";
import { Text } from "@/components/Text";
import { Pressable, StyleProp, ViewStyle, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

type Props = ComponentProps<typeof Pressable> & {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  variant?: "default" | "outline";
};

export const Button = forwardRef<ComponentRef<typeof Pressable>, Props>(
  ({ style, disabled, children, variant = "default", ...rest }, ref) => {
    const colorText = useThemeColor({}, "text");
    const colorMain = useThemeColor({}, "main");
    const colorBg = useThemeColor({}, "background");

    return (
      <Pressable
        ref={ref}
        style={({ pressed }) => [
          styles.button,
          { borderColor: colorMain },
          disabled && { opacity: 0.7, backgroundColor: "gray" },

          variant === "default" && { backgroundColor: colorMain },
          pressed && { opacity: 0.7 },

          variant === "outline" && { backgroundColor: colorBg },
          variant === "outline" && pressed && { backgroundColor: colorMain },

          style,
        ]}
        disabled={disabled}
        {...rest}
      >
        <Text style={[styles.text, { color: colorText }]}>{children}</Text>
      </Pressable>
    );
  },
);

Button.displayName = "Button";

const styles = StyleSheet.create({
  button: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    height: 48,
    flex: 1,
    borderWidth: 2,
    elevation: 1,
  },
  text: {
    fontWeight: 700,
  },
});
