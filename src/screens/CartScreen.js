import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductCard from '../components/ProductCard';

const CartScreen = ({ navigation }) => {
   const [cart, setCart] = useState([]);
   const [promoCode, setPromoCode] = useState('');
   const [discount, setDiscount] = useState(0);

   const loadCart = async () => {
      const storedCart = await AsyncStorage.getItem('cart');
      if (storedCart) {
         const parsedCart = JSON.parse(storedCart);
         console.log('Loaded cart:', parsedCart);
         const validatedCart = parsedCart.map((item, index) => ({
            ...item,
            id: item.id || index,
         }));
         setCart(validatedCart);
      }
   };

   useEffect(() => {
      loadCart();
   }, []);

   useFocusEffect(
      React.useCallback(() => {
         loadCart();
      }, [])
   );

   useEffect(() => {
      AsyncStorage.setItem('cart', JSON.stringify(cart));
   }, [cart]);

   const updateQuantity = (id, quantity) => {
      setCart((prevCart) =>
         prevCart.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
         )
      );
   };

   const handleCheckout = () => {
      const totalAmount = calculateTotal().toFixed(2);
      navigation.navigate("OrderScreen", { cart, totalAmount });
   };


   const moveToDeferred = async (item) => {
      removeItem(item.id);
      const storedDeferred = await AsyncStorage.getItem('deferred');
      const deferred = storedDeferred ? JSON.parse(storedDeferred) : [];
      const newDeferredItem = { ...item, id: item.id || Date.now() }; // Уникальный `id`
      await AsyncStorage.setItem('deferred', JSON.stringify([...deferred, newDeferredItem]));
   };


   const removeItem = (id) => {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
   };

   const calculateTotal = () =>
      cart.reduce((total, item) => total + item.price * item.quantity, 0) * (1 - discount);

   const applyPromoCode = () => {
      if (promoCode === 'DISCOUNT10') setDiscount(0.1);
      else setDiscount(0);
   };

   return (
      <View style={styles.container}>
         <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
               <ProductCard
                  item={item}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                  deferItem={() => moveToDeferred({ id: item.id, name: item.name, description: item.description, price: item.price, quantity: item.quantity })}
                  onDragEnd={() => moveToDeferred({ id: item.id, name: item.name, description: item.description, price: item.price, quantity: item.quantity })}
               />
            )}
         />
         <TextInput
            placeholder="Промокод"
            style={styles.input}
            value={promoCode}
            onChangeText={setPromoCode}
         />
         <Button title="Применить" onPress={applyPromoCode} />
         <Text style={styles.total}>Итоговая стоимость: {calculateTotal().toFixed(2)} ₽</Text>
         <Button title="Оформить заказ" onPress={handleCheckout} />
      </View>
   );
};

const styles = StyleSheet.create({
   container: { flex: 1, padding: 16 },
   input: { borderWidth: 1, marginVertical: 10, padding: 8 },
   total: { fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 10 },
});

export default CartScreen;
