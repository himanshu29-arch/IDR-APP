import React, { Dispatch, SetStateAction, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Pressable, ScrollView, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import MyText from './customtext';
import { AppColors } from '../utils/colors';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/Dimensions';

type styleprops = {
    ViewStyles : ViewStyle;
    TextStyle: TextStyle;
    ImageStyle: ImageStyle
}
type props = {
  options: string[];
  onSelect: Dispatch<SetStateAction<string>>;
  defaultOption?: string;
  style?: styleprops;
  label?: string;
  isDisabled?:boolean;
  isDarker?:boolean
}
const CustomDropdown = ({ options, onSelect, defaultOption,isDarker, label, isDisabled }: props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultOption);

  const toggleDropdown = () => {
    if(!isDisabled){
      setIsVisible(!isVisible);
    }
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsVisible(false);
  };

  return (
    <View>
     {label && (
      <MyText
      fontType='bold'
        style={{
          fontSize: 16,
          marginVertical: 10,
          color: AppColors.black,
        }}
      >
        {label}
      </MyText>
    )}
    <View style={styles.container}>
      <TouchableOpacity style={isDarker ? styles.anotherC : styles.mainc} onPress={toggleDropdown}>
        <MyText fontType="medium" style={isDarker ? styles.anothertxt : styles.maintxt}>{selectedOption}</MyText>
      
       <Ionicons size={25} color={AppColors.black} name="chevron-down" />
      </TouchableOpacity>
    {isVisible && (
        <FlatList 
       nestedScrollEnabled
        data={options}
        style={styles.optionsContainer}
        renderItem={({item, index}) => 
          <TouchableOpacity
        key={index}
        style={styles.option}
        onPress={() => handleSelectOption(item)}
      >
        <MyText fontType="medium">{item}</MyText>
      </TouchableOpacity>}
        />
      )}
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  header: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 16,
  },
  optionsContainer: {
    position: 'absolute',
    top: 50,
    right: 0,
    left: 0,
    borderWidth: 1,
    borderColor: AppColors.darkgreyColor,
    borderRadius: 5,
    backgroundColor: 'white',
    zIndex: 1,
    height: SCREEN_HEIGHT * 0.1
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.darkgreyColor,
  },
  mainc: {
    width: SCREEN_WIDTH*0.8,
    padding: 10,
    flexDirection:'row',
    justifyContent: 'space-between',
    borderColor: AppColors.darkgrey,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10
  },
  anotherC: {
    width: SCREEN_WIDTH*0.8,
    padding: 10,
    flexDirection:'row',
    justifyContent: 'space-between',
    borderRadius: 20,
    backgroundColor: AppColors.lightgrey,
    marginTop: 10
  },
  maintxt: {
    color: AppColors.darkgreyColor
  },
  anothertxt:{
    color: AppColors.darkgreyColor
  }
});

export default CustomDropdown;
