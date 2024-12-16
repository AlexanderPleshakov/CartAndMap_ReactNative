import React, { useState } from 'react';
import { View, Text, TextInput, Button, Platform, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { YMaps, Map, Placemark } from 'react-yandex-maps';
import { WebView } from 'react-native-webview';

const OrderScreen = () => {
   const [address, setAddress] = useState('');
   const [selectedCoords, setSelectedCoords] = useState([55.751574, 37.573856]); // Координаты по умолчанию: Москва
   const [date, setDate] = useState('');

   // Функция сохранения заказа в AsyncStorage
   const saveOrder = async () => {
      const newOrder = {
         address,
         date,
         coords: selectedCoords,
      };
      try {
         const orders = JSON.parse(await AsyncStorage.getItem('orders')) || [];
         orders.push(newOrder);
         await AsyncStorage.setItem('orders', JSON.stringify(orders));
         alert('Заказ сохранен!');
      } catch (e) {
         console.error('Ошибка сохранения заказа', e);
      }
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
         <TextInput
            style={styles.input}
            value={date}
            placeholder="ГГГГ-ММ-ДД"
            onChangeText={setDate}
         />

         <Button title="Сохранить заказ" onPress={saveOrder} />
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
});

export default OrderScreen;
