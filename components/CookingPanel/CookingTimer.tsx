import { View } from "@/components/View";
import { Text } from "@/components/Text";
import { AnovaService } from "@/services/AnovaService";

type Props = {
  timer: string;
};

export const CookingTimer = ({ timer }: Props) => {
  return (
    <View style={{ marginTop: 30, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 48, lineHeight: 50, fontWeight: 600 }}>{AnovaService.displayCookingTime(timer)}</Text>
      <Text>Time Left</Text>
    </View>
  );
};
