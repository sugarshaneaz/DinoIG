import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { fetchDinosaurImage } from "@workspace/api-client-react";
import type { Dinosaur } from "@workspace/api-client-react";
import { resolveImageSource } from "@/lib/resolveImageUrl";

interface DinoDetailProps {
  dinosaur: Dinosaur;
  onImageFetched?: (updated: Dinosaur) => void;
}

export function DinoDetail({ dinosaur, onImageFetched }: DinoDetailProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const handleFetchImage = async () => {
    setFetching(true);
    setFetchError(false);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const updated = await fetchDinosaurImage(dinosaur.id);
      onImageFetched?.(updated);
    } catch {
      setFetchError(true);
    } finally {
      setFetching(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 20),
      }}
    >
      {resolveImageSource(dinosaur.imageUrl) ? (
        <View>
          <Image
            source={resolveImageSource(dinosaur.imageUrl)!}
            style={styles.heroImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={[
              styles.changeImageBtn,
              { backgroundColor: "rgba(0,0,0,0.5)" },
            ]}
            onPress={handleFetchImage}
            disabled={fetching}
            activeOpacity={0.8}
          >
            {fetching ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Feather name="refresh-cw" size={14} color="#fff" />
                <Text style={styles.changeImageText}>Find new image</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.heroPlaceholder,
            {
              backgroundColor: colors.imagePlaceholder,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            },
          ]}
          onPress={handleFetchImage}
          disabled={fetching}
          activeOpacity={0.8}
        >
          {fetching ? (
            <>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.placeholderText, { color: colors.mutedForeground }]}>
                Searching Wikipedia...
              </Text>
            </>
          ) : fetchError ? (
            <>
              <Feather name="alert-circle" size={40} color={colors.destructive} />
              <Text style={[styles.placeholderText, { color: colors.destructive }]}>
                No image found — tap to retry
              </Text>
            </>
          ) : (
            <>
              <Feather name="camera" size={40} color={colors.primary} />
              <Text style={[styles.placeholderText, { color: colors.primary }]}>
                Tap to find an image
              </Text>
              <Text style={[styles.placeholderSub, { color: colors.mutedForeground }]}>
                Searches Wikipedia automatically
              </Text>
            </>
          )}
        </TouchableOpacity>
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
    height: 280,
    backgroundColor: "#000",
  },
  changeImageBtn: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  changeImageText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  heroPlaceholder: {
    width: "100%",
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  placeholderSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
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
