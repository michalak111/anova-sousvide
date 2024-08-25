import { View } from "@/components/View";
import { Text } from "@/components/Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = { current: string; target: string };

export const CookingTemperature = ({ current, target }: Props) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        padding: 0,
      }}
    >
      <View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 80, fontWeight: "bold", lineHeight: 80 }}>{current}</Text>
          <MaterialCommunityIcons name="temperature-celsius" size={24} color="black" />
        </View>
        <Text style={{ fontSize: 14, lineHeight: 14, textAlign: "center", marginRight: 20 }}>
          Current{"\n"}temperature
        </Text>
      </View>
      <View style={{ height: "50%", marginTop: 20 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 40, fontWeight: "bold", lineHeight: 40 }}>/ {target}</Text>
          <MaterialCommunityIcons name="temperature-celsius" size={24} color="black" />
        </View>
        <Text style={{ fontSize: 14, lineHeight: 14, textAlign: "center", marginTop: 20 }}>
          Target{"\n"}temperature
        </Text>
      </View>
    </View>
  );
};
