import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderHistoryScreen = () => {
   const [orders, setOrders] = useState([]);

   useEffect(() => {
      fetchOrders();
   }, []);

   useFocusEffect(
      React.useCallback(() => {
         fetchOrders();
      }, [])
   );

   // Загрузка заказов из AsyncStorage
   const fetchOrders = async () => {
      try {
         const storedOrders = JSON.parse(await AsyncStorage.getItem('orders')) || [];
         setOrders(storedOrders);
      } catch (error) {
         Alert.alert('Ошибка', 'Не удалось загрузить историю заказов');
         console.error('Ошибка загрузки данных:', error);
      }
   };

   // Удаление заказа
   const deleteOrder = async (orderId) => {
      try {
         // Фильтруем заказы, исключая удалённый
         const updatedOrders = orders.filter((order) => order.id !== orderId);

         // Сохраняем обновлённый список в AsyncStorage
         await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));

         // Обновляем состояние
         setOrders(updatedOrders);
      } catch (error) {
         Alert.alert('Ошибка', 'Не удалось удалить заказ');
         console.error('Ошибка удаления заказа:', error);
      }
   };

   return (
      <View style={styles.container}>
         <Text style={styles.title}>История заказов</Text>
         <FlatList
            data={orders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
               <View style={styles.orderItem}>
                  <Text>Номер заказа: {item.id}</Text>
                  <Text>Адрес: {item.address}</Text>
                  <Text>Дата доставки: {item.date}</Text>
                  <Text>Сумма: {item.totalAmount}</Text>
                  <View style={styles.deleteButton}>
                     <Button title="Удалить" color="red" onPress={() => deleteOrder(item.id)} />
                  </View>

               </View>
            )}
         />
      </View>
   );
};

const styles = StyleSheet.create({
   container: { flex: 1, padding: 16 },
   title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
   orderItem: { borderBottomWidth: 1, paddingVertical: 8 },
   deleteButton: { margin: 10, },
});

export default OrderHistoryScreen;
