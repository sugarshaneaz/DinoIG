import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetDinosaur } from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { DinoDetail } from "@/components/DinoDetail";

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const numericId = parseInt(id ?? "0", 10);

  const { data: dinosaur, isLoading, error } = useGetDinosaur(numericId, {
    query: { enabled: !!numericId },
  });

  const topPadding = Platform.OS === "web" ? Math.max(insets.top, 67) : 0;

  return (
    <>
      <Stack.Screen
        options={{
          title: dinosaur?.name ?? "Dinosaur",
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
        ) : error || !dinosaur ? (
          <View style={styles.center}>
            <Text style={[styles.errorText, { color: colors.destructive }]}>
              {error ? "Failed to load dinosaur" : "Dinosaur not found"}
            </Text>
          </View>
        ) : (
          <DinoDetail dinosaur={dinosaur} />
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
