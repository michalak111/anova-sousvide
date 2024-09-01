import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityIndicator, StyleSheet } from "react-native";

import { ParallaxScrollView } from "@/components/ParallaxScrollView";
import { Text } from "@/components/Text";
import { View } from "@/components/View";
import { BLEService } from "@/services/BLEService";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Characteristic, Device, Subscription } from "react-native-ble-plx";
import { AnovaService } from "@/services/AnovaService";
import { noop, sleep } from "@/lib/utils";
import { Button } from "@/components/Button";
import { FormSetTemperature } from "@/components/Form/FormSetTemperature";
import { FormSetTimer } from "@/components/Form/FormSetTimer";
import { CookingPanel } from "@/components/CookingPanel/CookingPanel";
import { FormModal } from "@/components/Form/FormModal";
import { selectCookingTime, useCookingStateStore } from "@/stores/cookingStore";
import { router, useLocalSearchParams } from "expo-router";
import { useHistoryStore } from "@/stores/historyStore";

export default function DeviceTab() {
  const { timeInMinutes: queryTime, temperatureCelsius: queryTemperature } = useLocalSearchParams<{
    timeInMinutes: string;
    temperatureCelsius: string;
  }>();
  const [isScanning, setIsScanning] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [device, setDevice] = useState<Device>();
  const [characteristic, setCharacteristic] = useState<Characteristic>();
  const commandRef = useRef<{ id: string; key: AnovaService.CommandKey }>();
  const { cookingState: state, update: updateState } = useCookingStateStore();
  const cookingTime = selectCookingTime(state);
  const [tempModalVal, setTempModalVal] = useState<string | null>("");
  const [timerModalVal, setTimerModalVal] = useState<string | null>("");
  const saveInHistory = useHistoryStore((state) => state.add);

  const deviceConnected = useMemo(() => {
    const connectionEstablished = device && characteristic;
    const stateLoaded = Object.values(state).every(Boolean);

    return !isScanning && !connectionError && connectionEstablished && stateLoaded;
  }, [isScanning, connectionError, device, characteristic, state]);

  const scanForDevice = useCallback(async () => {
    logger("init scanning");
    setIsScanning(true);

    const timeout = setTimeout(() => {
      setConnectionError(true);
      setIsScanning(false);
      BLEService.manager.stopDeviceScan();
    }, 30 * 1000);

    await BLEService.scanDevices(
      async (device) => {
        if (AnovaService.validateDeviceName(device)) {
          await connectToDevice(device.id);
          setConnectionError(false);
          setIsScanning(false);
          clearTimeout(timeout);
        }
      },
      [AnovaService.DEVICE_SERVICE_UUID],
    );
  }, []);

  async function connectToDevice(id: string) {
    const device = await BLEService.connectToDevice(id);
    setDevice(device);
    AnovaService.storeDeviceId(device.id);
    logger("connected to device", device);
    return device;
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

  const sendCommand = useCallback(
    async (key: AnovaService.CommandKey, value: string) => {
      try {
        await sleep();
        const id = Date.now().toString();
        await characteristic?.writeWithResponse(AnovaService.encodeCmd(value), id);
        logger("command", id, key, value);
        commandRef.current = { id, key };
      } catch (e) {
        logger("command err", e);
      }
    },
    [characteristic],
  );

  const cookRecipe = useCallback(
    async (time: string, temperature: string) => {
      await sendCommand("set_target_temp", AnovaService.commands["set_target_temp"](Number(temperature)));
      await sendCommand("set_timer", AnovaService.commands["set_timer"](Number(time)));
      await sendCommand("start_time", AnovaService.commands["start_time"]());
      await sendCommand("start", AnovaService.commands["start"]());
      await sendCommand("read_status", AnovaService.commands["read_status"]());
      saveInHistory({ cookParams: { temperatureCelsius: temperature, timeInMinutes: time } });
    },
    [sendCommand],
  );

  useEffect(
    function handleQueryParams() {
      if (queryTime && queryTemperature && deviceConnected) {
        cookRecipe(queryTime, queryTemperature).then(() => {
          router.setParams({ timeInMinutes: "", temperatureCelsius: "" });
        });
      }
    },
    [queryTime, queryTemperature, deviceConnected, cookRecipe],
  );

  useEffect(() => {
    (async () => {
      try {
        const isConnected = await BLEService.isDeviceConnected().catch(noop);
        const device = BLEService.getDevice();
        if (isConnected && device) {
          setDevice(device);
          return;
        }

        const deviceId = AnovaService.restoreDeviceId();
        const restoredDevice = deviceId
          ? await connectToDevice(deviceId).catch(() => {
              void AnovaService.forgetDeviceId();
              logger("could not connect to restored device");
              return null;
            })
          : null;
        if (restoredDevice) {
          return;
        }

        await scanForDevice();
      } catch (e) {
        setConnectionError(true);
        logger("could not connect to device", e);
      }
    })();
  }, [scanForDevice]);

  useEffect(
    function listenForDeviceConenction() {
      let subscription: Subscription | null;
      if (device) {
        void findCharacteistic().catch(noop);
        subscription = BLEService.onDeviceDisconnected(async (error, device) => {
          logger("disconnected", error, device);
          const isConnected = await BLEService.isDeviceConnected();
          if (!isConnected) {
            setConnectionError(true);
            setDevice(undefined);
            setCharacteristic(undefined);
          }
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
        }, 15 * 1000);

        void fetchDeviceData();
      }
      return () => {
        interval && clearInterval(interval);
      };
    },
    [characteristic, sendCommand],
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
                updateState("temperature", decodedVal);
                break;
              }
              case "read_timer": {
                updateState("timer", decodedVal);
                break;
              }
              case "set_target_temp":
              case "read_target_temp": {
                updateState("targetTemperature", decodedVal);
                break;
              }
              case "read_status":
              case "start":
              case "stop": {
                updateState("status", decodedVal);
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
    [characteristic, commandRef, updateState],
  );

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        headerImage={<Ionicons size={310} name="fast-food" style={styles.headerImage} />}
      >
        <View>
          {deviceConnected ? (
            <CookingPanel
              state={state}
              onStartClick={async () => {
                await sendCommand("start_time", AnovaService.commands["start_time"]());
                await sendCommand("start", AnovaService.commands["start"]());
                await sendCommand("read_status", AnovaService.commands["read_status"]());
                if (state.targetTemperature && cookingTime) {
                  saveInHistory({
                    cookParams: { temperatureCelsius: state.targetTemperature, timeInMinutes: cookingTime },
                  });
                }
              }}
              onStopClick={async () => {
                await sendCommand("stop_time", AnovaService.commands["stop_time"]());
                await sendCommand("stop", AnovaService.commands["stop"]());
                await sendCommand("read_status", AnovaService.commands["read_status"]());
              }}
              onTempClick={() => setTempModalVal((o) => (o ? null : (state.targetTemperature ?? "0")))}
              onTimerClick={() => {
                setTimerModalVal((o) => (o ? null : cookingTime));
              }}
            />
          ) : (
            <>
              {connectionError ? (
                <View>
                  <Text type="defaultSemiBold">Could not connect to the device, try to:</Text>
                  <Text>
                    {"\n"}- turn on/off anova device
                    {"\n"}- turn on/off bluetooth on your phone
                    {"\n"}- close/kill app, so its not running in the background and re-run
                  </Text>
                  <Button
                    style={{ marginTop: 20 }}
                    onPress={async () => {
                      try {
                        setConnectionError(false);
                        await scanForDevice();
                      } catch (e) {
                        setConnectionError(true);
                        logger(e);
                      }
                    }}
                  >
                    Retry connection
                  </Button>
                </View>
              ) : (
                <View style={{ gap: 20, justifyContent: "center" }}>
                  <ActivityIndicator size="large" />
                  <Text>Connecting to device. This might take a while.</Text>
                </View>
              )}
            </>
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
            updateState("timerSet", value);
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
  // console.log("DEVICE::", ...args);
};
