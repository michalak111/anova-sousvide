import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Button } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BLEService } from "@/services/BLEService";
import { useEffect, useRef, useState } from "react";
import { Characteristic, Device, Subscription } from "react-native-ble-plx";
import { AnovaService } from "@/services/AnovaService";
import { noop, sleep } from "@/lib/utils";
import CommandKey = AnovaService.CommandKey;

// TODO scanning not working after app reload, needs to be killed

export default function TabTwoScreen() {
  const [device, setDevice] = useState<Device>();
  const [characteristic, setCharacteristic] = useState<Characteristic>();
  const [details, setDetails] = useState<
    Partial<{ temperature: string; targetTemperature: string; status: "idle" | "start" | "stop" }>
  >({});
  const [commands, setCommands] = useState<{ id: string; key: AnovaService.CommandKey }[]>([]);
  const commandsRef = useRef(commands);

  async function scanForDevice() {
    console.log("init scanning");
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
    console.log("connected to device", device);
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

  function encode(command: string) {
    return btoa(`${command}\r`);
  }

  function decode(value: string) {
    return atob(value).replace("\r", "");
  }

  async function sendCommand(key: AnovaService.CommandKey, value: string) {
    try {
      const id = Math.random().toString();
      console.log("command", characteristic, device, id);
      await characteristic?.writeWithResponse(encode(value), id);
      setCommands((commands) => {
        const queue = [{ id, key }, ...commands];
        commandsRef.current = queue;
        return queue;
      });
    } catch (e) {
      console.log("command err", e);
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
            console.log("could not connect to restored device");
          });
        }
      } catch (e) {
        void AnovaService.forgetDeviceId();
        await scanForDevice();
      } finally {
        console.log("init completed");
      }
    })();
  }, []);

  useEffect(
    function listenForDeviceConenction() {
      let subscription: Subscription | null;
      if (device) {
        void findCharacteistic().catch(noop);
        subscription = BLEService.onDeviceDisconnected((error, device) => {
          console.log("disconnected", error, device);
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
    function monitorCharacteristics() {
      let subscription: Subscription | null;
      if (characteristic) {
        console.log("characteristic monitoring");
        subscription = characteristic.monitor((error, characteristic) => {
          console.log("monitor log", error, characteristic);
          if (characteristic?.value) {
            const decodedVal = decode(characteristic.value);
            console.log("monitor value", decodedVal, characteristic);
            const [command, ...queuedCommands] = commandsRef.current;

            setCommands(queuedCommands);
            commandsRef.current = queuedCommands; // todo refactor

            switch (command.key) {
              case "read_temp": {
                setDetails((details) => ({ ...details, temperature: decodedVal }));
                break;
              }
              case "set_target_temp":
              case "read_target_temp": {
                setDetails((details) => ({ ...details, targetTemperature: decodedVal }));
                break;
              }
              case "start":
              case "stop": {
                setDetails((details) => ({ ...details, status: decodedVal as "start" | "stop" }));
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
    [characteristic, commandsRef],
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}
    >
      <ThemedView>
        <ThemedText>Manage device</ThemedText>
        <ThemedView style={{ marginTop: 20 }}>
          <Button title={"Connect"} onPress={() => {}} />
        </ThemedView>

        <ThemedView style={{ marginTop: 20 }}>
          <Button
            title={"Log"}
            onPress={async () => {
              console.log(await BLEService.getDevices());
            }}
          />
        </ThemedView>
        <ThemedView style={{ marginTop: 20 }}>
          <Button
            title={"Read temp"}
            onPress={async () => {
              await sendCommand("read_temp", AnovaService.commands["read_temp"]());
              await sleep(1000);
              await sendCommand("read_target_temp", AnovaService.commands["read_target_temp"]());
            }}
          />
        </ThemedView>
        <ThemedView style={{ marginTop: 20 }}>
          <Button
            title={"Set temp"}
            onPress={async () => {
              await sendCommand("set_target_temp", AnovaService.commands["set_target_temp"](55));
            }}
          />
        </ThemedView>

        <ThemedView style={{ marginTop: 20 }}>
          <Button
            disabled={details.status === "start"}
            title={"Start"}
            onPress={async () => {
              await sendCommand("start", AnovaService.commands["start"]());
            }}
          />
          <Button
            disabled={details.status === "stop"}
            title={"Stop"}
            onPress={async () => {
              await sendCommand("start", AnovaService.commands["stop"]());
            }}
          />
        </ThemedView>
        {device ? (
          <ThemedView style={{ marginTop: 20 }}>
            <ThemedText>Device name: {device?.name}</ThemedText>
            <ThemedText>Temperature: {details?.temperature}</ThemedText>
            <ThemedText>Target temperature: {details?.targetTemperature}</ThemedText>
          </ThemedView>
        ) : null}
      </ThemedView>
    </ParallaxScrollView>
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
