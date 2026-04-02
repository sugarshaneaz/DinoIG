import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import type { Dinosaur } from "@workspace/api-client-react";

interface DinoDetailProps {
  dinosaur: Dinosaur;
}

export function DinoDetail({ dinosaur }: DinoDetailProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 20),
      }}
    >
      {dinosaur.imageUrl ? (
        <Image
          source={{ uri: dinosaur.imageUrl }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.heroPlaceholder,
            { backgroundColor: colors.imagePlaceholder },
          ]}
        >
          <Feather name="image" size={64} color={colors.mutedForeground} />
        </View>
      )}

      <View style={[styles.content, { backgroundColor: colors.background }]}>
        <Text style={[styles.name, { color: colors.foreground }]}>
          {dinosaur.name}
        </Text>

        <View style={styles.badges}>
          <InfoBadge
            icon="clock"
            label="Period"
            value={dinosaur.period}
            colors={colors}
          />
          <InfoBadge
            icon="activity"
            label="Diet"
            value={dinosaur.diet}
            colors={colors}
          />
        </View>

        <View
          style={[
            styles.descriptionBox,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            About
          </Text>
          <Text style={[styles.description, { color: colors.foreground }]}>
            {dinosaur.description}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function InfoBadge({
  icon,
  label,
  value,
  colors,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View
      style={[
        styles.infoBadge,
        { backgroundColor: colors.secondary, borderRadius: 12 },
      ]}
    >
      <Feather name={icon} size={16} color={colors.primary} />
      <View>
        <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
          {label}
        </Text>
        <Text style={[styles.infoValue, { color: colors.primary }]}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    width: "100%",
    height: 260,
  },
  heroPlaceholder: {
    width: "100%",
    height: 260,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 20,
    gap: 16,
  },
  name: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
  },
  badges: {
    flexDirection: "row",
    gap: 12,
  },
  infoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  infoValue: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  descriptionBox: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  description: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
  },
});
