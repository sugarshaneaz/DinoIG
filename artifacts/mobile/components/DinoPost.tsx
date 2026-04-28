import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useLikeDinosaur } from "@workspace/api-client-react";
import type { Dinosaur } from "@workspace/api-client-react";
import { resolveImageSource } from "@/lib/resolveImageUrl";
import { getCommentsForDino } from "@/lib/dinoComments";
import { getRealisticImageUrl } from "@/lib/realisticImages";

const SCREEN_WIDTH = Dimensions.get("window").width;
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.75;

interface DinoPostProps {
  dinosaur: Dinosaur;
  onPress: () => void;
  onLiked?: (updated: Dinosaur) => void;
  isLocked?: boolean;
  onLockedAction?: () => void;
}

export function DinoPost({ dinosaur, onPress, onLiked, isLocked = false, onLockedAction }: DinoPostProps) {
  const colors = useColors();
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(dinosaur.likesCount);
  const [reposted, setReposted] = useState(false);
  const [reposts, setReposts] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const comments = getCommentsForDino(dinosaur.id, 3);
  const fossilSource = resolveImageSource(dinosaur.imageUrl);
  const realisticSource = resolveImageSource(getRealisticImageUrl(dinosaur.name));
  const slides = realisticSource
    ? [
        { source: realisticSource, label: "Life restoration" },
        { source: fossilSource, label: "Fossil" },
      ]
    : fossilSource
    ? [{ source: fossilSource, label: null }]
    : [];

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

  const handleDM = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/chat?id=${dinosaur.id}`);
  }, [dinosaur.id]);

  const handleComments = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowComments((v) => !v);
  }, []);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      setActiveSlide(idx);
    },
    []
  );

  const formatCount = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  };

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      {/* Header */}
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

      {/* Locked overlay — shown for non-premium dinos */}
      {isLocked && (
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={onLockedAction}
          style={styles.lockedCard}
        >
          <View style={styles.lockedInner}>
            <Feather name="lock" size={32} color="#FFFFFF" style={{ marginBottom: 12 }} />
            <Text style={styles.lockedTitle}>300+ More Dinos Waiting</Text>
            <Text style={styles.lockedSub}>$4.99 for lifetime access</Text>
            <View style={styles.lockedBtn}>
              <Text style={styles.lockedBtnText}>Unlock Now</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Image + actions — hidden for locked dinos */}
      {!isLocked && (
        <>
          <View style={styles.carouselWrapper}>
            {slides.length === 0 ? (
              <TouchableOpacity activeOpacity={0.95} onPress={onPress}>
                <View style={[styles.imagePlaceholder, { backgroundColor: colors.accent }]}>
                  <Text style={styles.placeholderEmoji}>🦖</Text>
                </View>
              </TouchableOpacity>
            ) : slides.length === 1 ? (
              <TouchableOpacity activeOpacity={0.95} onPress={onPress} style={styles.slideTouch}>
                <Image
                  source={slides[0].source ?? undefined}
                  style={styles.image}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ) : (
              <>
                <ScrollView
                  ref={scrollRef}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                  style={styles.carousel}
                  contentContainerStyle={styles.carouselContent}
                >
                  {slides.map((slide, i) => (
                    <TouchableOpacity
                      key={i}
                      activeOpacity={0.95}
                      onPress={onPress}
                      style={styles.slideTouch}
                    >
                      <Image
                        source={slide.source ?? undefined}
                        style={styles.image}
                        resizeMode="contain"
                      />
                      {slide.label && (
                        <View style={styles.slideLabel}>
                          <Text style={styles.slideLabelText}>{slide.label}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={styles.dots} pointerEvents="none">
                  {slides.map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.dot,
                        {
                          backgroundColor:
                            i === activeSlide ? "#FFFFFF" : "rgba(255,255,255,0.35)",
                          width: i === activeSlide ? 6 : 5,
                          height: i === activeSlide ? 6 : 5,
                        },
                      ]}
                    />
                  ))}
                </View>
              </>
            )}
            {slides.length > 0 && (
              <View style={styles.imageOverlay} pointerEvents="none">
                <Text style={styles.overlayName}>{dinosaur.name}</Text>
              </View>
            )}
          </View>

          <View style={styles.actions}>
            <View style={styles.leftActions}>
              <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
                <Feather name="heart" size={26} color={liked ? colors.like : colors.likeInactive} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={handleComments}>
                <Feather name="message-circle" size={26} color={showComments ? colors.foreground : colors.comment} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={handleDM}>
                <Feather name="send" size={26} color={colors.share} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.actionBtn} onPress={handleRepost}>
              <Feather name="repeat" size={26} color={reposted ? "#1DA1F2" : colors.repost} />
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
            {showComments && (
              <View style={styles.commentsSection}>
                <View style={[styles.commentsDivider, { backgroundColor: colors.border }]} />
                {comments.map((c, i) => (
                  <View key={i} style={styles.commentThread}>
                    <View style={styles.commentRow}>
                      <Text style={styles.commentAvatar}>{c.avatar}</Text>
                      <View style={styles.commentBody}>
                        <Text style={[styles.commentLine, { color: colors.foreground }]}>
                          <Text style={styles.commentUsername}>{c.username} </Text>
                          {c.text}
                        </Text>
                      </View>
                    </View>
                    {c.replies && c.replies.length > 0 && (
                      <View style={styles.repliesBlock}>
                        <View style={[styles.replyThreadLine, { backgroundColor: colors.border }]} />
                        <View style={styles.repliesInner}>
                          {c.replies.map((r, j) => (
                            <View key={j} style={styles.replyRow}>
                              <Text style={styles.replyAvatar}>{r.avatar}</Text>
                              <View style={styles.commentBody}>
                                <Text style={[styles.commentLine, { color: colors.foreground }]}>
                                  <Text style={styles.commentUsername}>{r.username} </Text>
                                  {r.text}
                                </Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                ))}
                <TouchableOpacity onPress={handleComments} style={styles.hideBtn}>
                  <Text style={[styles.hideBtnText, { color: colors.mutedForeground }]}>
                    Hide comments
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  lockedCard: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
    backgroundColor: "#0A0A0A",
    alignItems: "center",
    justifyContent: "center",
  },
  lockedInner: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  lockedTitle: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 6,
  },
  lockedSub: {
    color: "#8E8E8E",
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  lockedBtn: {
    backgroundColor: "#0095F6",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  lockedBtnText: {
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
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
  carouselWrapper: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
    position: "relative",
    backgroundColor: "#000",
  },
  carousel: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
    flexGrow: 0,
  },
  carouselContent: {
    height: IMAGE_HEIGHT,
  },
  slideTouch: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
    backgroundColor: "#000",
  },
  image: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
    backgroundColor: "#000000",
  },
  slideLabel: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  slideLabelText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.2,
  },
  dots: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    zIndex: 10,
  },
  dot: {
    borderRadius: 3,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  overlayName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  imagePlaceholder: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderEmoji: {
    fontSize: 80,
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
  commentsSection: {
    marginTop: 6,
    gap: 10,
  },
  commentsDivider: {
    height: StyleSheet.hairlineWidth,
    marginBottom: 2,
  },
  commentThread: {
    gap: 0,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  commentAvatar: {
    fontSize: 18,
    lineHeight: 22,
    width: 22,
    textAlign: "center",
  },
  commentBody: {
    flex: 1,
  },
  commentLine: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  commentUsername: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  repliesBlock: {
    flexDirection: "row",
    marginLeft: 11,
    marginTop: 6,
    gap: 0,
  },
  replyThreadLine: {
    width: 2,
    borderRadius: 1,
    marginRight: 14,
    minHeight: "100%",
  },
  repliesInner: {
    flex: 1,
    gap: 8,
  },
  replyRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  replyAvatar: {
    fontSize: 15,
    lineHeight: 20,
    width: 20,
    textAlign: "center",
  },
  hideBtn: {
    alignSelf: "flex-start",
    paddingTop: 2,
  },
  hideBtnText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
