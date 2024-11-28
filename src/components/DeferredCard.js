import React from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import DeleteButton from './DeleteButton';
import MoveToCartButton from './MoveToCartButton';

import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
   useSharedValue,
   useAnimatedStyle,
   withSpring,
   runOnJS,
} from 'react-native-reanimated';

const DeferredCard = ({ item, undeferItem, moveToCart, onDragEnd }) => {
   const translateY = useSharedValue(0);

   const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
   }));

   const handleGestureEvent = ({ nativeEvent }) => {
      translateY.value = nativeEvent.translationY;
   };

   const handleDragEnd = () => {
      if (translateY.value > 150) {
         runOnJS(onDragEnd)(); // Вызываем onDragEnd, если перетащено достаточно далеко
      }
      translateY.value = withSpring(0); // Возвращаем элемент в исходное положение
   };

   return (
      <PanGestureHandler
         onGestureEvent={handleGestureEvent}
         onEnded={handleDragEnd}
      >
         <Animated.View style={[animatedStyle]}>
            <View style={styles.card}>
               <View style={styles.actionsBlock}>
                  <View>
                     <Text style={styles.title}>{item.name}</Text>
                     <Text>{item.description}</Text>
                  </View>

                  <Text style={styles.price}>{item.price * item.quantity} ₽</Text>

                  <View style={styles.quantityContainer}>
                     <Text style={styles.quantityInput}>{String(item.quantity)}</Text>

                     <View style={styles.deleteBlock}>
                        <DeleteButton onPress={() => undeferItem(item.id)} />
                        <MoveToCartButton onPress={() => moveToCart(item.id)} />
                     </View>
                  </View>
               </View>
            </View>
         </Animated.View>
      </PanGestureHandler>

   );
};

const styles = StyleSheet.create({
   card: {
      padding: 16,
      marginBottom: 10,
      borderWidth: 1,
      borderRadius: 5,
      alignItems: 'flex-start',
   },

   title: { fontSize: 18, fontWeight: 'bold' },
   price: {
      fontSize: 16,
      fontWeight: 'bold',
      color: "green",
   },

   actionsBlock: {
      width: "100%",
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      marginRight: 10,
      gap: 10,
      justifyContent: 'space-between',
   },

   quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10
   },

   quantityInput: {
      borderWidth: 1,
      padding: 10,
      width: 44,
      textAlign: 'center',
      marginHorizontal: 5,
      borderRadius: 5
   },

   deleteBlock: {
      // padding: 16,
   },

   productInfo: {

   },
});

export default DeferredCard;
