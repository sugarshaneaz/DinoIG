import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetDinosaurs } from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { DinoPost } from "@/components/DinoPost";
import { PaywallModal } from "@/components/PaywallModal";
import { usePremium, FREE_DINO_COUNT } from "@/lib/usePremium";
import { useRouter } from "expo-router";
import type { Dinosaur } from "@workspace/api-client-react";

export default function FeedScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [localOverrides, setLocalOverrides] = useState<Record<number, Dinosaur>>({});
  const [paywallVisible, setPaywallVisible] = useState(false);

  const { isPremium, unlock } = usePremium();
  const { data: dinosaurs, isLoading, error, refetch } = useGetDinosaurs({});

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setLocalOverrides({});
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handlePress = useCallback(
    (dinosaur: Dinosaur, index: number) => {
      if (!isPremium && index >= FREE_DINO_COUNT) {
        setPaywallVisible(true);
        return;
      }
      router.push({ pathname: "/detail", params: { id: dinosaur.id } });
    },
    [router, isPremium]
  );

  const handleLiked = useCallback((updated: Dinosaur) => {
    setLocalOverrides((prev) => ({ ...prev, [updated.id]: updated }));
  }, []);

  const handlePurchase = useCallback(async () => {
    await unlock();
    setPaywallVisible(false);
  }, [unlock]);

  const mergedDinosaurs = (dinosaurs ?? []).map((d) => localOverrides[d.id] ?? d);

  if (isLoading && !refreshing) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.mutedForeground }]}>
          Failed to load feed
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={mergedDinosaurs}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <DinoPost
            dinosaur={item}
            isLocked={!isPremium && index >= FREE_DINO_COUNT}
            onPress={() => handlePress(item, index)}
            onLiked={handleLiked}
            onLockedAction={() => setPaywallVisible(true)}
          />
        )}
        contentContainerStyle={{
          paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 20,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🦖</Text>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No dinosaurs yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              The feed is empty — check back later
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <PaywallModal
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
        onPurchase={handlePurchase}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
