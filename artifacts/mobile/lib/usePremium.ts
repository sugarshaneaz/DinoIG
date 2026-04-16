import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PREMIUM_KEY = "dino_premium_unlocked";
export const FREE_DINO_COUNT = 6;

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(PREMIUM_KEY).then((val) => {
      setIsPremium(val === "true");
      setLoading(false);
    });
  }, []);

  const unlock = useCallback(async () => {
    await AsyncStorage.setItem(PREMIUM_KEY, "true");
    setIsPremium(true);
  }, []);

  return { isPremium, loading, unlock };
}
