import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { AI_TOOLS, CATEGORIES, AITool } from '@/constants/data';

export default function FoundryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  const filtered = AI_TOOLS.filter(t => {
    const matchCat = activeCategory === 'ALL' || t.category === activeCategory;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const tierColor = (tier: AITool['tier']) => {
    if (tier === 'APEX') return Colors.crimson;
    if (tier === 'ADVANCED') return Colors.cyanPulse;
    return Colors.textSecondary;
  };

  const renderTool = useCallback(({ item }: { item: AITool }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
      onPress={() => router.push(`/tool/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.tierBadge, { borderColor: tierColor(item.tier) }]}>
          <Text style={[styles.tierText, { color: tierColor(item.tier) }]}>{item.tier}</Text>
        </View>
        {item.isNew ? (
          <View style={styles.newBadge}><Text style={styles.newText}>NEW</Text></View>
        ) : null}
      </View>

      <Text style={styles.toolName}>{item.name}</Text>
      <Text style={styles.toolCategory}>{item.category}</Text>
      <Text style={styles.toolDesc} numberOfLines={2}>{item.description}</Text>

      <View style={styles.cardFooter}>
        <View style={styles.powerBar}>
          <View style={[styles.powerFill, { width: `${item.power}%` as any, backgroundColor: tierColor(item.tier) }]} />
        </View>
        <Text style={[styles.powerLabel, { color: tierColor(item.tier) }]}>{item.power}</Text>
        <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
      </View>

      <View style={styles.tagRow}>
        {item.tags.map(tag => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  ), [router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>[ AI APP FOUNDRY ]</Text>
          <Text style={styles.headerTitle}>THE FOUNDRY</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{AI_TOOLS.length}</Text>
          <Text style={styles.countLabel}>TOOLS</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <MaterialIcons name="search" size={18} color={Colors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="SEARCH TOOLS..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
        {search.length > 0 ? (
          <Pressable onPress={() => setSearch('')}>
            <MaterialIcons name="close" size={18} color={Colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map(cat => {
            const isActive = cat === activeCategory;
            return (
              <Pressable
                key={cat}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                  {cat === 'ALL' ? 'ALL TOOLS' : cat.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Tools List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderTool}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="search-off" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>NO TOOLS FOUND</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.void },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerEyebrow: { color: Colors.crimson, fontSize: Typography.xs, fontWeight: Typography.bold, letterSpacing: 2, marginBottom: 2 },
  headerTitle: { color: Colors.textPrimary, fontSize: Typography.xxl, fontWeight: Typography.black, letterSpacing: 4 },
  countBadge: { alignItems: 'center', borderWidth: 1, borderColor: Colors.border, padding: Spacing.sm, borderRadius: Radius.sm },
  countText: { color: Colors.crimson, fontSize: Typography.lg, fontWeight: Typography.black },
  countLabel: { color: Colors.textMuted, fontSize: 9, letterSpacing: 1 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceRaised,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
  },
  searchInput: { flex: 1, color: Colors.textPrimary, fontSize: Typography.sm, letterSpacing: 1 },
  categoryContainer: { height: 52 },
  categoryScroll: { paddingHorizontal: Spacing.md, alignItems: 'center', gap: 8 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
  },
  categoryChipActive: { borderColor: Colors.crimson, backgroundColor: '#1a0000' },
  categoryChipText: { color: Colors.textMuted, fontSize: 10, fontWeight: Typography.bold, letterSpacing: 1 },
  categoryChipTextActive: { color: Colors.crimson },
  list: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, paddingBottom: 100 },
  card: {
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm, gap: 8 },
  tierBadge: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 2 },
  tierText: { fontSize: 9, fontWeight: Typography.black, letterSpacing: 2 },
  newBadge: { backgroundColor: Colors.crimson, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2 },
  newText: { color: '#fff', fontSize: 9, fontWeight: Typography.black, letterSpacing: 1 },
  toolName: { color: Colors.textPrimary, fontSize: Typography.lg, fontWeight: Typography.black, letterSpacing: 2, marginBottom: 2 },
  toolCategory: { color: Colors.textSecondary, fontSize: Typography.xs, letterSpacing: 1, marginBottom: Spacing.sm },
  toolDesc: { color: Colors.textSecondary, fontSize: Typography.sm, lineHeight: Typography.sm * 1.5, marginBottom: Spacing.sm },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.sm },
  powerBar: { flex: 1, height: 3, backgroundColor: Colors.border, borderRadius: 2, overflow: 'hidden' },
  powerFill: { height: 3, borderRadius: 2 },
  powerLabel: { fontSize: Typography.xs, fontWeight: Typography.bold, width: 28, textAlign: 'right' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 2 },
  tagText: { color: Colors.textMuted, fontSize: 9, letterSpacing: 1 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { color: Colors.textMuted, fontSize: Typography.sm, letterSpacing: 2 },
});
