import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = { current: string; target: string };

export const DisplayTemperature = ({ current, target }: Props) => {
  return (
    <ThemedView
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        padding: 0,
      }}
    >
      <ThemedView>
        <ThemedView
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <ThemedText style={{ fontSize: 80, fontWeight: "bold", lineHeight: 80 }}>{current}</ThemedText>
          <MaterialCommunityIcons name="temperature-celsius" size={24} color="black" />
        </ThemedView>
        <ThemedText style={{ fontSize: 14, lineHeight: 14, textAlign: "center", marginRight: 20 }}>
          Current{"\n"}temperature
        </ThemedText>
      </ThemedView>
      <ThemedView style={{ height: "50%", marginTop: 20 }}>
        <ThemedView
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <ThemedText style={{ fontSize: 40, fontWeight: "bold", lineHeight: 40 }}>/ {target}</ThemedText>
          <MaterialCommunityIcons name="temperature-celsius" size={24} color="black" />
        </ThemedView>
        <ThemedText style={{ fontSize: 14, lineHeight: 14, textAlign: "center", marginTop: 20 }}>
          Target{"\n"}temperature
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};
