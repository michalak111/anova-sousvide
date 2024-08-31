import { Characteristic, Device, Service } from "react-native-ble-plx";
import { BLEService } from "@/services/BLEService";

/**
 * BLEServiceMock
 */
export function mockBLEService() {
  const device = { id: "device:test:id", name: "Anova" } as Device;

  class MockBLEService {
    device = device;

    isDeviceConnected = () => new Promise((res) => res(true));

    scanDevices = async (listener: any) => {
      listener(device);
    };

    connectToDevice = () => new Promise((res) => res(device));

    discoverAllServicesAndCharacteristicsForDevice = () => new Promise((res) => res(device));

    getServicesForDevice = () => {
      return new Promise((res) => {
        res([{ uuid: "ffe0" } as Service]);
      });
    };

    getCharacteristicsForDevice = () => {
      const characteristic = {
        listener: (a: string | null, b: object) => null,
        responseMap: {
          status: "stop",
          "read temp": "23",
          "read set temp": "88",
          "read timer": "15 stopped",

          start: "start",
          stop: "stop",
        } as Record<string, string>,

        uuid: "ffe1",
        monitor: function (listener: any) {
          setInterval(() => {
            if (this.responseMap["status"] === "start") {
              const [time] = this.responseMap["read timer"].split(" ");
              const timeLeft = Number(time) > 0 ? Number(time) - 1 : 0;
              this.responseMap["read timer"] = `${timeLeft} running`;
            }
          }, 5000);
          this.listener = listener;
        },
        writeWithResponse: function (value: string) {
          let request = atob(value).replace("\r", "");

          if (request === "start") {
            this.responseMap["status"] = "start";
            request = "status";
          }

          if (request === "stop") {
            this.responseMap["read timer"] = this.responseMap["read timer"].replace("running", "stopped");
            this.responseMap["status"] = "stop";
            request = "status";
          }

          if (request.startsWith("set temp")) {
            this.responseMap["read set temp"] = request.replace("set temp ", "").replace("C", "");
            request = "read set temp";
          }

          if (request.startsWith("set timer")) {
            // attention: this works differently with anova, set value is only returned after timer started
            const [_, status] = this.responseMap["read timer"].split(" ");
            this.responseMap["read timer"] = `${request.replace("set timer ", "")} ${status}`;
          }

          const response = this.responseMap[request] || "test";
          setTimeout(() => {
            this.listener(null, { ...this, value: btoa(`${response}\r`) });
          }, 100);
        },
      };

      return new Promise((res) => {
        res([characteristic as unknown as Characteristic]);
      });
    };
  }

  Object.assign(BLEService, new MockBLEService());
}
