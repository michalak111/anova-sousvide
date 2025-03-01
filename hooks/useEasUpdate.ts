import { useEffect, useRef, useState } from "react";
import * as Updates from "expo-updates";
import { AppState } from "react-native";

export const useEasUpdate = () => {
  const [loaded, setLoaded] = useState(false);
  const [availableUpdate, setAvailableUpdate] = useState<{
    id: string;
    status: "idle" | "accepted" | "declined";
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable && update.manifest.id !== availableUpdate?.id) {
          setAvailableUpdate(() => ({ id: update.manifest.id, status: "idle" }));
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [availableUpdate?.id]);

  const acceptUpdate = async () => {
    setAvailableUpdate((update) => (update ? { ...update, status: "accepted" } : null));
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
  };

  const declineUpdate = () => {
    setAvailableUpdate((update) => (update ? { ...update, status: "declined" } : null));
  };

  return {
    loaded,
    isUpdateAvailable: availableUpdate && availableUpdate.status === "idle",
    acceptUpdate,
    declineUpdate,
  };
};
