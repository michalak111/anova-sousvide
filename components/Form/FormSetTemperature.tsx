import { View } from "@/components/View";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useState } from "react";
import { Text } from "@/components/Text";

// TODO - improve validaton

type Props = {
  initialValue?: string;
};

export const FormSetTemperature = ({ initialValue }: Props) => {
  const [value, setValue] = useState(initialValue);
  return (
    <View style={{ gap: 10 }}>
      <Text type="defaultSemiBold">Cooking temperature</Text>
      <Input
        value={value}
        inputMode={"decimal"}
        maxLength={4}
        onBlur={(e) => {
          setValue((text) => {
            if (Number(text) < 5) {
              return String(5);
            }

            if (Number(text) > 99.9) {
              return String(99.9);
            }
            return text;
          });
        }}
        onChangeText={(val) => {
          setValue(val);
        }}
      />

      <Button
        // disabled={!inputTemp}
        onPress={async () => {
          // await sendCommand("set_target_temp", AnovaService.commands["set_target_temp"](Number(inputTemp)));
        }}
      >
        Save
      </Button>
    </View>
  );
};
