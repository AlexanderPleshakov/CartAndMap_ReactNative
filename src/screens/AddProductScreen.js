import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddProductScreen = () => {
   const [name, setName] = useState('');
   const [description, setDescription] = useState('');
   const [price, setPrice] = useState('');

   const addToCart = async () => {
      if (!name || !description || !price) {
         Alert.alert('Ошибка', 'Заполните все поля!');
         return;
      }

      try {
         const parsedPrice = parseFloat(price);
         if (isNaN(parsedPrice) || parsedPrice <= 0) {
            Alert.alert('Ошибка', 'Введите корректную цену!');
            return;
         }

         const newItem = {
            id: Date.now(),
            name,
            description,
            price: parsedPrice,
            quantity: 1,
         };

         const storedCart = await AsyncStorage.getItem('cart');
         const cart = storedCart ? JSON.parse(storedCart) : [];

         const updatedCart = [...cart, newItem];
         await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));

         setName('');
         setDescription('');
         setPrice('');

         Alert.alert('Успех', 'Товар добавлен в корзину!');
      } catch (error) {
         console.error('Ошибка добавления товара в корзину:', error);
         Alert.alert('Ошибка', 'Не удалось добавить товар в корзину.');
      }
   };

   return (
      <View style={styles.container}>
         <Text style={styles.title}>Добавление товара</Text>

         <TextInput
            placeholder="Название товара"
            style={styles.input}
            value={name}
            onChangeText={setName}
         />
         <TextInput
            placeholder="Описание товара"
            style={styles.input}
            value={description}
            onChangeText={setDescription}
         />
         <TextInput
            placeholder="Цена товара"
            style={styles.input}
            value={price}
            keyboardType="numeric"
            onChangeText={setPrice}
         />

         <Button title="Добавить в корзину" onPress={addToCart} />
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
   },
   title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
   },
   input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8,
      marginBottom: 16,
      borderRadius: 4,
   },
});

export default AddProductScreen;
