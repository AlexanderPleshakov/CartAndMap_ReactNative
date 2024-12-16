import React from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import DeleteButton from './DeleteButton';
import DeferButton from './DeferButton';

import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
   useSharedValue,
   useAnimatedStyle,
   withSpring,
   runOnJS,
} from 'react-native-reanimated';

const ProductCard = ({ item, updateQuantity, removeItem, deferItem, onDragEnd }) => {
   const translateX = useSharedValue(0);

   const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
   }));

   const handleGestureEvent = ({ nativeEvent }) => {
      translateX.value = nativeEvent.translationX;
   };

   const handleDragEnd = () => {
      if (translateX.value > 20) {
         runOnJS(onDragEnd)();
      }
      translateX.value = withSpring(0);
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
                     <Button title="-" onPress={() => updateQuantity(item.id, item.quantity - 1)} />
                     <TextInput
                        style={styles.quantityInput}
                        value={String(item.quantity)}
                        keyboardType="number-pad"
                        onChangeText={(value) => updateQuantity(item.id, parseInt(value, 10) || 1)}
                     />
                     <Button title="+" onPress={() => updateQuantity(item.id, item.quantity + 1)} />

                     <View style={styles.deleteBlock}>
                        <DeleteButton onPress={() => removeItem(item.id)} />
                        <DeferButton onPress={() => deferItem(item.id)} />
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
      gap: 2
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

export default ProductCard;
