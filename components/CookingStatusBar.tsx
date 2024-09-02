import { View } from "@/components/View";
import { Text } from "@/components/Text";
import { AnovaService } from "@/services/AnovaService";
import { useCookingStateStore } from "@/stores/cookingStore";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const CookingStatusBar = () => {
  const insets = useSafeAreaInsets();
  const { cookingState } = useCookingStateStore();

  if (["start", "running"].includes(cookingState.status ?? "")) {
    return (
      <View style={[styles.container, { marginTop: insets.top }]}>
        <Text style={styles.text}>
          🌡️ {cookingState.temperature}°C / {cookingState.targetTemperature}°C
        </Text>
        <Text style={styles.text}>🕒 {AnovaService.displayCookingTime(cookingState.timer ?? "0")}</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4BB543",
    padding: 5,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  text: {
    color: "white",
  },
});
