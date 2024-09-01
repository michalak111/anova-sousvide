import { AnovaService } from "@/services/AnovaService";
import { create } from "zustand";

type State = AnovaService.CookingState;

type Action = {
  update: (key: keyof State, value: string) => void;
};

const useCookingStoreInstance = create<State & Action>((set) => ({
  temperature: null,
  targetTemperature: null,
  status: null,
  timer: null,
  update: (key, value) => set(() => ({ [key]: value })),
}));

export const useCookingStateStore = () => {
  const { update, ...cookingState } = useCookingStoreInstance();
  return { update, cookingState };
};

export const selectCookingTime = ({ timer, timerSet }: Pick<State, "timer" | "timerSet">) => {
  const timerValue = timer ? AnovaService.timerToMinutes(timer) : 0;
  return String(timerValue || timerSet || 0);
};
