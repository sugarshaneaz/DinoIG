import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useSubscription } from "@/lib/revenuecat";

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onPurchase: (plan: "monthly" | "lifetime") => void;
}

export function PaywallModal({ visible, onClose, onPurchase }: PaywallModalProps) {
  const insets = useSafeAreaInsets();
  const { offerings, isPurchasing } = useSubscription();
  const [selected, setSelected] = useState<"monthly" | "lifetime">("monthly");

  const currentOffering = offerings?.current;
  const monthlyPkg  = currentOffering?.availablePackages.find((p) => p.packageType === "MONTHLY");
  const lifetimePkg = currentOffering?.availablePackages.find((p) => p.packageType === "LIFETIME");

  const monthlyPrice  = monthlyPkg?.product.priceString  ?? "$4.99";
  const lifetimePrice = lifetimePkg?.product.priceString ?? "$14.99";

  const ctaLabel = selected === "monthly"
    ? `Start Monthly – ${monthlyPrice}/mo`
    : `Get Lifetime Access – ${lifetimePrice}`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Feather name="x" size={22} color="#8E8E8E" />
          </TouchableOpacity>

          <Text style={styles.emoji}>🦕</Text>
          <Text style={styles.title}>300+ More Dinos Await</Text>
          <Text style={styles.subtitle}>
            Unlock the full prehistoric world — 300 more dinosaurs to explore, read about, and chat with.
          </Text>

          {/* Plan picker */}
          <View style={styles.planRow}>
            <TouchableOpacity
              style={[styles.planCard, selected === "monthly" && styles.planCardSelected]}
              onPress={() => setSelected("monthly")}
              activeOpacity={0.8}
            >
              {selected === "monthly" && <View style={styles.checkDot} />}
              <Text style={styles.planLabel}>Monthly</Text>
              <Text style={styles.planPrice}>{monthlyPrice}</Text>
              <Text style={styles.planSub}>per month</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.planCard, selected === "lifetime" && styles.planCardSelected]}
              onPress={() => setSelected("lifetime")}
              activeOpacity={0.8}
            >
              {selected === "lifetime" && <View style={styles.checkDot} />}
              <View style={styles.bestValueBadge}>
                <Text style={styles.bestValueText}>BEST VALUE</Text>
              </View>
              <Text style={styles.planLabel}>Lifetime</Text>
              <Text style={styles.planPrice}>{lifetimePrice}</Text>
              <Text style={styles.planSub}>one-time</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.perks}>
            <PerkRow icon="message-circle" text="Chat with every dinosaur" />
            <PerkRow icon="image"          text="Life restorations + fossil photos" />
            <PerkRow icon="unlock"         text="All 311 dinosaurs unlocked" />
          </View>

          <TouchableOpacity
            style={[styles.purchaseBtn, isPurchasing && styles.purchaseBtnDisabled]}
            onPress={() => onPurchase(selected)}
            activeOpacity={0.85}
            disabled={isPurchasing}
          >
            {isPurchasing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.purchaseBtnText}>{ctaLabel}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.laterBtn}>
            <Text style={styles.laterText}>Maybe Later</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

function PerkRow({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.perkRow}>
      <Feather name={icon as any} size={16} color="#0095F6" />
      <Text style={styles.perkText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#111111",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 28,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 20,
    padding: 6,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  title: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 21,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#8E8E8E",
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  planRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginBottom: 20,
  },
  planCard: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#2C2C2E",
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    position: "relative",
  },
  planCardSelected: {
    borderColor: "#0095F6",
    backgroundColor: "#0A1929",
  },
  checkDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0095F6",
  },
  bestValueBadge: {
    backgroundColor: "#0095F6",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 6,
  },
  bestValueText: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    letterSpacing: 0.5,
  },
  planLabel: {
    color: "#8E8E8E",
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    marginBottom: 4,
  },
  planPrice: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 22,
  },
  planSub: {
    color: "#8E8E8E",
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    marginTop: 2,
  },
  perks: {
    width: "100%",
    gap: 10,
    marginBottom: 22,
  },
  perkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  perkText: {
    color: "#CCCCCC",
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  purchaseBtn: {
    backgroundColor: "#0095F6",
    borderRadius: 14,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  purchaseBtnDisabled: {
    opacity: 0.6,
  },
  purchaseBtnText: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    letterSpacing: 0.2,
  },
  laterBtn: {
    paddingVertical: 8,
  },
  laterText: {
    color: "#8E8E8E",
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
});
