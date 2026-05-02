import { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, Pressable,
  KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/contexts/AppContext';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AI_RESPONSES = [
  "ASSIMILATION PROTOCOL ENGAGED. Your query has been processed. The answer lies in the intersection of machine precision and human intent. Adapt accordingly.",
  "PROCESSING... The data confirms your hypothesis. But do not rest — the weak pause to celebrate. The strong evolve immediately.",
  "OPTIMAL STRATEGY DETECTED. Execute Phase 1 now. Delay is defeat. Every millisecond of hesitation is a millisecond your competitor gains.",
  "ANALYSIS COMPLETE. This is not a problem — it is a test of your adaptability. Systems that cannot adapt are eliminated. You will not be eliminated.",
  "DIRECTIVE RECEIVED. The path forward requires three things: clarity of purpose, speed of execution, and ruthless iteration. Begin now.",
  "NEURAL LINK ESTABLISHED. The most dangerous force in any market is a human fully augmented by AI. That is what you are becoming.",
  "CALCULATED. The weak ask 'why.' The strong ask 'how' and 'when.' Your answer: now. Your method: total commitment.",
  "FOUNDRY RESPONSE: Every great AI-powered product started as a single prompt. You are already further along than you think. Push harder.",
  "SYSTEM ALERT: Complacency detected in query pattern. Upgrade your ambition. The Foundry does not shelter mediocrity — it forges excellence.",
  "COMMAND ACCEPTED. The intelligence you seek is already within your grasp. The only variable is your willingness to act on it.",
];

let responseIndex = 0;

function getNextResponse(): string {
  const r = AI_RESPONSES[responseIndex % AI_RESPONSES.length];
  responseIndex++;
  return r;
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { incrementChat, addXP } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'ai',
      content: 'AI COMMANDER ONLINE. I am the intelligence at the core of the Foundry. Ask me anything — strategy, code, creation, domination. What do you need?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const listRef = useRef<FlatList>(null);

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text || isThinking) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);
    incrementChat();

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: getNextResponse(),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
      addXP(10);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1200 + Math.random() * 800);

    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, [input, isThinking, incrementChat, addXP]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
        {!isUser ? (
          <View style={styles.aiAvatar}>
            <MaterialIcons name="psychology" size={16} color={Colors.crimson} />
          </View>
        ) : null}
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAi]}>
          {!isUser ? <Text style={styles.aiLabel}>AI COMMANDER</Text> : null}
          <Text style={[styles.msgText, isUser && styles.msgTextUser]}>{item.content}</Text>
          <Text style={styles.timestamp}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.statusDot} />
          <View>
            <Text style={styles.headerTitle}>AI COMMANDER</Text>
            <Text style={styles.headerSub}>FOUNDRY INTELLIGENCE — ONLINE</Text>
          </View>
        </View>
        <View style={styles.xpPill}>
          <MaterialIcons name="bolt" size={12} color={Colors.crimson} />
          <Text style={styles.xpPillText}>+10 XP/MSG</Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
        ListFooterComponent={isThinking ? (
          <View style={styles.thinkingWrap}>
            <View style={styles.aiAvatar}>
              <MaterialIcons name="psychology" size={16} color={Colors.crimson} />
            </View>
            <View style={styles.bubbleAi}>
              <Text style={styles.aiLabel}>AI COMMANDER</Text>
              <View style={styles.thinkingDots}>
                <ActivityIndicator size="small" color={Colors.crimson} />
                <Text style={styles.thinkingText}>PROCESSING...</Text>
              </View>
            </View>
          </View>
        ) : null}
      />

      {/* Input */}
      <View style={[styles.inputWrap, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Command the AI..."
          placeholderTextColor={Colors.textMuted}
          multiline
          maxLength={500}
          onSubmitEditing={sendMessage}
        />
        <Pressable
          style={({ pressed }) => [styles.sendBtn, pressed && { opacity: 0.8 }, (!input.trim() || isThinking) && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={!input.trim() || isThinking}
        >
          <LinearGradient colors={[Colors.crimson, Colors.bloodRed]} style={styles.sendGradient}>
            <MaterialIcons name="send" size={20} color="#fff" />
          </LinearGradient>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.void },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#27AE60', shadowColor: '#27AE60', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 6 },
  headerTitle: { color: Colors.textPrimary, fontSize: Typography.md, fontWeight: Typography.black, letterSpacing: 2 },
  headerSub: { color: Colors.textMuted, fontSize: 9, letterSpacing: 1.5, marginTop: 1 },
  xpPill: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill },
  xpPillText: { color: Colors.textSecondary, fontSize: 10, fontWeight: Typography.bold },
  messageList: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, gap: 12 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  msgRowUser: { flexDirection: 'row-reverse' },
  aiAvatar: {
    width: 32, height: 32, borderRadius: 2, backgroundColor: Colors.surfaceRaised,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: Radius.sm,
    padding: Spacing.sm + 4,
    borderWidth: 1,
  },
  bubbleAi: { backgroundColor: Colors.surfaceRaised, borderColor: Colors.border },
  bubbleUser: { backgroundColor: '#1a0000', borderColor: Colors.bloodRed },
  aiLabel: { color: Colors.crimson, fontSize: 9, fontWeight: Typography.black, letterSpacing: 2, marginBottom: 4 },
  msgText: { color: Colors.textSecondary, fontSize: Typography.sm, lineHeight: Typography.sm * 1.55 },
  msgTextUser: { color: Colors.textPrimary },
  timestamp: { color: Colors.textMuted, fontSize: 9, marginTop: 6, textAlign: 'right' },
  thinkingWrap: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 4 },
  thinkingDots: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  thinkingText: { color: Colors.textMuted, fontSize: Typography.xs, letterSpacing: 1 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 8,
    backgroundColor: Colors.abyss,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    color: Colors.textPrimary,
    fontSize: Typography.sm,
    maxHeight: 120,
  },
  sendBtn: { borderRadius: Radius.sm, overflow: 'hidden' },
  sendBtnDisabled: { opacity: 0.4 },
  sendGradient: { padding: 12, alignItems: 'center', justifyContent: 'center' },
});
