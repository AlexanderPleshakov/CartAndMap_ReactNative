import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
   useSharedValue,
   useAnimatedStyle,
   withSpring,
   runOnJS,
} from 'react-native-reanimated';

const ProductItem = ({ item, onDragEnd }) => {
   const translateY = useSharedValue(0);

   const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
   }));

   const handleGestureEvent = ({ nativeEvent }) => {
      translateY.value = nativeEvent.translationY;
   };

   const handleDragEnd = () => {
      if (translateY.value > 150) {
         runOnJS(onDragEnd)(); // Вызываем ], если перетащено достаточно далеко
      }
      translateY.value = withSpring(0); // Возвращаем элемент в исходное положение
   };

   return (
      <PanGestureHandler
         onGestureEvent={handleGestureEvent}
         onEnded={handleDragEnd}
      >
         <Animated.View style={[styles.item, animatedStyle]}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>Цена: {item.price} ₽</Text>
         </Animated.View>
      </PanGestureHandler>
   );
};

const styles = StyleSheet.create({
   item: {
      padding: 16,
      marginBottom: 10,
      backgroundColor: 'lightblue',
      borderRadius: 8,
      borderWidth: 1,
   },
   title: { fontSize: 16, fontWeight: 'bold' },
});

export default ProductItem;
