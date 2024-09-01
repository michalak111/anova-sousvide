import { AnovaService } from "@/services/AnovaService";
import { CookingTemperature } from "@/components/CookingPanel/CookingTemperature";
import { CookingTimer } from "@/components/CookingPanel/CookingTimer";
import { View } from "@/components/View";
import { CookingPannelButton } from "@/components/CookingPanel/CookingPannelButton";
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
          <CookingPannelButton onPress={onTempClick} accessibilityLabel="Set temperature">
            <FontAwesome6 name="temperature-half" size={24} color="black" />
          </CookingPannelButton>
          {["stop", "stopped", "low water"].includes(state.status ?? "") ? (
            <CookingPannelButton size={80} onPress={onStartClick} accessibilityLabel="Start">
              <FontAwesome5 name="play" size={24} color="black" />
            </CookingPannelButton>
          ) : (
            <CookingPannelButton size={80} onPress={onStopClick} accessibilityLabel="Stop">
              <FontAwesome5 name="stop" size={24} color="black" />
            </CookingPannelButton>
          )}
          <CookingPannelButton onPress={onTimerClick} accessibilityLabel="Set time">
            <FontAwesome6 name="clock" size={24} color="black" />
          </CookingPannelButton>
        </View>
      ) : null}
    </>
  );
};
