import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CartButton from '../components/CartButton';

const Stack = createNativeStackNavigator();
const headerOptions = ({ navigation }) => ({ headerRight: () => <CartButton navigation={navigation} />, headerTintColor: '#252b38', headerTitleStyle: { fontWeight: '800' }, headerStyle: { backgroundColor: '#f6f7fb' }, headerShadowVisible: false, contentStyle: { backgroundColor: '#f6f7fb' } });

export default function AppNavigator() {
  return <NavigationContainer><Stack.Navigator screenOptions={headerOptions}><Stack.Screen name="Products" component={ProductListScreen} options={{ title: 'Shoply' }} /><Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Chi tiết sản phẩm' }} /><Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Giỏ hàng' }} /></Stack.Navigator></NavigationContainer>;
}
