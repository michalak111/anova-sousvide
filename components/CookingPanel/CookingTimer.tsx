import { View } from "@/components/View";
import { Text } from "@/components/Text";
import { AnovaService } from "@/services/AnovaService";
import { selectCookingTime } from "@/stores/cookingStore";

type Props = {
  timer: string;
  timerSet?: string;
};

export const CookingTimer = ({ timer, timerSet }: Props) => {
  const time = selectCookingTime({ timer, timerSet });
  return (
    <View style={{ marginTop: 30, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 48, lineHeight: 50, fontWeight: 600 }}>{AnovaService.displayCookingTime(time)}</Text>
      <Text>Time Left</Text>
    </View>
  );
};
