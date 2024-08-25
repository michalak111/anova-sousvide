import { View } from "@/components/View";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useState } from "react";
import { Text } from "@/components/Text";
import { displayCookingTime } from "@/services/AnovaService";

// TODO - implement input mask, so user types time in hh:mm format
// TODO - improve validaton

type Props = {
  initialValue?: string;
};

export const FormSetTimer = ({ initialValue }: Props) => {
  const [value, setValue] = useState(initialValue);
  return (
    <View style={{ gap: 10 }}>
      <Text type="defaultSemiBold">Cooking time</Text>
      <View style={{ flexDirection: "row" }}>
        <Input
          value={value}
          inputMode={"numeric"}
          maxLength={4}
          onBlur={() => {
            setValue((text) => {
              if (Number(text) < 0) {
                return String(0);
              }

              if (Number(text) > 6000) {
                return String(6000);
              }
              return text;
            });
          }}
          onChangeText={(val) => {
            setValue(val);
          }}
        />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text type="subtitle">{value ? displayCookingTime(value) : "0h 00m"}</Text>
        </View>
      </View>
      <View>
        <Button
          onPress={async () => {
            // await sendCommand("set_target_temp", AnovaService.commands["set_target_temp"](Number(inputTemp)));
          }}
        >
          Save
        </Button>
      </View>
    </View>
  );
};
