# 🧑‍🍳 Anova Mobile App

This is a React Native mobile app designed to control the Anova Sous Vide Precision Cooker via Bluetooth Low Energy (BLE). The app enables users to set temperatures, manage cooking time, and monitor progress directly from their smartphones.

## Features
- BLE Integration: Connects to the Anova cooker via Bluetooth for real-time control and monitoring.
- Temperature and Time Control: Allows precise adjustments to cooking settings.
- Real-Time Monitoring: Displays current temperature and cooking status.
- Cross-Platform: Works on both iOS and Android, built using React Native.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npm run:(android|ios)
   ```

Because application uses native features such as BLE it does not run on ExpoGo. It only runs on native devices.

## Environment varialbes

```
.env.local

# Mocks BLEService.ts
EXPO_PUBLIC_BLE_MOCK_ENABLED=true
```
