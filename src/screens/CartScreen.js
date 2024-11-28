import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductCard from '../components/ProductCard';

const CartScreen = () => {
   const [cart, setCart] = useState([]);
   const [promoCode, setPromoCode] = useState('');
   const [discount, setDiscount] = useState(0);

   useEffect(() => {
      const loadCart = async () => {
         const storedCart = await AsyncStorage.getItem('cart');
         if (storedCart) setCart(JSON.parse(storedCart));
      };
      loadCart();
   }, []);

   useEffect(() => {
      AsyncStorage.setItem('cart', JSON.stringify(cart));
   }, [cart]);

   const addItemToCart = (item) => {
      setCart((prevCart) => [...prevCart, item]);
   };

   const updateQuantity = (id, quantity) => {
      setCart((prevCart) =>
         prevCart.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
         )
      );
   };

   const moveToDeferred = async (item) => {
      removeItem(item.id);
      const storedDeferred = await AsyncStorage.getItem('deferred');
      const deferred = storedDeferred ? JSON.parse(storedDeferred) : [];
      await AsyncStorage.setItem('deferred', JSON.stringify([...deferred, item]));
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
                  deferItem={moveToDeferred}
                  onDragEnd={() => moveToDeferred(item)}
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
         <Button
            title="Добавить новый товар"
            onPress={() => addItemToCart({ id: Date.now(), name: 'Новый товар', description: 'Описание', price: 400, quantity: 1 })}
         />
      </View>
   );
};

const styles = StyleSheet.create({
   container: { flex: 1, padding: 16 },
   input: { borderWidth: 1, marginVertical: 10, padding: 8 },
   total: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
});

export default CartScreen;
