import { View, Text, SafeAreaView, StyleSheet, StatusBar } from 'react-native'
import React, { useState } from 'react'
import CustomInput from '../../components/customInput'
import MyText from '../../components/customtext'
import { ImagePaths } from '../../utils/imagepaths'
import { Image } from 'react-native'
import { AppColors } from '../../utils/colors'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../utils/Dimensions'
import CustomIcon from '../../components/customIcon'
import CustomButton from '../../components/customButton'

export default function Login() {
  const [login, setLogin] = useState({
    email: '',
    password: ''
  })
  const [ischeck, setIsCheck] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  return (
    <SafeAreaView style={{
      flex: 1, backgroundColor: "white"
    }}>
      <StatusBar backgroundColor={AppColors.white} barStyle={'dark-content'} />
      <View style={styles.logobg}>
        <Image
          source={ImagePaths.LOGO}
          style={{ height: 30 }}
          resizeMode="contain"
        />
      </View>

      <View style={{ marginHorizontal: 20 }}>
        <MyText fontType="regular" style={{ fontSize: 32, marginBottom: SCREEN_HEIGHT * 0.05 }}>
          Log in
        </MyText>

        <CustomInput
          value={login.email}
          onChangeText={(txt) => setLogin({ ...login, email: txt })}
          placeholder=''
          label='Email Address'
          isOutline
          leftIcon='mail-outline'
        />

        <CustomInput
          value={login.password}
          onChangeText={(txt) => setLogin({ ...login, password: txt })}
          placeholder=''
          label='Password'
          isOutline
          leftIcon='lock-closed-outline'
          rightIcon={showPassword ? "eye-outline" : "eye-off-outline"}
          onRighticonPress={() => setShowPassword(!showPassword)}
          secureTextEntry={showPassword}
        />

        <View style={styles.conditions}>
          <CustomIcon
            name={ischeck ? "checkbox" : "square-outline"}
            onPress={() => setIsCheck(!ischeck)}
            color={ischeck ? "#7F265B" : AppColors.black}
          />
          <MyText style={{ marginLeft: 10, color: AppColors.iconsGrey }}>Remember me</MyText>
        </View>

        <CustomButton 
          title='Login'
          onPress={() => {}}
        />
      </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  logobg: {
    backgroundColor: AppColors.white,
    padding: 10,
    borderRadius: 10,
    width: SCREEN_WIDTH * 0.8,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.1
  },
  conditions: {
    flexDirection: 'row',
    marginTop: 20
  }
})