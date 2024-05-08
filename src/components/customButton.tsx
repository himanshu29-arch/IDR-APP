import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import MyText from './customtext';
import { AppColors } from '../utils/colors';
type props = {
    isdisabled?: boolean;
    title: string;
    onPress: () => void;
}
export default function CustomButton({isdisabled, title, onPress}: props) {
  return (
    <>
      {
        isdisabled ?
        <View style={[styles.container, {backgroundColor: AppColors.iconsGrey}]}>
            <MyText fontType="InterBold" style={styles.txt}>{title}</MyText>
        </View>
        :
        <TouchableOpacity style={[styles.container, {backgroundColor: AppColors.primary}]} onPress={onPress}>
           <MyText fontType="InterBold" style={styles.txt}>{title}</MyText>
        </TouchableOpacity>
      }
    </>
  )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        // marginTop: 30

    },
    txt: {
        fontSize: 14,
        color: AppColors.white
    }
})