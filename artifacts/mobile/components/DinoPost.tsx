import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Share,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useLikeDinosaur } from "@workspace/api-client-react";
import type { Dinosaur } from "@workspace/api-client-react";
import { resolveImageUrl } from "@/lib/resolveImageUrl";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface DinoPostProps {
  dinosaur: Dinosaur;
  onPress: () => void;
  onLiked?: (updated: Dinosaur) => void;
}

export function DinoPost({ dinosaur, onPress, onLiked }: DinoPostProps) {
  const colors = useColors();
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(dinosaur.likesCount);
  const [reposted, setReposted] = useState(false);
  const [reposts, setReposts] = useState(0);

  const { mutate: likeDino } = useLikeDinosaur({
    mutation: {
      onSuccess: (updated) => {
        onLiked?.(updated);
      },
    },
  });

  const handleLike = useCallback(() => {
    if (liked) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setLiked(true);
    setLocalLikes((n) => n + 1);
    likeDino({ id: dinosaur.id });
  }, [liked, dinosaur.id, likeDino]);

  const handleRepost = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setReposted((r) => !r);
    setReposts((n) => (reposted ? Math.max(0, n - 1) : n + 1));
  }, [reposted]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Check out ${dinosaur.name} on Dino IG! 🦖 ${dinosaur.description}`,
        title: `${dinosaur.name} — Dino IG`,
      });
    } catch {
    }
  }, [dinosaur]);

  const imageUri = resolveImageUrl(dinosaur.imageUrl);

  const formatCount = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  };

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <TouchableOpacity
        style={styles.header}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
          <Text style={styles.avatarText}>
            {dinosaur.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.username, { color: colors.foreground }]}>
            {dinosaur.name.toLowerCase().replace(/\s+/g, "_")}
          </Text>
          <Text style={[styles.species, { color: colors.mutedForeground }]}>
            {dinosaur.period}
          </Text>
        </View>
        <View style={[styles.dietBadge, { backgroundColor: colors.accent }]}>
          <Text style={[styles.dietText, { color: colors.mutedForeground }]}>
            {dinosaur.diet}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.95} onPress={onPress}>
        <View style={styles.imageWrapper}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.accent }]}>
              <Text style={styles.placeholderEmoji}>🦖</Text>
            </View>
          )}
          <View style={styles.imageOverlay}>
            <Text style={styles.overlayName}>{dinosaur.name}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
            <Feather
              name="heart"
              size={26}
              color={liked ? colors.like : colors.likeInactive}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
            <Feather name="message-circle" size={26} color={colors.comment} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Feather name="send" size={26} color={colors.share} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.actionBtn} onPress={handleRepost}>
          <Feather
            name="repeat"
            size={26}
            color={reposted ? "#1DA1F2" : colors.repost}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        {localLikes > 0 && (
          <Text style={[styles.likesText, { color: colors.foreground }]}>
            {formatCount(localLikes)} {localLikes === 1 ? "like" : "likes"}
          </Text>
        )}
        {reposts > 0 && (
          <Text style={[styles.repostText, { color: colors.mutedForeground }]}>
            {reposts} {reposts === 1 ? "repost" : "reposts"}
          </Text>
        )}
        <Text style={[styles.caption, { color: colors.foreground }]} numberOfLines={2}>
          <Text style={styles.captionUsername}>
            {dinosaur.name.toLowerCase().replace(/\s+/g, "_")}{" "}
          </Text>
          {dinosaur.description}
        </Text>
        <Text style={[styles.period, { color: colors.mutedForeground }]}>
          {dinosaur.period} · {dinosaur.diet}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  headerInfo: {
    flex: 1,
  },
  username: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  species: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  dietBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dietText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
    position: "relative",
    backgroundColor: "#000",
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
  },
  imagePlaceholder: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderEmoji: {
    fontSize: 80,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    paddingVertical: 16,
    backgroundColor: "transparent",
  },
  overlayName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    textShadow: "0px 1px 4px rgba(0,0,0,0.8)",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  leftActions: {
    flexDirection: "row",
    gap: 16,
  },
  actionBtn: {
    padding: 4,
  },
  footer: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 4,
  },
  likesText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  repostText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  caption: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  captionUsername: {
    fontFamily: "Inter_600SemiBold",
  },
  period: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
});
