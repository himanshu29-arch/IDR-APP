import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'
import { AppColors } from '../utils/colors';
import MyText from './customtext';
import CustomIcon from './customIcon';

type props= {
    label?: string;
    placeholder: string;
    value: string;
    onChangeText: (txt:string) => void;
    isOutline?: boolean;
    rightIcon?:string;
    leftIcon?:string;
    onRighticonPress?: () => void;
    onLefticonPress?: () => void;
    secureTextEntry?: boolean;
}
export default function CustomInput({
  label,placeholder, value,onChangeText,isOutline, 
  rightIcon,leftIcon, onRighticonPress, onLefticonPress,
  secureTextEntry
}: props) {
  return (
    <View style={{  width: '100%',alignSelf: 'center'}}>
        {
            label && <MyText style={{marginVertical:5, color : isOutline ? AppColors.iconsGrey : AppColors.black}}>{label}</MyText>
        }
      <View style={[styles.viewcontainer, !isOutline? styles.outlined : styles.notoutlined]}>
       {
        leftIcon && 
        <CustomIcon 
        name={leftIcon}
        color={AppColors.iconsGrey}
        onPress={onLefticonPress}
         />
       }
      <TextInput
       placeholder={placeholder}
       value={value}
       onChangeText={onChangeText}
       style={[styles.default]}
       secureTextEntry={secureTextEntry}
      />
       {
        rightIcon && 
        <CustomIcon 
        name={rightIcon}
        color={AppColors.iconsGrey}
        onPress={onRighticonPress}
         />
       }
     </View> 
    </View>
  )
}

const styles = StyleSheet.create({
    default : {
        width: '85%',
        borderRadius: 5,
        
        padding: 10
       },
       outlined: {
        borderWidth: 1,
        borderRadius: 10
       },
       notoutlined: {
        borderBottomWidth: 1,
       },
       viewcontainer: {
        flexDirection: 'row', alignItems: 'center',
        borderColor: AppColors.darkgrey,
       }
})