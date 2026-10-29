import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function formatPrice(value) {
  return `$${(Number(value) || 0).toFixed(2)}`;
}

export default function PriceSummary({ itemCount, total, label = 'Tổng cộng' }) {
  return <View style={styles.row}><View><Text style={styles.label}>Số lượng: {itemCount}</Text><Text style={styles.caption}>Chưa bao gồm phí giao hàng</Text></View><View style={styles.right}><Text style={styles.totalLabel}>{label}</Text><Text style={styles.total}>{formatPrice(total)}</Text></View></View>;
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, label: { color: '#303849', fontWeight: '700', fontSize: 15 }, caption: { color: '#98a2b3', fontSize: 11, marginTop: 5 }, right: { alignItems: 'flex-end' }, totalLabel: { color: '#667085', fontSize: 12 }, total: { color: '#5b5ce2', fontSize: 22, fontWeight: '800', marginTop: 3 } });
