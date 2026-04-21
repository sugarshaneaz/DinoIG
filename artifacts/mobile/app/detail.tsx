import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetDinosaur, getGetDinosaurQueryKey } from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { DinoDetail } from "@/components/DinoDetail";
import type { Dinosaur } from "@workspace/api-client-react";

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const numericId = parseInt(id ?? "0", 10);
  const [imageOverride, setImageOverride] = useState<Dinosaur | null>(null);

  const { data: dinosaur, isLoading, error } = useGetDinosaur(numericId, {
    query: {
      enabled: !!numericId,
      queryKey: getGetDinosaurQueryKey(numericId),
    },
  });

  const displayDinosaur = imageOverride ?? dinosaur;

  const topPadding = Platform.OS === "web" ? Math.max(insets.top, 67) : 0;

  return (
    <>
      <Stack.Screen
        options={{
          title: displayDinosaur?.name ?? "Dinosaur",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontFamily: "Inter_600SemiBold",
            color: colors.foreground,
          },
        }}
      />
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: topPadding,
          },
        ]}
      >
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : error || !displayDinosaur ? (
          <View style={styles.center}>
            <Text style={[styles.errorText, { color: colors.destructive }]}>
              {error ? "Failed to load dinosaur" : "Dinosaur not found"}
            </Text>
          </View>
        ) : (
          <DinoDetail
            dinosaur={displayDinosaur}
            onImageFetched={setImageOverride}
          />
        )}
      </View>
    </>
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
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
});
