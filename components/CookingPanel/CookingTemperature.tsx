import { View } from "@/components/View";
import { Text } from "@/components/Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

type Props = { current: string; target: string };

export const CookingTemperature = ({ current, target }: Props) => {
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.tempCol}>
          <Text style={styles.textCurrent}>{current}</Text>
          <CelciusIcon />
        </View>
        <Text style={[styles.textDescription, { marginRight: 20 }]}>Current{"\n"}temperature</Text>
      </View>

      <View style={{ height: "50%", marginTop: 20 }}>
        <View style={styles.tempCol}>
          <Text style={styles.textTarget}>/ {target}</Text>
          <CelciusIcon />
        </View>
        <Text style={[styles.textDescription, { marginTop: 20 }]}>Target{"\n"}temperature</Text>
      </View>
    </View>
  );
};

const CelciusIcon = () => {
  const color = useThemeColor({}, "text");
  return <MaterialCommunityIcons name="temperature-celsius" size={24} color={color} />;
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  tempCol: {
    display: "flex",
    flexDirection: "row",
  },
  textCurrent: {
    fontSize: 80,
    fontWeight: "bold",
    lineHeight: 80,
  },
  textTarget: {
    fontSize: 40,
    fontWeight: "bold",
    lineHeight: 40,
  },
  textDescription: {
    fontSize: 14,
    lineHeight: 14,
    textAlign: "center",
  },
});
