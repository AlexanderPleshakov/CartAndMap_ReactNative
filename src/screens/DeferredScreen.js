import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeferredCard from '../components/DeferredCard';

const DeferredScreen = () => {
   const [deferred, setDeferred] = useState([]);

   const loadDeferred = async () => {
      const storedDeferred = await AsyncStorage.getItem('deferred');
      if (storedDeferred) {
         const parsedDeferred = JSON.parse(storedDeferred);
         console.log('Loaded deferred:', parsedDeferred); // Проверка данных
         const validatedDeferred = parsedDeferred.map((item, index) => ({
            ...item,
            id: item.id || index, // Гарантия уникальных `id`
         }));
         setDeferred(validatedDeferred);
      }
   };

   useEffect(() => {
      loadDeferred();
   }, []);

   useFocusEffect(
      React.useCallback(() => {
         loadDeferred();
      }, [])
   );

   useEffect(() => {
      AsyncStorage.setItem('deferred', JSON.stringify(deferred));
   }, [deferred]);

   const undefer = async (item) => {
      removeItem(item.id);
   };

   const removeItem = (id) => {
      setDeferred((prevCart) => prevCart.filter((item) => item.id !== id));
   };

   const moveToCart = async (item) => {

      removeItem(item.id);
      console.log(deferred)

      const storedCart = await AsyncStorage.getItem('cart');
      const cart = storedCart ? JSON.parse(storedCart) : [];
      const newCartItem = { ...item, id: item.id || Date.now() };
      await AsyncStorage.setItem('cart', JSON.stringify([...cart, newCartItem]));
   };

   return (
      <View style={styles.container}>
         <FlatList
            data={deferred}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
               <DeferredCard
                  item={item}
                  undeferItem={removeItem}
                  moveToCart={() => moveToCart(item)}
                  onDragEnd={() => undefer(item)}
               />
            )}
         />
      </View>
   );
};

const styles = StyleSheet.create({
   container: { flex: 1, padding: 16 },
});

export default DeferredScreen;
