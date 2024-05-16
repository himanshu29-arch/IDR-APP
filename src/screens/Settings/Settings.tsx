import { View, Text, StatusBar, Image, StyleSheet, FlatList, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ImagePaths } from '../../utils/imagepaths'
import { AppColors } from '../../utils/colors'
import MyText from '../../components/customtext'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../utils/Dimensions'
import CustomIcon from '../../components/customIcon'
import { ShadowStyle } from '../../utils/constants'
import CustomButton from '../../components/customButton'
import { signOut } from '../../redux/slices/authSlice'
import { useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Settngs({navigation}) {
const dispatch = useDispatch()
const Logout = () => {
  AsyncStorage.removeItem("persist:root").then(() => {
    dispatch(signOut())
  });
  
}
  return (
    <SafeAreaView style={{backgroundColor: AppColors.white, flex: 1}}>
      <StatusBar translucent />
      <View>
        <StatusBar translucent backgroundColor='transparent' />
        <View style={styles.blueContainer}>
          <Image
            source={ImagePaths.TOPCIRCLE}
            style={{ width: 190, marginTop: -65, position: 'absolute' }}
            resizeMode="contain"
          />
          <View style={styles.mainRow}>
              <View style={{ marginLeft: 10 }}>
                <MyText fontType="bold" style={{
                  fontSize: 22,
                  color: AppColors.white,
                }}>
                  Settings
                </MyText>
              </View>

            <View style={[styles.AC]}>
            <CustomIcon name='notifications-outline' onPress={() => navigation.navigate("Notifications")}/>
            </View>
          </View>
        </View>
        {/* Card */}

        <View style={[styles.card, { marginTop: -SCREEN_HEIGHT * 0.2 }, ShadowStyle]}>
         <MyText fontType="medium" style={{color: AppColors.grey, fontSize: 16}}>
         Account settings
         </MyText>
         {
          ["Privacy Policy", "Terms & conditions", "Change password"].map((i) => 
          <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15}}>
            <MyText style={{fontSize: 14}}>{i}</MyText>
            <CustomIcon name='arrow-forward'/>
          </TouchableOpacity>)
         }
         <CustomButton
          title='Logout'
          onPress={() => Logout()}
         />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  blueContainer: {
    backgroundColor: AppColors.primary,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingBottom: 30,
    height: SCREEN_HEIGHT*0.4
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    marginTop: StatusBar.currentHeight,
    // backgroundColor:'red'
    padding: 20,
  },
  AC: {
    backgroundColor: AppColors.white,
    borderRadius: 50,
    height: 40, width: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.primary,
    backgroundColor: AppColors.white,
    borderRadius: 50,
    padding: 8
  },
  card: {
    backgroundColor: AppColors.white,
    width: SCREEN_WIDTH * 0.9,
    alignSelf: 'center',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10

  },
  assigncontainer: {
    height: 120,
    width: SCREEN_WIDTH * 0.35,
    backgroundColor: AppColors.lightgrey,
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
    justifyContent: 'center'
  },
  opentasks: {
    color: AppColors.darkgreyColor,
    backgroundColor: AppColors.darkgrey,
    borderRadius: 30, padding: 10,
  }

})