import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Platform,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetDinosaurs } from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { SearchBar } from "@/components/SearchBar";
import { DinoCard } from "@/components/DinoCard";
import type { Dinosaur } from "@workspace/api-client-react";

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { data: dinosaurs, isLoading, error, refetch } = useGetDinosaurs(
    search ? { search } : {}
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handlePress = useCallback(
    (dinosaur: Dinosaur) => {
      router.push({ pathname: "/detail", params: { id: dinosaur.id } });
    },
    [router]
  );

  const topPadding = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            paddingTop: topPadding + 12,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>
          Dinosaur Explorer
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Discover prehistoric life
        </Text>
        <View style={styles.searchWrapper}>
          <SearchBar value={search} onChangeText={setSearch} />
        </View>
      </View>

      {isLoading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.destructive }]}>
            Failed to load dinosaurs
          </Text>
        </View>
      ) : (
        <FlatList
          data={dinosaurs ?? []}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <DinoCard dinosaur={item} onPress={() => handlePress(item)} />
          )}
          contentContainerStyle={[
            styles.list,
            {
              paddingBottom:
                (Platform.OS === "web" ? 34 : insets.bottom) + 20,
            },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
          scrollEnabled={!!(dinosaurs && dinosaurs.length > 0)}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                {search ? "No results found" : "No dinosaurs yet"}
              </Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                {search
                  ? `Try a different search term`
                  : "Dinosaur info will appear here once added"}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginBottom: 14,
  },
  searchWrapper: {
    marginBottom: 4,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingTop: 12,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  errorText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
});
