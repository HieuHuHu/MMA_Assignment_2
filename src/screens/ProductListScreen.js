import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import LoadingView from '../components/LoadingView';
import { getProducts, isAbortError, searchProducts } from '../services/productApi';
import useCart from '../hooks/useCart';

const PAGE_SIZE = 10;
const keyOf = (query) => query.trim().toLowerCase();

export default function ProductListScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const requestRef = useRef(null);
  const stateRef = useRef({ busy: false, skip: 0, total: 0, products: [] });
  const activeQueryRef = useRef('');
  const { addToCart } = useCart();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const loadPage = useCallback(async ({ reset = false, retry = false } = {}) => {
    if (stateRef.current.busy) return;
    const term = activeQueryRef.current;
    const currentSkip = reset || retry ? 0 : stateRef.current.skip;
    if (!reset && !retry && currentSkip >= stateRef.current.total) return;
    stateRef.current.busy = true;
    setError('');
    if (currentSkip === 0) setInitialLoading(true); else setLoadingMore(true);
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const response = term
        ? await searchProducts(term, PAGE_SIZE, currentSkip, controller.signal)
        : await getProducts(PAGE_SIZE, currentSkip, controller.signal);
      if (controller.signal.aborted || activeQueryRef.current !== term) return;
      const merged = currentSkip === 0 ? response.products : [...stateRef.current.products, ...response.products];
      const unique = [...new Map(merged.map((item) => [item.id, item])).values()];
      stateRef.current = { busy: true, skip: currentSkip + response.products.length, total: response.total, products: unique };
      setProducts(unique);
      setTotal(response.total);
      setSkip(currentSkip + response.products.length);
      if (response.products.length === 0 || currentSkip + response.products.length >= response.total) {
        stateRef.current.skip = response.total;
        setSkip(response.total);
      }
    } catch (requestError) {
      if (!isAbortError(requestError) && activeQueryRef.current === term) setError(requestError?.message || 'Không thể tải sản phẩm. Vui lòng thử lại.');
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null;
        stateRef.current.busy = false;
        setInitialLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    activeQueryRef.current = keyOf(debouncedQuery);
    requestRef.current?.abort();
    stateRef.current = { busy: false, skip: 0, total: 0, products: [] };
    setProducts([]); setTotal(0); setSkip(0); setInitialLoading(true); setLoadingMore(false); setError('');
    const timer = setTimeout(() => loadPage({ reset: true }), 0);
    return () => clearTimeout(timer);
  }, [debouncedQuery, loadPage]);

  const loadMore = useCallback(() => {
    if (stateRef.current.busy || stateRef.current.skip >= stateRef.current.total || !stateRef.current.products.length) return;
    loadPage();
  }, [loadPage]);

  const onAdd = useCallback((product) => addToCart(product), [addToCart]);
  const renderItem = useCallback(({ item }) => <ProductCard product={item} onPress={() => navigation.navigate('ProductDetail', { productId: item.id, product: item })} onAddToCart={() => onAdd(item)} />, [navigation, onAdd]);

  return <View style={styles.screen}><View style={styles.searchWrap}><Text style={styles.heading}>Khám phá</Text><Text style={styles.subheading}>Tìm món đồ phù hợp với bạn</Text><SearchBar value={query} onChangeText={setQuery} /></View>{initialLoading ? <LoadingView /> : error && products.length === 0 ? <View style={styles.state}><Text style={styles.stateTitle}>Không thể tải sản phẩm</Text><Text style={styles.stateBody}>{error}</Text><TouchableOpacity style={styles.retry} onPress={() => loadPage({ retry: true })}><Text style={styles.retryText}>Thử lại</Text></TouchableOpacity></View> : products.length === 0 ? <View style={styles.state}><Text style={styles.emptyIcon}>⌕</Text><Text style={styles.stateTitle}>{activeQueryRef.current ? 'Không tìm thấy kết quả' : 'Chưa có sản phẩm'}</Text><Text style={styles.stateBody}>{activeQueryRef.current ? `Không có sản phẩm phù hợp với “${debouncedQuery}”.` : 'Hãy thử tải lại sau ít phút.'}</Text>{error ? <TouchableOpacity style={styles.retry} onPress={() => loadPage({ retry: true })}><Text style={styles.retryText}>Thử lại</Text></TouchableOpacity> : null}</View> : <FlatList data={products} keyExtractor={(item) => String(item.id)} renderItem={renderItem} numColumns={2} columnWrapperStyle={styles.row} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} onEndReached={loadMore} onEndReachedThreshold={0.45} ListHeaderComponent={<Text style={styles.results}>{total} sản phẩm</Text>} ListFooterComponent={loadingMore ? <LoadingView message="Đang tải thêm..." compact /> : error ? <View style={styles.footerError}><Text style={styles.stateBody}>{error}</Text><TouchableOpacity onPress={() => loadPage()}><Text style={styles.link}>Tải lại</Text></TouchableOpacity></View> : <View style={{ height: 12 }} />} />}</View>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: '#f6f7fb' }, searchWrap: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 12 }, heading: { color: '#202633', fontSize: 25, fontWeight: '800' }, subheading: { color: '#8a91a0', fontSize: 13, marginTop: 3, marginBottom: 15 }, list: { paddingHorizontal: 13, paddingBottom: 18 }, row: { gap: 10 }, results: { color: '#7b8190', fontSize: 12, marginHorizontal: 5, marginBottom: 11 }, state: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }, emptyIcon: { fontSize: 40, color: '#c0c4ce', marginBottom: 10 }, stateTitle: { color: '#303849', fontWeight: '800', fontSize: 18, textAlign: 'center' }, stateBody: { color: '#7b8190', textAlign: 'center', lineHeight: 20, marginTop: 8 }, retry: { backgroundColor: '#5b5ce2', paddingHorizontal: 24, paddingVertical: 11, borderRadius: 12, marginTop: 18 }, retryText: { color: '#fff', fontWeight: '700' }, footerError: { alignItems: 'center', padding: 16 }, link: { color: '#5b5ce2', fontWeight: '700', marginTop: 8 } });
