import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

const DeleteButton = ({ onPress }) => {
   return (
      <TouchableOpacity style={styles.button} onPress={onPress}>
         <Image source={require('../../assets/trash.png')} style={styles.icon} />
      </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
   button: {
      padding: 12,
   },
   icon: {
      width: 32, // Размер изображения
      height: 32,
   },
});

export default DeleteButton;
