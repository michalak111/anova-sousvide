import { AnovaService } from "@/services/AnovaService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type HistoryEvent = {
  id: string;
  time: number;
  cookParams: AnovaService.CookerParms;
};

type State = { history: HistoryEvent[] };

type Action = {
  add: (data: Omit<HistoryEvent, "id" | "time">) => void;
  remove: (id: HistoryEvent["id"]) => void;
};

export const useHistoryStore = create<State & Action>()(
  persist(
    (set) => ({
      history: [],
      add: (data) => {
        set((state) => ({ history: [{ ...data, id: Date.now().toString(), time: Date.now() }, ...state.history] }));
      },
      remove: (id) => {
        set((state) => ({ history: state.history.filter((item) => item.id !== id) }));
      },
    }),
    { name: "cooking-history", storage: createJSONStorage(() => AsyncStorage) },
  ),
);
