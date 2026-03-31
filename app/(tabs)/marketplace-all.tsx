import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Colors } from '../../constants/Colors';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { CountdownTimer } from '../../components/CountdownTimer';
import { MarketplaceItem } from '../../constants/types';

export default function MarketplaceAllScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const scheme = isDark ? Colors.dark : Colors.light;
  const { items: itemsParam, currentFilter, categoryName } = useLocalSearchParams<{ 
    items: string; 
    currentFilter: string;
    categoryName: string;
  }>();
  
  // Parse items and convert expiresAt string back to Date object
  const parsedItems: MarketplaceItem[] = itemsParam ? JSON.parse(itemsParam) : [];
  const items: MarketplaceItem[] = parsedItems.map(item => ({
    ...item,
    expiresAt: new Date(item.expiresAt) // Convert string back to Date
  }));
  
  const displayName = categoryName || 'All';

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
            const msg = `Hi! I'd like to claim the surplus "${item.name}" (${item.quantity}) from ${item.messName}. — via MessOptimize`;
            const url = `https://wa.me/${item.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(msg)}`;
            Linking.openURL(url).catch(() => Alert.alert('Cannot open WhatsApp'));
          },
        },
      ]
    );
  }

  const isNgo = user?.role === 'ngo';

  return (
    <View style={[styles.root, { backgroundColor: scheme.background }]}>
      <View style={[styles.header, { borderBottomColor: scheme.border }]}>
        <TouchableOpacity 
          onPress={() => {
            // Go back to marketplace with the current filter
            router.push({
              pathname: '/(tabs)/marketplace',
              params: { filter: currentFilter || 'all' }
            });
          }} 
          style={styles.backButton}
        >
          <Text style={[styles.backText, { color: scheme.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: scheme.text }]}>
          {displayName} Items
        </Text>
        <View style={styles.headerPlaceholder} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.subtitle, { color: scheme.textSecondary }]}>
          Showing {items.length} available item{items.length !== 1 ? 's' : ''}
        </Text>

        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🍽</Text>
            <Text style={[styles.emptyTitle, { color: scheme.textSecondary }]}>No items available</Text>
          </View>
        ) : (
          items.map((item) => (
            <Card key={item.id} style={{ ...styles.itemCard, ...(item.claimedBy ? styles.itemClaimed : {}) }}>
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
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backText: {
    fontSize: 28,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollContent: { padding: 20, paddingBottom: 24 },
  subtitle: { fontSize: 14, marginBottom: 16 },
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
});