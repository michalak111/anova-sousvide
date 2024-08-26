import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Text } from "@/components/Text";
import { View } from "@/components/View";
import { BLEService } from "@/services/BLEService";
import React, { ComponentProps, useEffect, useRef, useState } from "react";
import { Characteristic, Device, Subscription } from "react-native-ble-plx";
import { AnovaService } from "@/services/AnovaService";
import { noop, sleep } from "@/lib/utils";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { ButtonIcon } from "@/components/ButtonIcon";
import { CookingTemperature } from "@/components/CookingPanel/CookingTemperature";
import { CookingTimer } from "@/components/CookingPanel/CookingTimer";
import { BottomDrawer } from "@/components/BottomDrawer";
import { Button } from "@/components/Button";
import { FormSetTemperature } from "@/components/Form/FormSetTemperature";
import { FormSetTimer } from "@/components/Form/FormSetTimer";

/**
 * TODO - sometimes scanning not working after app reload, needs to be killed
 * TODO - implement initial connection with loader, after timeout show troubleshooting instructions
 * TODO - update timer input from events
 */

type CookingState = {
  temperature: string;
  targetTemperature: string;
  status: "start" | "stop" | "stopped" | "running";
  timer: string;
};

export default function DeviceTab() {
  const [device, setDevice] = useState<Device>();
  const [characteristic, setCharacteristic] = useState<Characteristic>();
  const commandRef = useRef<{ id: string; key: AnovaService.CommandKey }>();
  const [state, setState] = useState<Partial<CookingState>>({});
  const [tempModalVal, setTempModalVal] = useState<string | null>("");
  const [timerModalVal, setTimerModalVal] = useState<string | null>("");

  async function scanForDevice() {
    logger("init scanning");
    return BLEService.scanDevices(
      async (device) => {
        if (AnovaService.validateDeviceName(device)) {
          await connectToDevice(device.id);
        }
      },
      [AnovaService.DEVICE_SERVICE_UUID],
    );
  }

  async function connectToDevice(id: string) {
    const device = await BLEService.connectToDevice(id);
    setDevice(device);
    AnovaService.storeDeviceId(device.id);
    logger("connected to device", device);
  }

  async function findCharacteistic() {
    await BLEService.discoverAllServicesAndCharacteristicsForDevice();
    const services = (await BLEService.getServicesForDevice()) || [];
    const expectedService = AnovaService.findService(services);
    if (!expectedService) {
      throw new Error("Service not found");
    }

    const characteristics = (await BLEService.getCharacteristicsForDevice(expectedService.uuid)) || [];
    const expectedCharacteristic = AnovaService.findCharacteristics(characteristics);
    if (!expectedCharacteristic) {
      throw new Error("Characteristic not found");
    }

    setCharacteristic(expectedCharacteristic);
  }

  async function sendCommand(key: AnovaService.CommandKey, value: string) {
    try {
      await sleep();
      const id = Date.now().toString();
      await characteristic?.writeWithResponse(AnovaService.encodeCmd(value), id);
      logger("command", id, key, value);
      commandRef.current = { id, key };
      // await new Promise<void>((resolve) => {
      //   const subscription = characteristic?.monitor((device, characteristic) => {
      //     logger("command monitor", id, characteristic?.value && decode(characteristic.value));
      //     subscription?.remove();
      //     resolve();
      //   }, id);
      // });
    } catch (e) {
      logger("command err", e);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const isConnected = await BLEService.isDeviceConnected().catch(noop);

        if (isConnected) {
          const device = BLEService.getDevice();
          device && setDevice(device);
          return;
        }

        const restoredDevice = AnovaService.restoreDeviceId();
        if (restoredDevice) {
          await connectToDevice(restoredDevice).catch(() => {
            logger("could not connect to restored device");
          });
        }
      } catch (e) {
        void AnovaService.forgetDeviceId();
        await scanForDevice();
      } finally {
        logger("init completed");
      }
    })();
  }, []);

  useEffect(
    function listenForDeviceConenction() {
      let subscription: Subscription | null;
      if (device) {
        void findCharacteistic().catch(noop);
        subscription = BLEService.onDeviceDisconnected((error, device) => {
          logger("disconnected", error, device);
          // device?.connect();
          BLEService.isDeviceConnected().catch(() => {
            setDevice(undefined);
            setCharacteristic(undefined);
          });
        });
      }

      return () => {
        subscription?.remove();
      };
    },
    [device],
  );

  useEffect(
    function monitorStatus() {
      const fetchDeviceData = async () => {
        await sendCommand("read_status", AnovaService.commands["read_status"]());
        await sendCommand("read_temp", AnovaService.commands["read_temp"]());
        await sendCommand("read_target_temp", AnovaService.commands["read_target_temp"]());
        await sendCommand("read_timer", AnovaService.commands["read_timer"]());
      };
      let interval: NodeJS.Timeout | null;

      if (characteristic) {
        interval = setInterval(async () => {
          void fetchDeviceData();
        }, 10 * 1000);

        void fetchDeviceData();
      }
      return () => {
        interval && clearInterval(interval);
      };
    },
    [characteristic],
  );

  useEffect(
    function monitorCharacteristics() {
      let subscription: Subscription | null;
      if (characteristic) {
        logger("characteristic monitoring");
        subscription = characteristic.monitor((error, characteristic, ...rest) => {
          logger("monitor logger", error, characteristic, ...rest);
          if (characteristic?.value) {
            const decodedVal = AnovaService.decodeCmd(characteristic.value);
            logger("monitor value", decodedVal, characteristic);
            const command = commandRef.current || { key: "" };

            commandRef.current = undefined;

            switch (command.key) {
              case "read_temp": {
                setState((details) => ({ ...details, temperature: decodedVal }));
                break;
              }
              case "read_timer": {
                setState((details) => ({ ...details, timer: decodedVal }));
                break;
              }
              case "set_target_temp":
              case "read_target_temp": {
                setState((details) => ({ ...details, targetTemperature: decodedVal }));
                break;
              }
              case "read_status":
              case "start":
              case "stop": {
                setState((details) => ({ ...details, status: decodedVal as "start" | "stop" }));
                break;
              }
            }
          }
        });
      }

      return () => {
        subscription?.remove();
      };
    },
    [characteristic, commandRef],
  );

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        headerImage={<Ionicons size={310} name="fast-food" style={styles.headerImage} />}
      >
        <View>
          {Object.keys(state).length === 4 ? (
            <>
              {state.temperature && state.targetTemperature ? (
                <CookingTemperature current={state.temperature} target={state.targetTemperature} />
              ) : null}
              {state.timer ? <CookingTimer timer={state.timer} /> : null}
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
                  <ButtonIcon onPress={() => setTempModalVal((o) => (o ? null : (state.temperature ?? "0")))}>
                    <FontAwesome6 name="temperature-half" size={24} color="black" />
                  </ButtonIcon>
                  {["stop", "stopped"].includes(state.status ?? "") ? (
                    <ButtonIcon
                      size={80}
                      onPress={async () => {
                        await sendCommand("start_time", AnovaService.commands["start_time"]());
                        await sendCommand("start", AnovaService.commands["start"]());
                        await sendCommand("read_status", AnovaService.commands["read_status"]());
                      }}
                    >
                      <FontAwesome5 name="play" size={24} color="black" />
                    </ButtonIcon>
                  ) : (
                    <ButtonIcon
                      size={80}
                      onPress={async () => {
                        await sendCommand("stop_time", AnovaService.commands["stop_time"]());
                        await sendCommand("stop", AnovaService.commands["stop"]());
                        await sendCommand("read_status", AnovaService.commands["read_status"]());
                      }}
                    >
                      <FontAwesome5 name="stop" size={24} color="black" />
                    </ButtonIcon>
                  )}
                  <ButtonIcon
                    onPress={() =>
                      setTimerModalVal((o) => (o ? null : String(AnovaService.timerToMinutes(state.timer ?? "0"))))
                    }
                  >
                    <FontAwesome6 name="clock" size={24} color="black" />
                  </ButtonIcon>
                </View>
              ) : null}
            </>
          ) : (
            <Text>Loading</Text>
          )}
        </View>
      </ParallaxScrollView>
      <FormModal opened={!!tempModalVal} onClose={() => setTempModalVal(null)}>
        <FormSetTemperature
          initialValue={tempModalVal ?? ""}
          onSave={async (value) => {
            await sendCommand("set_target_temp", AnovaService.commands["set_target_temp"](Number(value)));
            setTempModalVal(null);
          }}
        />
      </FormModal>
      <FormModal opened={!!timerModalVal} onClose={() => setTimerModalVal(null)}>
        <FormSetTimer
          initialValue={timerModalVal ?? ""}
          onSave={async (value) => {
            await sendCommand("set_timer", AnovaService.commands["set_timer"](Number(value)));
            setTimerModalVal(null);
          }}
        />
      </FormModal>
    </>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
});

const logger = (...args: unknown[]) => {
  // console.logger("DEVICE::", ...args);
};

type FormModalProps = ComponentProps<typeof BottomDrawer> & {
  onClose: () => void;
};

const FormModal = ({ children, onClose, ...rest }: FormModalProps) => {
  return (
    <BottomDrawer {...rest}>
      {children}
      <Button variant="outline" style={{ marginTop: 10 }} onPress={onClose}>
        Cancel
      </Button>
    </BottomDrawer>
  );
};
