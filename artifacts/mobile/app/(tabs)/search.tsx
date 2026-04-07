import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetDinosaurs } from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { SearchBar } from "@/components/SearchBar";
import { useRouter } from "expo-router";
import { resolveImageUrl } from "@/lib/resolveImageUrl";
import type { Dinosaur } from "@workspace/api-client-react";

const SCREEN_WIDTH = Dimensions.get("window").width;
const TILE_SIZE = (SCREEN_WIDTH - 2) / 3;

export default function SearchScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");

  const { data: dinosaurs, isLoading } = useGetDinosaurs(
    search ? { search } : {}
  );

  const handlePress = useCallback(
    (dinosaur: Dinosaur) => {
      router.push({ pathname: "/detail", params: { id: dinosaur.id } });
    },
    [router]
  );

  const renderTile = useCallback(
    ({ item, index }: { item: Dinosaur; index: number }) => {
      const imageUri = resolveImageUrl(item.imageUrl);
      const isMiddle = index % 3 === 1;
      return (
        <TouchableOpacity
          style={[
            styles.tile,
            isMiddle && styles.tileMiddle,
            { width: TILE_SIZE, height: TILE_SIZE },
          ]}
          onPress={() => handlePress(item)}
          activeOpacity={0.85}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.tileImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.tilePlaceholder, { backgroundColor: colors.accent }]}>
              <Text style={styles.placeholderEmoji}>🦖</Text>
              <Text style={[styles.tileName, { color: colors.foreground }]} numberOfLines={2}>
                {item.name}
              </Text>
            </View>
          )}
          <View style={styles.tileLabel}>
            <Text style={styles.tileLabelText} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [handlePress, colors]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchWrapper, { borderBottomColor: colors.border }]}>
        <SearchBar value={search} onChangeText={setSearch} />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={dinosaurs ?? []}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderTile}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{
            paddingBottom: (Platform.OS === "web" ? 34 : insets.bottom) + 20,
          }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                {search ? `No results for "${search}"` : "No dinosaurs yet"}
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  row: {
    gap: 1,
    marginBottom: 1,
  },
  tile: {
    position: "relative",
    overflow: "hidden",
  },
  tileMiddle: {},
  tileImage: {
    width: "100%",
    height: "100%",
  },
  tilePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  placeholderEmoji: {
    fontSize: 28,
  },
  tileName: {
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    marginTop: 2,
  },
  tileLabel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 4,
    paddingVertical: 4,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  tileLabelText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
});
