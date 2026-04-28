import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { fetchDinosaurImage } from "@workspace/api-client-react";
import type { Dinosaur } from "@workspace/api-client-react";
import { resolveImageSource } from "@/lib/resolveImageUrl";

interface DinoCardProps {
  dinosaur: Dinosaur;
  onPress: () => void;
  onImageFetched?: (updated: Dinosaur) => void;
}

export function DinoCard({ dinosaur, onPress, onImageFetched }: DinoCardProps) {
  const colors = useColors();
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const handleFetchImage = async () => {
    setFetching(true);
    setFetchError(false);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const updated = await fetchDinosaurImage(dinosaur.id);
      onImageFetched?.(updated);
    } catch {
      setFetchError(true);
    } finally {
      setFetching(false);
    }
  };

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
        {resolveImageSource(dinosaur.imageUrl) ? (
          <Image
            source={resolveImageSource(dinosaur.imageUrl)!}
            style={[styles.image, { borderRadius: 12 }]}
            resizeMode="cover"
          />
        ) : (
          <TouchableOpacity
            style={[
              styles.imagePlaceholder,
              {
                backgroundColor: fetching
                  ? colors.secondary
                  : colors.imagePlaceholder,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: fetchError ? colors.destructive : colors.border,
                borderStyle: "dashed",
              },
            ]}
            onPress={handleFetchImage}
            disabled={fetching}
            activeOpacity={0.7}
          >
            {fetching ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : fetchError ? (
              <>
                <Feather
                  name="alert-circle"
                  size={20}
                  color={colors.destructive}
                />
                <Text
                  style={[styles.fetchLabel, { color: colors.destructive }]}
                >
                  Retry
                </Text>
              </>
            ) : (
              <>
                <Feather name="camera" size={20} color={colors.primary} />
                <Text style={[styles.fetchLabel, { color: colors.primary }]}>
                  Find
                </Text>
              </>
            )}
          </TouchableOpacity>
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
    gap: 4,
  },
  fetchLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
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
