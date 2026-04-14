import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGetDinosaur } from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";

const MESSAGE_LIMIT = 10;
const STORAGE_KEY_PREFIX = "dino_msg_v2_";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

interface StoredCount {
  date: string;
  count: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const BASE_URL = `https://${process.env.EXPO_PUBLIC_DOMAIN}`;

async function sendChat(
  dinoId: number,
  message: string,
  history: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/dinosaurs/${dinoId}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) throw new Error("Chat failed");
  const data = (await res.json()) as { reply: string };
  return data.reply;
}

function DinoAvatar({ emoji }: { emoji: string }) {
  return (
    <View style={styles.avatarCircle}>
      <Text style={styles.avatarEmoji}>{emoji}</Text>
    </View>
  );
}

function getDinoEmoji(diet: string | undefined): string {
  if (diet === "Carnivore") return "🦖";
  if (diet === "Herbivore") return "🦕";
  return "🦎";
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const numericId = parseInt(id ?? "0", 10);

  const { data: dino } = useGetDinosaur(numericId, {
    query: { enabled: !!numericId },
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const emoji = getDinoEmoji(dino?.diet);
  const dinoName = dino?.name ?? "Dinosaur";
  const storageKey = `${STORAGE_KEY_PREFIX}${numericId}`;
  const limitReached = sentCount >= MESSAGE_LIMIT;
  const remaining = MESSAGE_LIMIT - sentCount;

  useEffect(() => {
    AsyncStorage.getItem(storageKey).then((val) => {
      if (!val) { setSentCount(0); return; }
      const stored: StoredCount = JSON.parse(val);
      setSentCount(stored.date === todayStr() ? stored.count : 0);
    });
  }, [storageKey]);

  useEffect(() => {
    if (dino && messages.length === 0) {
      setMessages([
        {
          id: "greeting",
          role: "assistant",
          content: `*roars softly* Oh! A human with a tiny glowing rectangle! I'm ${dino.name}. Ask me anything — but make it interesting. 🦖`,
        },
      ]);
    }
  }, [dino]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || !numericId || limitReached) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const newCount = sentCount + 1;
    setSentCount(newCount);
    const stored: StoredCount = { date: todayStr(), count: newCount };
    await AsyncStorage.setItem(storageKey, JSON.stringify(stored));

    try {
      const history = messages
        .filter((m) => m.id !== "greeting")
        .map((m) => ({ role: m.role, content: m.content }));

      const reply = await sendChat(numericId, text, history);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: reply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "ROARR... *connection lost* Try again?",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [input, loading, numericId, messages, sentCount, limitReached, storageKey]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === "user";
    return (
      <View style={[styles.msgRow, isUser ? styles.msgRowRight : styles.msgRowLeft]}>
        {!isUser && <DinoAvatar emoji={emoji} />}
        <View
          style={[
            styles.bubble,
            isUser ? styles.bubbleUser : styles.bubbleDino,
          ]}
        >
          <Text style={styles.bubbleText}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: dinoName,
          headerStyle: { backgroundColor: "#000000" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
          headerRight: () => (
            <View style={styles.headerStatus}>
              <View style={[styles.statusDot, limitReached && styles.statusDotOff]} />
              <Text style={styles.statusText}>{limitReached ? "Sleeping" : "Active now"}</Text>
            </View>
          ),
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.dinoHeader}>
          <View style={styles.dinoHeaderAvatar}>
            <Text style={styles.dinoHeaderEmoji}>{emoji}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.dinoHeaderName}>{dinoName}</Text>
            <Text style={styles.dinoHeaderSub}>
              {dino?.period ?? ""} · {dino?.diet ?? ""}
            </Text>
          </View>
          {!limitReached && (
            <View style={styles.counter}>
              <Text style={styles.counterText}>{remaining} left</Text>
            </View>
          )}
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderMessage}
          contentContainerStyle={[
            styles.messageList,
            { paddingBottom: insets.bottom + 16 },
          ]}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />

        {loading && (
          <View style={styles.typingRow}>
            <DinoAvatar emoji={emoji} />
            <View style={styles.typingBubble}>
              <ActivityIndicator size="small" color="#8E8E8E" />
            </View>
          </View>
        )}

        {limitReached ? (
          <View style={[styles.limitBanner, { paddingBottom: insets.bottom + 12 }]}>
            <Text style={styles.limitEmoji}>💤</Text>
            <Text style={styles.limitTitle}>{dinoName} has gone to sleep</Text>
            <Text style={styles.limitSub}>You've used all {MESSAGE_LIMIT} messages with this dino today. Come back tomorrow — or go chat with another dinosaur!</Text>
          </View>
        ) : (
          <View
            style={[
              styles.inputBar,
              { paddingBottom: insets.bottom || 12 },
            ]}
          >
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder={`Message ${dinoName}...`}
              placeholderTextColor="#4A4A4A"
              returnKeyType="send"
              onSubmitEditing={handleSend}
              multiline
              maxLength={300}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!input.trim() || loading}
              style={styles.sendBtn}
            >
              <Text
                style={[
                  styles.sendBtnText,
                  { color: input.trim() && !loading ? "#0095F6" : "#262626" },
                ]}
              >
                Send
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  dinoHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#1C1C1E",
    gap: 12,
  },
  dinoHeaderAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1C1C1E",
    alignItems: "center",
    justifyContent: "center",
  },
  dinoHeaderEmoji: { fontSize: 26 },
  dinoHeaderName: {
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  dinoHeaderSub: {
    color: "#8E8E8E",
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 1,
  },
  counter: {
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  counterText: {
    color: "#8E8E8E",
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  messageList: {
    paddingHorizontal: 12,
    paddingTop: 16,
    gap: 12,
  },
  msgRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginVertical: 2,
  },
  msgRowLeft: { justifyContent: "flex-start" },
  msgRowRight: { justifyContent: "flex-end" },
  avatarCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#1C1C1E",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarEmoji: { fontSize: 15 },
  bubble: {
    maxWidth: "72%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleUser: {
    backgroundColor: "#0095F6",
    borderBottomRightRadius: 4,
  },
  bubbleDino: {
    backgroundColor: "#1C1C1E",
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    color: "#FFFFFF",
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 21,
  },
  typingRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  typingBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    backgroundColor: "#1C1C1E",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#1C1C1E",
    gap: 10,
    backgroundColor: "#000000",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    maxHeight: 100,
    color: "#FFFFFF",
    borderColor: "#262626",
  },
  sendBtn: { paddingHorizontal: 4 },
  sendBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  headerStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginRight: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3FC45F",
  },
  statusDotOff: {
    backgroundColor: "#4A4A4A",
  },
  statusText: {
    color: "#8E8E8E",
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  limitBanner: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#1C1C1E",
    backgroundColor: "#000000",
    gap: 6,
  },
  limitEmoji: { fontSize: 36, marginBottom: 4 },
  limitTitle: {
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    textAlign: "center",
  },
  limitSub: {
    color: "#8E8E8E",
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
});
