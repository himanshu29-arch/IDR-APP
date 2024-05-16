import { View, StatusBar,  StyleSheet, SafeAreaView, Pressable } from 'react-native'
import React from 'react'
import { AppColors } from '../../utils/colors'
import MyText from '../../components/customtext'
import CustomIcon from '../../components/customIcon'

export default function Notifications({navigation}) {
    
  return (
    <SafeAreaView style={{backgroundColor: AppColors.white, flex: 1,padding: 10}}>
  <StatusBar backgroundColor={AppColors.white} barStyle={"dark-content"} translucent={false} />
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pressable onPress={() => navigation.goBack()} style={{ padding: 5, borderRadius: 50, borderColor: AppColors.iconsGrey, borderWidth: 1 }}>
          <CustomIcon name='arrow-back' />
        </Pressable>
        <MyText fontType="bold" style={{ marginLeft: 20, fontSize: 20 }}>
          Notifications
        </MyText>
      </View>
      <View style={{ alignItems: 'center', justifyContent:'center', flex: 1}}>
      <MyText>No Notifications</MyText>
      </View>
      
    </SafeAreaView>
  )
}
