import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LoadingView from '../components/LoadingView';
import { formatPrice } from '../components/PriceSummary';
import { getProductById, isAbortError } from '../services/productApi';
import useCart from '../hooks/useCart';

export default function ProductDetailScreen({ route }) {
  const { productId, product: initialProduct } = route.params;
  const [product, setProduct] = useState(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (initialProduct?.description) return undefined;
    const controller = new AbortController();
    getProductById(productId, controller.signal).then(setProduct).catch((err) => {
      if (!isAbortError(err)) setError(err?.message || 'Không thể tải chi tiết sản phẩm.');
    }).finally(() => setLoading(false));
    return () => controller.abort();
  }, [productId, initialProduct]);

  if (loading) return <LoadingView />;
  if (!product) return <View style={styles.state}><Text style={styles.title}>Không thể tải sản phẩm</Text><Text style={styles.body}>{error || 'Thông tin sản phẩm chưa sẵn sàng.'}</Text></View>;
  const image = product.images?.[0] || product.thumbnail;
  const onAdd = () => {
    addToCart(product);
    setFeedback(true);
    setTimeout(() => setFeedback(false), 1800);
  };

  return <View style={styles.screen}><ScrollView contentContainerStyle={styles.content}><View style={styles.imageBox}>{image ? <Image source={{ uri: image }} resizeMode="contain" style={styles.image} /> : <Text style={styles.noImage}>Không có ảnh sản phẩm</Text>}</View><View style={styles.info}><View style={styles.chips}><Text style={styles.category}>{product.category || 'Sản phẩm'}</Text>{product.brand ? <Text style={styles.brand}>{product.brand}</Text> : null}</View><Text style={styles.title}>{product.title || 'Sản phẩm'}</Text><View style={styles.priceRow}><Text style={styles.price}>{formatPrice(product.price)}</Text><Text style={styles.rating}>★ {Number(product.rating || 0).toFixed(1)} / 5</Text></View><Text style={styles.section}>Mô tả</Text><Text style={styles.description}>{product.description || 'Chưa có mô tả cho sản phẩm này.'}</Text><View style={styles.facts}>{product.stock != null ? <Fact label="Tình trạng" value={product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'} /> : null}{product.discountPercentage != null ? <Fact label="Ưu đãi" value={`Giảm ${Number(product.discountPercentage).toFixed(1)}%`} /> : null}{product.warrantyInformation ? <Fact label="Bảo hành" value={product.warrantyInformation} /> : null}{product.shippingInformation ? <Fact label="Giao hàng" value={product.shippingInformation} /> : null}</View></View></ScrollView><View style={styles.bottom}>{feedback ? <Text style={styles.feedback}>✓ Đã thêm vào giỏ hàng</Text> : null}<TouchableOpacity activeOpacity={0.8} onPress={onAdd} style={styles.add}><Text style={styles.addText}>＋  Thêm vào giỏ hàng</Text></TouchableOpacity></View></View>;
}

function Fact({ label, value }) { return <View style={styles.fact}><Text style={styles.factLabel}>{label}</Text><Text style={styles.factValue}>{value}</Text></View>; }

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#f6f7fb' }, content: { padding: 18, paddingBottom: 28 }, imageBox: { height: 300, backgroundColor: '#fff', borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#eff1f5' }, image: { width: '90%', height: '90%' }, noImage: { color: '#98a2b3' }, info: { paddingTop: 20 }, chips: { flexDirection: 'row', gap: 8 }, category: { backgroundColor: '#ededff', color: '#5b5ce2', overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, fontSize: 11, fontWeight: '700', textTransform: 'capitalize' }, brand: { color: '#667085', backgroundColor: '#fff', overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, fontSize: 11 }, title: { color: '#202633', fontSize: 23, fontWeight: '800', lineHeight: 30, marginTop: 12 }, priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }, price: { color: '#5b5ce2', fontWeight: '800', fontSize: 25 }, rating: { color: '#737989', fontWeight: '600' }, section: { color: '#303849', fontWeight: '800', fontSize: 16, marginTop: 24, marginBottom: 8 }, description: { color: '#737989', fontSize: 14, lineHeight: 22 }, facts: { marginTop: 17, backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 14 }, fact: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f2f5' }, factLabel: { color: '#8a91a0', fontSize: 12 }, factValue: { color: '#303849', fontSize: 12, fontWeight: '600', maxWidth: '60%', textAlign: 'right' }, bottom: { paddingHorizontal: 18, paddingVertical: 12, paddingBottom: 18, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eff1f5' }, add: { height: 50, backgroundColor: '#5b5ce2', borderRadius: 15, alignItems: 'center', justifyContent: 'center' }, addText: { color: '#fff', fontSize: 15, fontWeight: '800' }, feedback: { textAlign: 'center', color: '#24835a', fontSize: 12, fontWeight: '700', marginBottom: 8 }, state: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 }, body: { color: '#737989', marginTop: 10, textAlign: 'center' } });
