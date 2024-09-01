import { Text } from "@/components/Text";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { View } from "@/components/View";
import { guidesCollection } from "@/app/(tabs)/home/guides/data";
import { ScrollView, StyleSheet } from "react-native";
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
        <View style={styles.conainer}>
          <Text type="subtitle">Cooking variants</Text>
          <View style={styles.listContainer}>
            {guide.variants.map((variant) => {
              const { timeInMinutes, temperatureCelsius } = variant.cookParams;
              return (
                <Collapsible key={variant.name} title={variant.name}>
                  <View style={styles.content}>
                    <View>
                      <Text>
                        Temperature: <Text style={styles.text}>{variant.cookParams.temperatureCelsius}°C</Text>
                      </Text>
                      <Text>
                        Time:{" "}
                        <Text style={styles.text}>
                          {AnovaService.displayCookingTime(variant.cookParams.timeInMinutes)}
                        </Text>
                      </Text>
                    </View>
                    <Link href={{ pathname: `/device`, params: { timeInMinutes, temperatureCelsius } }} asChild>
                      <Button style={styles.button}>Cook it</Button>
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

const styles = StyleSheet.create({
  conainer: {
    padding: 16,
  },
  listContainer: {
    marginTop: 20,
    gap: 8,
  },
  content: {
    gap: 6,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 20,
  },
  text: {
    fontWeight: 600,
  },
  button: {
    height: 38,
    width: 120,
    flex: 0,
    marginLeft: "auto",
  },
});
