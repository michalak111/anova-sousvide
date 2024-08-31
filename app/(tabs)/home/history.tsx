import { View } from "@/components/View";
import { Text } from "@/components/Text";
import { useHistoryStore } from "@/stores/historyStore";
import { AnovaService } from "@/services/AnovaService";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ComponentProps, ComponentRef, forwardRef } from "react";
import { router } from "expo-router";

export default function HistoryPage() {
  const { history, remove } = useHistoryStore();

  return (
    <View style={{ padding: 16, gap: 16 }}>
      {history.map((item) => {
        const {
          cookParams: { timeInMinutes, temperatureCelsius },
        } = item;
        return (
          <View
            key={item.id}
            style={{ borderWidth: 1, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 5, elevation: 2 }}
          >
            <Text>
              <Text style={{ fontSize: 12 }}>Cooked: </Text>
              <Text style={{ fontSize: 12, color: "gray" }}>
                {new Intl.DateTimeFormat(undefined, {
                  timeStyle: "medium",
                  dateStyle: "short",
                }).format(item.time)}
              </Text>
            </Text>
            <View style={{ flexDirection: "row" }}>
              <View style={{ marginBottom: 4 }}>
                <Text>🌡️ {temperatureCelsius}°C</Text>
                <Text>🕒 {AnovaService.displayCookingTime(timeInMinutes)}</Text>
              </View>

              <View style={{ marginLeft: "auto", flexDirection: "row", gap: 6 }}>
                <PressableIcon
                  onPress={() =>
                    router.navigate({ pathname: `/device`, params: { timeInMinutes, temperatureCelsius } })
                  }
                >
                  <MaterialCommunityIcons name="pot-steam" size={24} color="black" />
                </PressableIcon>
                <PressableIcon background={"#cc0000"} onPress={() => remove(item.id)}>
                  <FontAwesome name="trash" size={24} color="black" />
                </PressableIcon>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

type PressableIconProps = ComponentProps<typeof Pressable> & {
  background?: string;
};

const PressableIcon = forwardRef<ComponentRef<typeof Pressable>, PressableIconProps>(
  ({ background, children, ...rest }, ref) => {
    const colorMain = useThemeColor({}, "main");
    return (
      <Pressable
        ref={ref}
        style={({ pressed }) => [
          {
            backgroundColor: background || colorMain,
            height: 36,
            width: 36,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
          },
          pressed && { opacity: 0.8 },
        ]}
        {...rest}
      >
        {children}
      </Pressable>
    );
  },
);

PressableIcon.displayName = "PressableIcon";
