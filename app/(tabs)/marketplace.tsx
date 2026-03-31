import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Colors } from '../../constants/Colors';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { CountdownTimer } from '../../components/CountdownTimer';
import { SAMPLE_MARKETPLACE } from '../../constants/sampleData';
import { ANALYTICS_DATA } from '../../constants/analyticsData';
import { useToast } from '../../components/Toast';
import { MarketplaceItem } from '../../constants/types';

const FILTERS = [
  { id: 'all', label: 'All', emoji: '📦' },
  { id: 'Main Course', label: 'Main', emoji: '🥘' },
  { id: 'Bakery', label: 'Bakery', emoji: '🍞' },
  { id: 'Full Meal', label: 'Full Meal', emoji: '🍚' },
  { id: 'Fruits', label: 'Fruits', emoji: '🍎' },
  { id: 'Fast Food', label: 'Fast Food', emoji: '🍔' },
  { id: 'Beverages', label: 'Beverages', emoji: '🥤' },
];

const ITEMS_PER_PAGE = 4;

export default function MarketplaceScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const scheme = isDark ? Colors.dark : Colors.light;
  const { showToast } = useToast();
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState<MarketplaceItem[]>(SAMPLE_MARKETPLACE);
  const ngoFeed = ANALYTICS_DATA.ngoActivityFeed;

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);
  const displayedItems = filtered.slice(0, ITEMS_PER_PAGE);
  const hasMoreItems = filtered.length > ITEMS_PER_PAGE;

  function handleClaim(item: MarketplaceItem) {
    if (item.claimedBy) {
      Alert.alert('Already Claimed', 'This item has been claimed by another user.');
      return;
    }

    Alert.alert(
      'Claim Food',
      `Do you want to claim "${item.name}" from ${item.messName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Claim & WhatsApp',
          onPress: () => {
            setItems(prev =>
              prev.map(i => i.id === item.id ? { ...i, claimedBy: user?.id || 'user' } : i)
            );
            const msg = `Hi! I'd like to claim the surplus "${item.name}" (${item.quantity}) from ${item.messName}. — via MessOptimize`;
            const url = `https://wa.me/${item.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(msg)}`;
            Linking.openURL(url).catch(() => Alert.alert('Cannot open WhatsApp'));
          },
        },
      ]
    );
  }

  function handleShowMore() {
    // Navigate to the marketplace-all screen with the filtered items and current filter
    router.push({
      pathname: '/(tabs)/marketplace-all',
      params: {
        items: JSON.stringify(filtered),
        currentFilter: filter,
        categoryName: filter === 'all' ? 'All' : filter,
      },
    });
  }

  const isNgo = user?.role === 'ngo';
  const isStaff = user?.role === 'staff';

  return (
    <View style={[styles.root, { backgroundColor: scheme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: scheme.text }]}>🛒 Food Marketplace</Text>
        <Text style={[styles.subtitle, { color: scheme.textSecondary }]}>
          {isStaff ? 'Post surplus food for NGOs to claim' : 'Claim surplus food before it expires'}
        </Text>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          <Card glass style={styles.statChip}>
            <Text style={styles.statEmoji}>📦</Text>
            <Text style={[styles.statVal, { color: scheme.text }]}>{items.length}</Text>
            <Text style={[styles.statLabel, { color: scheme.textMuted }]}>Available</Text>
          </Card>
          <Card glass style={styles.statChip}>
            <Text style={styles.statEmoji}>✅</Text>
            <Text style={[styles.statVal, { color: Colors.success }]}>{items.filter(i => i.claimedBy).length}</Text>
            <Text style={[styles.statLabel, { color: scheme.textMuted }]}>Claimed</Text>
          </Card>
          <Card glass style={styles.statChip}>
            <Text style={styles.statEmoji}>🏪</Text>
            <Text style={[styles.statVal, { color: Colors.info }]}>{new Set(items.map(i => i.messName)).size}</Text>
            <Text style={[styles.statLabel, { color: scheme.textMuted }]}>Messes</Text>
          </Card>
        </View>

        {/* Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f.id}
              onPress={() => setFilter(f.id)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: f.id === filter ? Colors.primary + '15' : scheme.card,
                  borderColor: f.id === filter ? Colors.primary : scheme.border,
                },
              ]}
            >
              <Text style={styles.filterEmoji}>{f.emoji}</Text>
              <Text style={[styles.filterText, { color: f.id === filter ? Colors.primary : scheme.textSecondary }]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Items */}
        {displayedItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🍽</Text>
            <Text style={[styles.emptyTitle, { color: scheme.textSecondary }]}>No items available</Text>
          </View>
        ) : (
          <>
            {displayedItems.map((item, idx) => (
              <Animated.View key={item.id} entering={FadeInDown.delay(idx * 80).springify()}>
                <Card style={{ ...styles.itemCard, ...(item.claimedBy ? styles.itemClaimed : {}) }}>
                  <View style={styles.itemHeader}>
                    <View style={[styles.itemIconWrap, { backgroundColor: Colors.accent + '20' }]}>
                      <Text style={styles.itemEmoji}>{item.imageEmoji}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.itemTitleRow}>
                        <Text style={[styles.itemName, { color: scheme.text }]} numberOfLines={1}>{item.name}</Text>
                        {item.ngoVerified && (
                          <View style={styles.verifiedBadge}>
                            <Text style={styles.verifiedText}>✓ Verified</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.itemMess, { color: scheme.textSecondary }]}>{item.messName}</Text>
                    </View>
                  </View>

                  <View style={styles.itemDetails}>
                    <View style={styles.itemDetail}>
                      <Text style={[styles.detailLabel, { color: scheme.textMuted }]}>Quantity</Text>
                      <Text style={[styles.detailVal, { color: scheme.text }]}>{item.quantity}</Text>
                    </View>
                    <View style={styles.itemDetail}>
                      <Text style={[styles.detailLabel, { color: scheme.textMuted }]}>Category</Text>
                      <Text style={[styles.detailVal, { color: scheme.text }]}>{item.category}</Text>
                    </View>
                    <View style={styles.itemDetail}>
                      <Text style={[styles.detailLabel, { color: scheme.textMuted }]}>Expires in</Text>
                      <CountdownTimer deadline={item.expiresAt} />
                    </View>
                  </View>

                  <Text style={[styles.postedBy, { color: scheme.textMuted }]}>
                    Posted by {item.postedBy}
                  </Text>

                  {item.claimedBy ? (
                    <View style={[styles.claimedBadge, { backgroundColor: Colors.success + '15' }]}>
                      <Text style={styles.claimedText}>✅ Claimed</Text>
                    </View>
                  ) : (
                    <Button
                      title={isNgo ? '🤝 Claim for NGO' : '📱 Claim via WhatsApp'}
                      variant="primary"
                      size="md"
                      onPress={() => handleClaim(item)}
                      style={styles.claimBtn}
                    />
                  )}
                </Card>
              </Animated.View>
            ))}
            
            {/* Show More Button */}
            {hasMoreItems && (
              <TouchableOpacity
                style={[styles.showMoreButton, { backgroundColor: scheme.card, borderColor: scheme.border }]}
                onPress={handleShowMore}
              >
                <Text style={[styles.showMoreText, { color: Colors.primary }]}>
                  Show More ({filtered.length - ITEMS_PER_PAGE} more item{filtered.length - ITEMS_PER_PAGE !== 1 ? 's' : ''})
                </Text>
                <Text style={[styles.showMoreArrow, { color: Colors.primary }]}>→</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* NGO Activity Feed */}
        <Text style={[styles.feedTitle, { color: scheme.text }]}>🤝 Recent Claims</Text>
        <Card glass>
          {ngoFeed.map((item, i) => (
            <View key={item.id} style={[styles.feedRow, i > 0 && { borderTopWidth: 1, borderTopColor: scheme.border }]}>
              <Text style={styles.feedEmoji}>{item.emoji}</Text>
              <View style={{ flex: 1 }}>
                <View style={styles.feedNameRow}>
                  <Text style={[styles.feedNgo, { color: scheme.text }]}>{item.ngoName}</Text>
                  {item.verified && (
                    <View style={styles.feedVerified}>
                      <Text style={styles.feedVerifiedText}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.feedAction, { color: scheme.textSecondary }]}>{item.action}</Text>
              </View>
              <Text style={[styles.feedTime, { color: scheme.textMuted }]}>{item.time}</Text>
            </View>
          ))}
        </Card>

        {/* Impact Counter */}
        <Text style={[styles.feedTitle, { color: scheme.text }]}>🌍 Marketplace Impact</Text>
        <View style={styles.impactRow}>
          <Card glass style={styles.impactChip}>
            <Text style={styles.impactEmoji}>🍽</Text>
            <Text style={[styles.impactVal, { color: Colors.success }]}>380+</Text>
            <Text style={[styles.impactLabel, { color: scheme.textMuted }]}>People Fed</Text>
          </Card>
          <Card glass style={styles.impactChip}>
            <Text style={styles.impactEmoji}>🌱</Text>
            <Text style={[styles.impactVal, { color: Colors.info }]}>25.2kg</Text>
            <Text style={[styles.impactLabel, { color: scheme.textMuted }]}>CO₂ Saved</Text>
          </Card>
        </View>

        {/* Staff Post Form */}
        {isStaff && (
          <Card glass style={styles.staffCta}>
            <Text style={styles.staffCtaEmoji}>📋</Text>
            <Text style={[styles.staffCtaTitle, { color: scheme.text }]}>Post Surplus Food</Text>
            <Text style={[styles.staffCtaDesc, { color: scheme.textSecondary }]}>
              List leftover food for NGOs and students to claim
            </Text>
            <Button
              title="+ Add Listing"
              variant="secondary"
              size="md"
              onPress={() => {
                showToast('📦 New listing posted!', 'success');
              }}
              style={{ marginTop: 12 }}
            />
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 24 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, marginTop: 4, marginBottom: 16 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statChip: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statEmoji: { fontSize: 20, marginBottom: 4 },
  statVal: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 10, fontWeight: '500', marginTop: 2 },

  filterScroll: { marginBottom: 16 },
  filterContent: { gap: 8, paddingRight: 20 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterEmoji: { fontSize: 14 },
  filterText: { fontSize: 13, fontWeight: '600' },

  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '600' },

  itemCard: { marginBottom: 12 },
  itemClaimed: { opacity: 0.7 },
  itemHeader: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  itemIconWrap: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  itemEmoji: { fontSize: 28 },
  itemTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemName: { fontSize: 16, fontWeight: '700', flex: 1 },
  itemMess: { fontSize: 13, marginTop: 2 },
  verifiedBadge: { backgroundColor: Colors.success + '20', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  verifiedText: { fontSize: 10, fontWeight: '700', color: Colors.success },

  itemDetails: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  itemDetail: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  detailLabel: { fontSize: 10, fontWeight: '500', marginBottom: 4 },
  detailVal: { fontSize: 12, fontWeight: '600' },

  postedBy: { fontSize: 11, marginBottom: 12 },
  claimBtn: { width: '100%' },
  claimedBadge: { borderRadius: 14, padding: 14, alignItems: 'center' },
  claimedText: { fontSize: 14, fontWeight: '700', color: Colors.success },

  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
    marginBottom: 16,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
  showMoreArrow: {
    fontSize: 16,
    fontWeight: '600',
  },

  staffCta: { alignItems: 'center', paddingVertical: 28, marginTop: 8 },
  staffCtaEmoji: { fontSize: 40, marginBottom: 8 },
  staffCtaTitle: { fontSize: 18, fontWeight: '700' },
  staffCtaDesc: { fontSize: 13, textAlign: 'center', marginTop: 4 },

  // NGO Feed
  feedTitle: { fontSize: 18, fontWeight: '700', marginTop: 20, marginBottom: 10 },
  feedRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
  feedEmoji: { fontSize: 22 },
  feedNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  feedNgo: { fontSize: 14, fontWeight: '600' },
  feedVerified: { backgroundColor: Colors.success + '20', borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1 },
  feedVerifiedText: { fontSize: 10, fontWeight: '800', color: Colors.success },
  feedAction: { fontSize: 12, marginTop: 2 },
  feedTime: { fontSize: 11 },

  // Impact
  impactRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  impactChip: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  impactEmoji: { fontSize: 24, marginBottom: 4 },
  impactVal: { fontSize: 22, fontWeight: '800' },
  impactLabel: { fontSize: 11, marginTop: 2 },
});