import { AnovaService } from "@/services/AnovaService";
import { CookingTemperature } from "@/components/CookingPanel/CookingTemperature";
import { CookingTimer } from "@/components/CookingPanel/CookingTimer";
import { View } from "@/components/View";
import { ButtonIcon } from "@/components/ButtonIcon";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import React from "react";

type Props = {
  state: Partial<AnovaService.CookingState>;
  onStartClick: () => void;
  onStopClick: () => void;
  onTempClick: () => void;
  onTimerClick: () => void;
};

export const CookingPanel = ({ state, onStartClick, onStopClick, onTimerClick, onTempClick }: Props) => {
  return (
    <>
      {state.temperature && state.targetTemperature ? (
        <CookingTemperature current={state.temperature} target={state.targetTemperature} />
      ) : null}
      {state.timer ? <CookingTimer timer={state.timer} timerSet={state.timerSet} /> : null}
      {state.status ? (
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            gap: 30,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ButtonIcon onPress={onTempClick}>
            <FontAwesome6 name="temperature-half" size={24} color="black" />
          </ButtonIcon>
          {["stop", "stopped", "low water"].includes(state.status ?? "") ? (
            <ButtonIcon size={80} onPress={onStartClick}>
              <FontAwesome5 name="play" size={24} color="black" />
            </ButtonIcon>
          ) : (
            <ButtonIcon size={80} onPress={onStopClick}>
              <FontAwesome5 name="stop" size={24} color="black" />
            </ButtonIcon>
          )}
          <ButtonIcon onPress={onTimerClick}>
            <FontAwesome6 name="clock" size={24} color="black" />
          </ButtonIcon>
        </View>
      ) : null}
    </>
  );
};
