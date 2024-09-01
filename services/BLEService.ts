import {
  type Base64,
  BleError,
  BleErrorCode,
  BleManager,
  type Characteristic,
  Device,
  type DeviceId,
  LogLevel,
  State as BluetoothState,
  type Subscription,
  type UUID,
} from "react-native-ble-plx";
import { PermissionsAndroid, Platform } from "react-native";

const deviceNotConnectedErrorText = "Device is not connected";

class BLEServiceInstance {
  manager: BleManager;

  device: Device | null;

  characteristicMonitor: Subscription | null;

  constructor() {
    this.device = null;
    this.characteristicMonitor = null;
    this.manager = new BleManager();
    this.manager.setLogLevel(LogLevel.Verbose);
  }

  getDevice = () => this.device;

  initializeBLE = () =>
    new Promise<void>((resolve) => {
      const subscription = this.manager.onStateChange((state) => {
        switch (state) {
          case BluetoothState.Unsupported:
            this.errorLog("");
            break;
          case BluetoothState.PoweredOff:
            this.onBluetoothPowerOff();
            this.manager.enable().catch((error: BleError) => {
              if (error.errorCode === BleErrorCode.BluetoothUnauthorized) {
                this.requestBluetoothPermission();
              }
            });
            break;
          case BluetoothState.Unauthorized:
            this.requestBluetoothPermission();
            break;
          case BluetoothState.PoweredOn:
            resolve();
            subscription.remove();
            break;
          default:
            this.errorLog("Unsupported state: ", state);
        }
      }, true);
    });

  onBluetoothPowerOff = () => {
    this.errorLog("Bluetooth is turned off");
  };

  scanDevices = async (onDeviceFound: (device: Device) => void, UUIDs: UUID[] | null = null, legacyScan?: boolean) => {
    this.manager
      .startDeviceScan(UUIDs, { legacyScan }, (error, device) => {
        if (error) {
          this.onError(error);
          console.error(error.message);
          this.manager.stopDeviceScan();
          return;
        }
        if (device) {
          onDeviceFound(device);
        }
      })
      .then(() => {})
      .catch(console.error);
  };

  connectToDevice = (deviceId: DeviceId) =>
    new Promise<Device>((resolve, reject) => {
      this.manager.stopDeviceScan();
      this.manager
        .connectToDevice(deviceId, {})
        .then((device) => {
          this.device = device;
          resolve(device);
        })
        .catch((error) => {
          if (error.errorCode === BleErrorCode.DeviceAlreadyConnected && this.device) {
            resolve(this.device);
          } else {
            this.onError(error);
            reject(error);
          }
        });
    });

  discoverAllServicesAndCharacteristicsForDevice = async () =>
    new Promise<Device>((resolve, reject) => {
      if (!this.device) {
        this.errorLog(deviceNotConnectedErrorText);
        reject(new Error(deviceNotConnectedErrorText));
        return;
      }
      this.manager
        .discoverAllServicesAndCharacteristicsForDevice(this.device.id)
        .then((device) => {
          resolve(device);
          this.device = device;
        })
        .catch((error) => {
          this.onError(error);
          reject(error);
        });
    });

  readCharacteristicForDevice = async (serviceUUID: UUID, characteristicUUID: UUID) =>
    new Promise<Characteristic>((resolve, reject) => {
      if (!this.device) {
        this.errorLog(deviceNotConnectedErrorText);
        reject(new Error(deviceNotConnectedErrorText));
        return;
      }
      this.manager
        .readCharacteristicForDevice(this.device.id, serviceUUID, characteristicUUID)
        .then((characteristic) => {
          resolve(characteristic);
        })
        .catch((error) => {
          this.onError(error);
        });
    });

  writeCharacteristicWithResponseForDevice = async (serviceUUID: UUID, characteristicUUID: UUID, time: Base64) => {
    if (!this.device) {
      this.errorLog(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager
      .writeCharacteristicWithResponseForDevice(this.device.id, serviceUUID, characteristicUUID, time)
      .catch((error) => {
        this.onError(error);
      });
  };

  writeCharacteristicWithoutResponseForDevice = async (serviceUUID: UUID, characteristicUUID: UUID, time: Base64) => {
    if (!this.device) {
      this.errorLog(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager
      .writeCharacteristicWithoutResponseForDevice(this.device.id, serviceUUID, characteristicUUID, time)
      .catch((error) => {
        this.onError(error);
      });
  };

  getServicesForDevice = () => {
    if (!this.device) {
      this.errorLog(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager.servicesForDevice(this.device.id).catch((error) => {
      this.onError(error);
    });
  };

  getCharacteristicsForDevice = (serviceUUID: UUID) => {
    if (!this.device) {
      this.errorLog(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager.characteristicsForDevice(this.device.id, serviceUUID).catch((error) => {
      this.onError(error);
    });
  };

  isDeviceConnected = () => {
    if (!this.device) {
      this.errorLog(deviceNotConnectedErrorText);
      return new Promise((_, reject) => {
        reject(deviceNotConnectedErrorText);
      });
    }
    return this.manager.isDeviceConnected(this.device.id);
  };

  isDeviceWithIdConnected = async (id: DeviceId) => {
    return await this.manager.isDeviceConnected(id);
  };

  onDeviceDisconnected = (listener: (error: BleError | null, device: Device | null) => void) => {
    if (!this.device) {
      this.errorLog(deviceNotConnectedErrorText);
      throw new Error(deviceNotConnectedErrorText);
    }
    return this.manager.onDeviceDisconnected(this.device.id, listener);
  };

  onError = (error: BleError) => {
    switch (error.errorCode) {
      case BleErrorCode.BluetoothUnauthorized:
        this.requestBluetoothPermission();
        break;
      case BleErrorCode.LocationServicesDisabled:
        this.errorLog("Location services are disabled");
        break;
      default:
        this.errorLog(JSON.stringify(error, null, 4));
    }
  };

  requestBluetoothPermission = async () => {
    if (Platform.OS === "ios") {
      return true;
    }
    if (Platform.OS === "android") {
      const apiLevel = parseInt(Platform.Version.toString(), 10);

      if (apiLevel < 31 && PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }

      if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN && PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
        console.log({ apiLevel });
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);

        return (
          result["android.permission.BLUETOOTH_CONNECT"] === PermissionsAndroid.RESULTS.GRANTED &&
          result["android.permission.BLUETOOTH_SCAN"] === PermissionsAndroid.RESULTS.GRANTED
        );
      }
    }

    this.errorLog("Permission have not been granted");

    return false;
  };

  errorLog = (...args: unknown[]) => {
    console.error("BLEService - ", ...args);
  };

  infoLog = (...args: unknown[]) => {
    console.info("BLEService - ", ...args);
  };
}

export const BLEService = new BLEServiceInstance();
