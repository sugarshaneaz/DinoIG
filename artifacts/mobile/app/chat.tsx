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
import { useGetDinosaur } from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { getRealisticImageUrl } from "@/lib/realisticImages";
import { resolveImageUrl } from "@/lib/resolveImageUrl";

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

function DinoAvatar({ name, emoji }: { name: string; emoji: string }) {
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
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const numericId = parseInt(id ?? "0", 10);

  const { data: dino } = useGetDinosaur(numericId, {
    query: { enabled: !!numericId },
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const emoji = getDinoEmoji(dino?.diet);
  const dinoName = dino?.name ?? "Dinosaur";

  useEffect(() => {
    if (dino && messages.length === 0) {
      const greeting: Message = {
        id: "greeting",
        role: "assistant",
        content: `*roars softly* Oh! A human with a tiny glowing rectangle! I'm ${dino.name}. Ask me anything — but make it interesting. 🦖`,
      };
      setMessages([greeting]);
    }
  }, [dino]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || !numericId) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== "greeting")
        .map((m) => ({ role: m.role, content: m.content }));

      const reply = await sendChat(numericId, text, history);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
      };
      setMessages((prev) => [...prev, assistantMsg]);
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
  }, [input, loading, numericId, messages]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === "user";
    return (
      <View style={[styles.msgRow, isUser ? styles.msgRowRight : styles.msgRowLeft]}>
        {!isUser && <DinoAvatar name={dinoName} emoji={emoji} />}
        <View
          style={[
            styles.bubble,
            isUser
              ? [styles.bubbleUser, { backgroundColor: "#0095F6" }]
              : [styles.bubbleDino, { backgroundColor: "#1C1C1E" }],
          ]}
        >
          <Text style={[styles.bubbleText, { color: "#FFFFFF" }]}>{item.content}</Text>
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
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Active now</Text>
            </View>
          ),
        }}
      />
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: "#000000" }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Dino header */}
        <View style={[styles.dinoHeader, { borderBottomColor: "#1C1C1E" }]}>
          <View style={styles.dinoHeaderAvatar}>
            <Text style={styles.dinoHeaderEmoji}>{emoji}</Text>
          </View>
          <View>
            <Text style={styles.dinoHeaderName}>{dinoName}</Text>
            <Text style={styles.dinoHeaderSub}>{dino?.period ?? ""} · {dino?.diet ?? ""}</Text>
          </View>
        </View>

        {/* Messages */}
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
            <DinoAvatar name={dinoName} emoji={emoji} />
            <View style={[styles.typingBubble, { backgroundColor: "#1C1C1E" }]}>
              <ActivityIndicator size="small" color="#8E8E8E" />
            </View>
          </View>
        )}

        {/* Input bar */}
        <View
          style={[
            styles.inputBar,
            {
              borderTopColor: "#1C1C1E",
              paddingBottom: insets.bottom || 12,
              backgroundColor: "#000000",
            },
          ]}
        >
          <TextInput
            style={[styles.input, { color: "#FFFFFF", borderColor: "#262626" }]}
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
                { color: input.trim() && !loading ? "#0095F6" : "#1C1C1E" },
              ]}
            >
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dinoHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  dinoHeaderEmoji: {
    fontSize: 26,
  },
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
  msgRowLeft: {
    justifyContent: "flex-start",
  },
  msgRowRight: {
    justifyContent: "flex-end",
  },
  avatarCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#1C1C1E",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarEmoji: {
    fontSize: 15,
  },
  bubble: {
    maxWidth: "72%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
  },
  bubbleDino: {
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
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
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 10,
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
  },
  sendBtn: {
    paddingHorizontal: 4,
  },
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
  statusText: {
    color: "#8E8E8E",
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
});
