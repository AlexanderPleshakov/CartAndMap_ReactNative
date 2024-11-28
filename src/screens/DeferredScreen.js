import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductCard from '../components/ProductCard';

const DeferredScreen = () => {
   const [deferred, setDeferred] = useState([]);

   useEffect(() => {
      const loadDeferred = async () => {
         const storedDeferred = await AsyncStorage.getItem('deferred');
         if (storedDeferred) setDeferred(JSON.parse(storedDeferred));
      };
      loadDeferred();
   }, []);

   useEffect(() => {
      AsyncStorage.setItem('deferred', JSON.stringify(deferred));
   }, [deferred]);

   const updateQuantity = (id, quantity) => {
      setDeferred((prevCart) =>
         prevCart.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
         )
      );
   };

   const moveToDeferred = async (item) => {
      removeItem(item.id);
   };

   const removeItem = (id) => {
      setDeferred((prevCart) => prevCart.filter((item) => item.id !== id));
   };

   return (
      <View style={styles.container}>
         <FlatList
            data={deferred}
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
      </View>
   );
};

const styles = StyleSheet.create({
   container: { flex: 1, padding: 16 },
});

export default DeferredScreen;
