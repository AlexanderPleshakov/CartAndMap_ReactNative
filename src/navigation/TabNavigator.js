import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text } from 'react-native';
import CartStack from './CartStack';
import DeferredScreen from '../screens/DeferredScreen';
import AddProductScreen from '../screens/AddProductScreen';

const Tab = createBottomTabNavigator();


const TabNavigator = () => {
   return (
      <Tab.Navigator
         screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
               let iconName;

               if (route.name === 'Корзина') {
                  return (
                     <Image
                        source={require('../../assets/cart-icon.png')}
                        style={{ width: size, height: size, tintColor: focused ? 'blue' : 'gray' }}
                     />
                  );
               } else if (route.name === 'Отложенные') {
                  return (
                     <Image
                        source={require('../../assets/clock.png')}
                        style={{ width: size, height: size, tintColor: focused ? 'blue' : 'gray' }}
                     />
                  );
               } else if (route.name === 'Добавить') {
                  return (
                     <Image
                        source={require('../../assets/add-product-icon.png')}
                        style={{ width: size, height: size, tintColor: focused ? 'blue' : 'gray' }}
                     />
                  );
               }
            },
            tabBarLabel: ({ focused }) => (
               <Text style={{ fontSize: 10, color: focused ? 'blue' : 'gray' }}>
                  {route.name}
               </Text>
            ),
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: { height: 60 },
         })}
      >
         <Tab.Screen name="Корзина" component={CartStack} options={{ headerShown: false }} />
         <Tab.Screen name="Отложенные" component={DeferredScreen} options={{ title: 'Отложенные' }} />
         <Tab.Screen name="Добавить" component={AddProductScreen} />
      </Tab.Navigator>
   );
};

export default TabNavigator;
