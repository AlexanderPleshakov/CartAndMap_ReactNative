import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CartScreen from '../screens/CartScreen';
import DeferredScreen from '../screens/DeferredScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
   return (
      <Tab.Navigator>
         <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'Корзина' }} />
         <Tab.Screen name="Deferred" component={DeferredScreen} options={{ title: 'Отложенные' }} />
      </Tab.Navigator>
   );
};

export default TabNavigator;
