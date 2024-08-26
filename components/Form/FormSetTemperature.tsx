import { View } from "@/components/View";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useEffect, useState } from "react";
import { Text } from "@/components/Text";
import { Keyboard } from "react-native";

// TODO - improve validaton

type Props<V = string> = {
  initialValue?: V;
  onSave: (value: V) => void;
};

export const FormSetTemperature = ({ initialValue, onSave }: Props) => {
  const [value, setValue] = useState(initialValue ?? "");

  useEffect(() => {
    setValue(initialValue ?? "");
  }, [initialValue]);

  const validate = (val: string) => {
    if (Number(val) < 5) {
      return String(5);
    }

    if (Number(val) > 99.9) {
      return String(99.9);
    }
    return val;
  };

  return (
    <View style={{ gap: 10 }}>
      <Text type="defaultSemiBold">Cooking temperature</Text>
      <Input
        value={value}
        placeholder="Temperature in Celcius"
        inputMode={"decimal"}
        maxLength={4}
        onBlur={() => {
          setValue(validate);
        }}
        onChangeText={setValue}
      />

      <Button
        onPress={async () => {
          Keyboard.dismiss();
          onSave(validate(value));
        }}
      >
        Save
      </Button>
    </View>
  );
};
