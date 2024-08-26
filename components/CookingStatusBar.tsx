import { View } from "@/components/View";
import { Text } from "@/components/Text";
import { AnovaService } from "@/services/AnovaService";
import { useCookingStateStore } from "@/stores/cookingStore";

export const CookingStatusBar = () => {
  const { cookingState } = useCookingStateStore();

  if (["start", "running"].includes(cookingState.status ?? "")) {
    return (
      <View style={{ backgroundColor: "#4BB543", padding: 5, flexDirection: "row", justifyContent: "center", gap: 10 }}>
        <Text style={{ color: "white" }}>
          🌡️ {cookingState.temperature}°C / {cookingState.targetTemperature}°C
        </Text>
        <Text style={{ color: "white" }}>🕒 {AnovaService.displayCookingTime(cookingState.timer ?? "0")}</Text>
      </View>
    );
  }

  return null;
};
