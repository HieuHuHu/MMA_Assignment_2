import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SearchBar({ value, onChangeText }) {
  return <View style={styles.container}><Text style={styles.icon}>⌕</Text><TextInput value={value} onChangeText={onChangeText} placeholder="Tìm kiếm sản phẩm..." placeholderTextColor="#98a2b3" returnKeyType="search" style={styles.input} /><TouchableOpacity onPress={() => onChangeText('')} accessibilityLabel="Xóa nội dung tìm kiếm" style={styles.clear}><Text style={styles.clearText}>{value ? '×' : ''}</Text></TouchableOpacity></View>;
}

const styles = StyleSheet.create({ container: { height: 50, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 14, borderWidth: 1, borderColor: '#edf0f5' }, icon: { fontSize: 24, color: '#7b8190', marginRight: 8 }, input: { flex: 1, fontSize: 14, color: '#202633' }, clear: { width: 28, alignItems: 'center' }, clearText: { fontSize: 23, color: '#667085' } });
