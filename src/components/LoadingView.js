import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function LoadingView({ message = 'Đang tải sản phẩm...', compact = false }) {
  return <View style={[styles.container, compact && styles.compact]}><ActivityIndicator size="large" color="#5b5ce2" /><Text style={styles.text}>{message}</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, minHeight: 180, alignItems: 'center', justifyContent: 'center', gap: 12 }, compact: { minHeight: 64, flexDirection: 'row' }, text: { color: '#667085', fontSize: 14 } });
