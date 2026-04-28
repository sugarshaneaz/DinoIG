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

  // Treat user as premium when there's nothing to sell (RevenueCat not yet
  // configured or no products in the dashboard). The paywall reactivates
  // automatically once real offerings load.
  const hasOfferings = !!offerings?.current?.availablePackages?.length;
  const isPremium = isSubscribed || (!isLoading && !hasOfferings);

  return { isPremium, loading: isLoading, unlock };
}
