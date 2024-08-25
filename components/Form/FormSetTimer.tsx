import { View } from "@/components/View";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useState } from "react";
import { Text } from "@/components/Text";
import { displayCookingTime } from "@/services/AnovaService";
import { Keyboard } from "react-native";

// TODO - implement input mask, so user types time in hh:mm format
// TODO - improve validaton

type Props<V = string> = {
  initialValue?: V;
  onSave: (value: V) => void;
};

export const FormSetTimer = ({ initialValue, onSave }: Props) => {
  const [value, setValue] = useState(initialValue ?? "");
  const validate = (val: string) => {
    if (Number(val) < 0) {
      return String(0);
    }

    if (Number(val) > 6000) {
      return String(6000);
    }
    return val;
  };

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
              return validate(text);
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
          onPress={() => {
            Keyboard.dismiss();
            onSave(validate(value));
          }}
        >
          Save
        </Button>
      </View>
    </View>
  );
};
