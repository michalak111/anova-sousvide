import { View as RNView, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ComponentRef, forwardRef } from "react";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export const View = forwardRef<ComponentRef<typeof RNView>, ThemedViewProps>(
  ({ style, lightColor, darkColor, ...otherProps }, ref) => {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

    return <RNView ref={ref} style={[{ backgroundColor }, style]} {...otherProps} />;
  },
);

View.displayName = "View";
