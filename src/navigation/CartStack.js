import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CartScreen from '../screens/CartScreen';
import OrederScreen from '../screens/OrederScreen';

const Stack = createNativeStackNavigator();

const CartStack = () => {
   return (
      <Stack.Navigator initialRouteName="CartScreen">
         <Stack.Screen
            name="CartScreen"
            component={CartScreen}
            options={{ title: 'Корзина' }}
         />
         <Stack.Screen
            name="OrederScreen"
            component={OrederScreen}
            options={{ title: 'Оформление заказа' }}
         />
      </Stack.Navigator>
   );
};

export default CartStack;
