import { Text } from "@/components/Text";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { View } from "@/components/View";
import { guidesCollection } from "@/app/(tabs)/home/guides/data";
import { ScrollView } from "react-native";
import { Collapsible } from "@/components/Collapsible";
import { Button } from "@/components/Button";
import { AnovaService } from "@/services/AnovaService";

export default function GuidePage({ ...props }) {
  const { id } = useLocalSearchParams();
  const guide = guidesCollection.find((guide) => guide.id === id);

  if (!guide) {
    return (
      <View>
        <Text>Not found</Text>
        <Link href="/">Home</Link>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: guide.title }} />
      <ScrollView>
        <View style={{ padding: 16 }}>
          <Text type="subtitle">Cooking variants</Text>
          <View style={{ marginTop: 20, gap: 8 }}>
            {guide.variants.map((variant) => {
              const { timeInMinutes, temperatureCelsius } = variant.cookParams;
              return (
                <Collapsible key={variant.name} title={variant.name}>
                  <View
                    style={{ gap: 6, flexDirection: "row", flexWrap: "wrap", alignItems: "center", marginBottom: 20 }}
                  >
                    <View>
                      <Text>
                        Temperature: <Text style={{ fontWeight: 600 }}>{variant.cookParams.temperatureCelsius}°C</Text>
                      </Text>
                      <Text>
                        Time:{" "}
                        <Text style={{ fontWeight: 600 }}>
                          {AnovaService.displayCookingTime(variant.cookParams.timeInMinutes)}
                        </Text>
                      </Text>
                    </View>
                    <Link href={{ pathname: `/device`, params: { timeInMinutes, temperatureCelsius } }} asChild>
                      <Button style={{ height: 38, width: 120, flex: 0, marginLeft: "auto" }}>Cook it</Button>
                    </Link>
                  </View>
                </Collapsible>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
