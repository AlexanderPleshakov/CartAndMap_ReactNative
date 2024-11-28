import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

const MoveToCartButton = ({ onPress }) => {
   return (
      <TouchableOpacity style={styles.button} onPress={onPress}>
         <Image source={require('../../assets/cart-plus.png')} style={styles.icon} />
      </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
   button: {
      padding: 12,
   },
   icon: {
      width: 32,
      height: 32,
   },
});

export default MoveToCartButton;