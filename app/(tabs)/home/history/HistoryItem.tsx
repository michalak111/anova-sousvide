import { Text } from "@/components/Text";
import { View } from "@/components/View";
import { AnovaService } from "@/services/AnovaService";
import { ButtonIcon } from "@/components/ButtonIcon";
import { router } from "expo-router";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { HistoryEvent } from "@/stores/historyStore";

type Props = {
  data: HistoryEvent;
  remove: (id: HistoryEvent["id"]) => void;
};

export const HistoryItem = ({ data, remove }: Props) => {
  const border = useThemeColor({}, "border");
  const {
    id,
    time,
    cookParams: { timeInMinutes, temperatureCelsius },
  } = data;

  return (
    <View style={[styles.container, { borderColor: border }]} testID="HistoryItem">
      <Text>
        <Text style={[styles.dateText]}>Cooked: </Text>
        <Text style={[styles.dateText, { color: "gray" }]}>
          {new Intl.DateTimeFormat(undefined, {
            timeStyle: "medium",
            dateStyle: "short",
          }).format(time)}
        </Text>
      </Text>
      <View style={styles.content}>
        <View>
          <Text>🌡️ {temperatureCelsius}°C</Text>
          <Text>🕒 {AnovaService.displayCookingTime(timeInMinutes)}</Text>
        </View>

        <View style={[styles.actions]}>
          <ButtonIcon
            onPress={() => router.navigate({ pathname: `/device`, params: { timeInMinutes, temperatureCelsius } })}
            testID="cook-history-item"
          >
            <MaterialCommunityIcons name="pot-steam" size={24} color="black" />
          </ButtonIcon>
          <ButtonIcon background={"#cc0000"} onPress={() => remove(id)} testID="remove-history-item">
            <FontAwesome name="trash" size={24} color="black" />
          </ButtonIcon>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
  },
  actions: {
    marginLeft: "auto",
    flexDirection: "row",
    gap: 6,
  },
  dateText: {
    fontSize: 12,
  },
});
