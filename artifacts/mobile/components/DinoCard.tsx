import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import type { Dinosaur } from "@workspace/api-client-react";

interface DinoCardProps {
  dinosaur: Dinosaur;
  onPress: () => void;
}

export function DinoCard({ dinosaur, onPress }: DinoCardProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: 16,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {dinosaur.imageUrl ? (
          <Image
            source={{ uri: dinosaur.imageUrl }}
            style={[styles.image, { borderRadius: 12 }]}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.imagePlaceholder,
              { backgroundColor: colors.imagePlaceholder, borderRadius: 12 },
            ]}
          >
            <Feather name="image" size={32} color={colors.mutedForeground} />
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text
          style={[styles.name, { color: colors.foreground }]}
          numberOfLines={1}
        >
          {dinosaur.name}
        </Text>
        <Text
          style={[styles.description, { color: colors.mutedForeground }]}
          numberOfLines={2}
        >
          {dinosaur.description}
        </Text>
        <View style={styles.badges}>
          <Badge label={dinosaur.period} icon="clock" colors={colors} />
          <Badge label={dinosaur.diet} icon="activity" colors={colors} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function Badge({
  label,
  icon,
  colors,
}: {
  label: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.secondary, borderRadius: 8 },
      ]}
    >
      <Feather name={icon} size={11} color={colors.primary} />
      <Text style={[styles.badgeText, { color: colors.primary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  imageContainer: {
    marginRight: 14,
  },
  image: {
    width: 90,
    height: 90,
  },
  imagePlaceholder: {
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  name: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  description: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  badges: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
});
