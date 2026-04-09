import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";

function DinoIGLogo() {
  return (
    <View style={styles.logoWrapper}>
      <Text style={styles.logoText}>Dino IG</Text>
      <Text style={styles.logoSub}>by Same Heights</Text>
    </View>
  );
}

export default function TabLayout() {
  const colors = useColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          elevation: 0,
          ...(Platform.OS === "web" ? { height: 84 } : {}),
        },
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        } as never,
        headerTitleStyle: {
          color: colors.foreground,
          fontFamily: "Inter_700Bold",
          fontSize: 22,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: () => <DinoIGLogo />,
          tabBarIcon: ({ color, focused }) => (
            <Feather name={focused ? "home" : "home"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <Feather name="search" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logoWrapper: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  logoText: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  logoSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: "#8E8E8E",
    letterSpacing: 0,
  },
});
