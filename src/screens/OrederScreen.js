import React, { useState } from 'react';
import { View, Text, TextInput, Button, Platform, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { YMaps, Map, Placemark } from 'react-yandex-maps';
import { WebView } from 'react-native-webview';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const OrderScreen = ({ route, navigation }) => {
   const { cart, totalAmount } = route.params; // Получаем данные из route.params
   const [address, setAddress] = useState('');
   const [selectedCoords, setSelectedCoords] = useState([55.751574, 37.573856]); // Координаты по умолчанию: Москва
   const [date, setDate] = useState('');
   const [modalVisible, setModalVisible] = useState(false);
   const [orderModal, setOrderModalVisible] = useState(false);
   const [modalMessage, setModalMessage] = useState('');
   const [orderModalMessage, setOrderModalMessage] = useState('');
   const [orderTotal, setOrderTotal] = useState(totalAmount); // Сумма заказа

   // Функция сохранения заказа в AsyncStorage
   const saveOrder = async () => {
      const formattedDeliveryDate = date ? String(date).trim() : '';
      const formattedDeliveryAddress = address.trim();

      if (!formattedDeliveryAddress || !formattedDeliveryDate) {
         setModalMessage('Введите все данные заказа!');
         setModalVisible(true);
         return;
      }

      const newOrder = {
         id: Date.now(),
         address,
         date,
         coords: selectedCoords,
         totalAmount: orderTotal,
         items: cart,
      };

      try {
         const orders = JSON.parse(await AsyncStorage.getItem('orders')) || [];
         orders.push(newOrder);
         const updatedOrders = orders.map((order, index) => ({
            ...order,
            id: order.id || Date.now() + index, // Уникальный ID для старых заказов
         }));

         orders.push(newOrder);
         await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));

         setOrderModalMessage(`Заказ оформлен!\nАдрес: ${address}\nДата доставки: ${date}\nСумма: ${orderTotal} ₽`);
         setOrderModalVisible(true);
      } catch (e) {
         setModalMessage('Ошибка сохранения заказа');
         setModalVisible(true);
         console.error('Ошибка сохранения заказа', e);
      }
   };


   const handleOrdelModalClose = () => {
      setDate(null);
      setAddress('');
      setModalVisible(false);
      navigation.goBack();
   };

   // Обновление координат и адреса при клике на карте
   const onMapClick = async (e) => {
      const coords = e.get('coords');
      setSelectedCoords(coords);

      // Получение адреса через Яндекс Геокодер API
      const response = await fetch(
         `https://geocode-maps.yandex.ru/1.x/?apikey=75c943e7-8ee2-45ea-b24b-b33248c820b8&geocode=${coords[1]},${coords[0]}&format=json`
      );
      const data = await response.json();
      const addressText =
         data.response.GeoObjectCollection.featureMember[0]?.GeoObject?.metaDataProperty?.GeocoderMetaData?.text ||
         'Адрес не найден';
      setAddress(addressText);
   };

   // Компонент карты для web
   const MapWeb = () => (
      <YMaps>
         <Map
            defaultState={{ center: selectedCoords, zoom: 10 }}
            width="100%"
            height="300px"
            onClick={onMapClick}
         >
            <Placemark geometry={selectedCoords} />
         </Map>
      </YMaps>
   );

   // Компонент карты для мобильных платформ
   const MapMobile = () => (
      <WebView
         source={{
            uri: `https://yandex.ru/maps/?ll=${selectedCoords[1]}%2C${selectedCoords[0]}&z=10`,
         }}
         style={{ width: '100%', height: 300 }}
      />
   );

   return (
      <View style={styles.container}>
         <Text style={styles.title}>Оформление заказа</Text>
         {Platform.OS === 'web' ? <MapWeb /> : <MapMobile />}

         <Text style={styles.label}>Адрес доставки:</Text>
         <TextInput
            style={styles.input}
            value={address}
            placeholder="Адрес"
            onChangeText={setAddress}
         />

         <Text style={styles.label}>Дата доставки:</Text>
         <DatePicker
            selected={date}
            placeholderText='yyyy-MM-dd'
            onChange={(date) => setDate(date)}
            dateFormat="yyyy-MM-dd"
         />

         <Text style={styles.label}>Сумма заказа: {orderTotal} ₽</Text>

         <View style={styles.orderButton}>
            <Button title="Сохранить заказ" onPress={saveOrder} />
         </View>

         <Modal
            transparent={true}
            visible={modalVisible}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
         >
            <View style={styles.modalOverlay}>
               <View style={styles.modalContent}>
                  <Text style={styles.modalText}>{modalMessage}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                     <Text style={styles.closeButton}>Закрыть</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </Modal>

         <Modal
            transparent={true}
            visible={orderModal}
            animationType="slide"
            onRequestClose={() => setOrderModalVisible(false)}
         >
            <View style={styles.modalOverlay}>
               <View style={styles.modalContent}>
                  <Text style={styles.modalText}>{orderModalMessage}</Text>
                  <TouchableOpacity onPress={handleOrdelModalClose}>
                     <Text style={styles.closeButton}>Закрыть</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </Modal>
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
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10,
   },
   label: {
      fontSize: 16,
      marginTop: 10,
   },
   input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8,
      borderRadius: 5,
      marginTop: 5,
   },

   orderButton: {
      margin: 20,
   },

   modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
   },
   modalContent: {
      width: 300,
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 8,
      alignItems: 'center',
   },
   modalText: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
   },
   closeButton: {
      fontSize: 16,
      color: 'blue',
      fontWeight: 'bold',
   },
});

export default OrderScreen;
