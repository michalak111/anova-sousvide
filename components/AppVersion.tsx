import * as Updates from "expo-updates";
import { Text } from "@/components/Text";
import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

export const AppVersion = () => {
  const backgroundColor = useThemeColor({}, "background");

  return (
    <Text
      style={{ position: "relative", bottom: 0, marginTop: "auto", textAlign: "center", fontSize: 10, backgroundColor }}
    >
      {`${Updates.runtimeVersion}.${Updates.updateId?.split("-")[0] ?? 0}`}
    </Text>
  );
};
