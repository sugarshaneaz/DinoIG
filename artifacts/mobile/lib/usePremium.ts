import { useCallback } from "react";
import { useSubscription } from "@/lib/revenuecat";

export const FREE_DINO_COUNT = 6;

export function usePremium() {
  const { isSubscribed, isLoading, offerings, purchase } = useSubscription();

  const unlock = useCallback(async () => {
    const currentOffering = offerings?.current;
    const packageToPurchase = currentOffering?.availablePackages[0];
    if (!packageToPurchase) throw new Error("No package available to purchase");
    await purchase(packageToPurchase);
  }, [offerings, purchase]);

  return { isPremium: isSubscribed, loading: isLoading, unlock };
}
