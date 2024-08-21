import { Characteristic, Device, Service } from "react-native-ble-plx";
import * as SecureStore from "expo-secure-store";

const DEVICE_SERVICE_UUID = "ffe0";
const DEVICE_CHARACTERISTIC_UUID = "ffe1";

const commands = {
  read_temp: () => "read temp",
  read_target_temp: () => "read set temp",

  set_target_temp: (val: number) => `set temp ${val}C`,

  start: () => `start`,
  stop: () => `stop`,
} as const;

const validateDeviceName = (device: Device) => {
  return device.name?.toLowerCase().includes("anova");
};

const findService = (services: Service[]) => {
  return services.find((service) => service.uuid.includes(DEVICE_SERVICE_UUID));
};

const findCharacteristics = (characteristics: Characteristic[]) => {
  return characteristics.find((characteristic) => characteristic.uuid.includes(DEVICE_CHARACTERISTIC_UUID));
};

const storeDeviceId = (id: string) => SecureStore.setItem("STORE_ANOVA_DEVICE_ID", id);

const restoreDeviceId = () => SecureStore.getItem("STORE_ANOVA_DEVICE_ID");

const forgetDeviceId = () => SecureStore.deleteItemAsync("STORE_ANOVA_DEVICE_ID");

export namespace AnovaService {
  export type CommandKey = keyof typeof commands;
}

export const AnovaService = {
  DEVICE_SERVICE_UUID,
  DEVICE_CHARACTERISTIC_UUID,
  validateDeviceName,
  findService,
  findCharacteristics,
  storeDeviceId,
  restoreDeviceId,
  forgetDeviceId,
  commands,
};
