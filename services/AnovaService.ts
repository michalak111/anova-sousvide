import { Characteristic, Device, Service } from "react-native-ble-plx";
import * as SecureStore from "expo-secure-store";

const DEVICE_SERVICE_UUID = "ffe0";
const DEVICE_CHARACTERISTIC_UUID = "ffe1";

const commands = {
  read_status: () => "status",
  read_temp: () => "read temp",
  read_target_temp: () => "read set temp",
  read_timer: () => "read timer",

  set_target_temp: (val: number) => `set temp ${val}C`,
  set_timer: (val: number) => `set timer ${val}`,

  start: () => `start`,
  stop: () => `stop`,
  start_time: () => `start time`,
  stop_time: () => `stop time`,
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

const encodeCmd = (command: string) => {
  return btoa(`${command}\r`);
};

const decodeCmd = (value: string) => {
  return atob(value).replace("\r", "");
};

const storeDeviceId = (id: string) => SecureStore.setItem("STORE_ANOVA_DEVICE_ID", id);

const restoreDeviceId = () => SecureStore.getItem("STORE_ANOVA_DEVICE_ID");

const forgetDeviceId = () => SecureStore.deleteItemAsync("STORE_ANOVA_DEVICE_ID");

export const timerToMinutes = (timer: string) => {
  const [time] = timer.split(" ");
  return Number(time);
};

export const timerToHoursMinutes = (timer: string) => {
  const totalMinutes = timerToMinutes(timer);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes - hours * 60;
  return { hours, minutes };
};

export const displayCookingTime = (timer: string) => {
  const { hours, minutes } = timerToHoursMinutes(timer);
  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
};

export namespace AnovaService {
  export type CommandKey = keyof typeof commands;
}

export const AnovaService = {
  DEVICE_SERVICE_UUID,
  DEVICE_CHARACTERISTIC_UUID,
  validateDeviceName,
  findService,
  findCharacteristics,
  encodeCmd,
  decodeCmd,
  storeDeviceId,
  restoreDeviceId,
  forgetDeviceId,
  timerToMinutes,
  timerToHoursMinutes,
  displayCookingTime,
  commands,
};
