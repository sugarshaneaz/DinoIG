import { useCallback } from "react";
import { useSubscription } from "@/lib/revenuecat";

export const FREE_DINO_COUNT = 6;

export function usePremium() {
  const { isSubscribed, isLoading, offerings, purchase } = useSubscription();

  const unlock = useCallback(async (plan: "monthly" | "lifetime" = "monthly") => {
    const currentOffering = offerings?.current;
    const packageToPurchase = currentOffering?.availablePackages.find((p) =>
      plan === "lifetime" ? p.packageType === "LIFETIME" : p.packageType === "MONTHLY"
    );
    if (!packageToPurchase) throw new Error("No package available to purchase");
    await purchase(packageToPurchase);
  }, [offerings, purchase]);

  return { isPremium: isSubscribed, loading: isLoading, unlock };
}
