import { Text } from "@/components/Text";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { View } from "@/components/View";
import { guidesCollection } from "@/app/(tabs)/home/guides/data";
import { ScrollView } from "react-native";
import { Collapsible } from "@/components/Collapsible";
import { Button } from "@/components/Button";

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
          <Text>Guide no: {id}</Text>
          {/*<Text>{JSON.stringify(guide, null, 2)}</Text>*/}
          {guide.variant.map((variant) => {
            const { timeInMinutes, temperatureCelsius } = variant.cookerState;
            return (
              <Collapsible key={variant.name} title={variant.name}>
                <Text>{JSON.stringify(variant, null, 2)}</Text>
                <Link href={{ pathname: `/device`, params: { timeInMinutes, temperatureCelsius } }} asChild>
                  <Button style={{ height: 38, width: 120 }}>Cook it</Button>
                </Link>
              </Collapsible>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
}
