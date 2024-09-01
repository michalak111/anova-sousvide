import { ComponentProps, ComponentRef, forwardRef } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pressable } from "react-native";

type Props = ComponentProps<typeof Pressable> & {
  background?: string;
};

export const ButtonIcon = forwardRef<ComponentRef<typeof Pressable>, Props>(
  ({ background, children, ...rest }, ref) => {
    const colorMain = useThemeColor({}, "main");
    return (
      <Pressable
        ref={ref}
        style={({ pressed }) => [
          {
            backgroundColor: background || colorMain,
            height: 36,
            width: 36,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
          },
          pressed && { opacity: 0.8 },
        ]}
        {...rest}
      >
        {children}
      </Pressable>
    );
  },
);

ButtonIcon.displayName = "PressableIcon";
