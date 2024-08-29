import { Characteristic, Device, Service } from "react-native-ble-plx";
import * as SecureStore from "expo-secure-store";

export namespace AnovaService {
  export type CommandKey = keyof typeof commands;
  export type CookingState = {
    temperature: string | null;
    targetTemperature: string | null;
    status: "start" | "stop" | "stopped" | "running" | "low water" | null;
    timer: string | null;
    timerSet?: string;
  };

  export const DEVICE_SERVICE_UUID = "ffe0";
  export const DEVICE_CHARACTERISTIC_UUID = "ffe1";

  export const commands = {
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

  export const validateDeviceName = (device: Device) => {
    return device.name?.toLowerCase().includes("anova");
  };

  export const findService = (services: Service[]) => {
    return services.find((service) => service.uuid.includes(DEVICE_SERVICE_UUID));
  };

  export const findCharacteristics = (characteristics: Characteristic[]) => {
    return characteristics.find((characteristic) => characteristic.uuid.includes(DEVICE_CHARACTERISTIC_UUID));
  };

  export const encodeCmd = (command: string) => {
    return btoa(`${command}\r`);
  };

  export const decodeCmd = (value: string) => {
    return atob(value).replace("\r", "");
  };

  export const storeDeviceId = (id: string) => SecureStore.setItem("STORE_ANOVA_DEVICE_ID", id);

  export const restoreDeviceId = () => SecureStore.getItem("STORE_ANOVA_DEVICE_ID");

  export const forgetDeviceId = () => SecureStore.deleteItemAsync("STORE_ANOVA_DEVICE_ID");

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
}
