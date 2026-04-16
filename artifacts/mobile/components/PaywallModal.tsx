import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

export function PaywallModal({ visible, onClose, onPurchase }: PaywallModalProps) {
  const insets = useSafeAreaInsets();

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
            You've met the famous ones. Now unlock the full prehistoric world — 300 more dinosaurs to explore, read about, and chat with.
          </Text>

          <View style={styles.perks}>
            <PerkRow icon="message-circle" text="Chat with every dinosaur" />
            <PerkRow icon="image"         text="Life restorations + fossil photos" />
            <PerkRow icon="unlock"        text="All 311 dinosaurs, forever" />
            <PerkRow icon="zap"           text="One-time payment, no subscription" />
          </View>

          <TouchableOpacity style={styles.purchaseBtn} onPress={onPurchase} activeOpacity={0.85}>
            <Text style={styles.purchaseBtnText}>Get Lifetime Access — $4.99</Text>
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
      <Feather name={icon as any} size={18} color="#0095F6" />
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
    paddingHorizontal: 28,
    alignItems: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 20,
    padding: 6,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    color: "#8E8E8E",
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 24,
  },
  perks: {
    width: "100%",
    gap: 14,
    marginBottom: 28,
  },
  perkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  perkText: {
    color: "#FFFFFF",
    fontFamily: "Inter_400Regular",
    fontSize: 15,
  },
  purchaseBtn: {
    backgroundColor: "#0095F6",
    borderRadius: 14,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
    marginBottom: 14,
  },
  purchaseBtnText: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 16,
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
