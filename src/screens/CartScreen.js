import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CartItem from '../components/CartItem';
import PriceSummary from '../components/PriceSummary';
import useCart from '../hooks/useCart';

export default function CartScreen({ navigation }) {
  const { cartItems, cartItemCount, cartTotal, increaseQuantity, decreaseQuantity, removeFromCart, isCartReady } = useCart();
  if (!isCartReady) return <View style={styles.screen}><Text style={styles.loading}>Đang khôi phục giỏ hàng...</Text></View>;
  if (!cartItems.length) return <View style={styles.empty}><Text style={styles.bag}>▱</Text><Text style={styles.title}>Giỏ hàng đang trống</Text><Text style={styles.body}>Khám phá các sản phẩm và thêm món bạn yêu thích vào giỏ nhé.</Text><TouchableOpacity style={styles.shop} onPress={() => navigation.navigate('Products')}><Text style={styles.shopText}>Tiếp tục mua sắm</Text></TouchableOpacity></View>;
  return <View style={styles.screen}><FlatList data={cartItems} keyExtractor={(item) => String(item.productId)} renderItem={({ item }) => <CartItem item={item} onIncrease={() => increaseQuantity(item.productId)} onDecrease={() => decreaseQuantity(item.productId)} onRemove={() => removeFromCart(item.productId)} />} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} ListHeaderComponent={<Text style={styles.count}>{cartItems.length} loại sản phẩm</Text>} /><View style={styles.summary}><PriceSummary itemCount={cartItemCount} total={cartTotal} /></View></View>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#f6f7fb' }, list: { padding: 16, paddingBottom: 8 }, count: { color: '#7b8190', fontSize: 12, marginBottom: 12 }, summary: { backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 17, paddingBottom: 22, borderTopLeftRadius: 22, borderTopRightRadius: 22, borderTopWidth: 1, borderColor: '#eff1f5' }, empty: { flex: 1, backgroundColor: '#f6f7fb', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 35 }, bag: { color: '#b8bbca', fontSize: 56, marginBottom: 14 }, title: { color: '#303849', fontSize: 20, fontWeight: '800' }, body: { color: '#828897', textAlign: 'center', lineHeight: 21, marginTop: 9 }, shop: { backgroundColor: '#5b5ce2', paddingHorizontal: 22, paddingVertical: 13, borderRadius: 13, marginTop: 22 }, shopText: { color: '#fff', fontWeight: '700' }, loading: { textAlign: 'center', marginTop: 40, color: '#667085' } });
