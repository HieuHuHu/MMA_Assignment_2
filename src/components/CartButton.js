import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useCart from '../hooks/useCart';

export default function CartButton({ navigation }) {
  const { cartItemCount } = useCart();
  return <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.button} accessibilityLabel={`Giỏ hàng, ${cartItemCount} sản phẩm`}><Text style={styles.icon}>▱</Text>{cartItemCount > 0 && <View style={styles.badge}><Text style={styles.count}>{cartItemCount > 99 ? '99+' : cartItemCount}</Text></View>}</TouchableOpacity>;
}

const styles = StyleSheet.create({ button: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', marginRight: 6 }, icon: { fontSize: 25, color: '#303849' }, badge: { position: 'absolute', top: 0, right: 0, minWidth: 18, height: 18, paddingHorizontal: 4, borderRadius: 9, backgroundColor: '#e45b68', alignItems: 'center', justifyContent: 'center' }, count: { color: '#fff', fontSize: 10, fontWeight: '800' } });
