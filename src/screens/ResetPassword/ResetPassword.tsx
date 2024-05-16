import { View, Text, SafeAreaView, StyleSheet, StatusBar, KeyboardAvoidingView, ScrollView, Alert, ToastAndroid } from 'react-native'
import React, { useDebugValue, useEffect, useState } from 'react'
import CustomInput from '../../components/customInput'
import MyText from '../../components/customtext'
import { ImagePaths } from '../../utils/imagepaths'
import { Image } from 'react-native'
import { AppColors } from '../../utils/colors'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../utils/Dimensions'
import CustomIcon from '../../components/customIcon'
import CustomButton from '../../components/customButton'
import { useForm } from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidationSchema, resetPasswordScema } from '../../utils/validationScemas'
import { useResetPasswordMutation } from '../../services/RTKClient'
import { useDispatch } from 'react-redux'
import { signIn } from '../../redux/slices/authSlice'
import { useToast } from 'react-native-toast-notifications'
import Loader from '../../components/Loader'


type prop = { email: string, password: string }

export default function ResetPassword({navigation, route}) {
  const [resetPassword, { isLoading }] = useResetPasswordMutation()

const {userEmail} = route?.params;
console.log("USER EMAIL FROM RESET", userEmail);

  const [showPassword, setShowPassword] = useState(false)
  const [showCPassword, setShowCPassword] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword:"",
    },
    resolver: yupResolver(resetPasswordScema),

  });

  const toast = useToast();

  useEffect(()=>{
    reset({
      email: userEmail
    })
  },[])



  const onSubmit = (data: prop) => {
    const { email, password } = data;
    const body = {
      email_id: email,
      password: password
    }
    console.log(body);
  
    resetPassword(body)
      .unwrap()
      .then((payload) => {
        console.log("PAYLOAD", payload);
        navigation.navigate("Login")
        toast.show(payload.message, {
          type: "success"
        });
      })
      .catch((error: any) => {
        console.log("ERROR", error);
        
        toast.show(error.data.message, {
          type: "danger"
        });
      });
  }
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <SafeAreaView style={{
        flex: 1, backgroundColor: "white"
      }}>
        <Loader loading={isLoading} />
        <StatusBar backgroundColor={AppColors.white} barStyle={'dark-content'} />
        <ScrollView>
          <View style={styles.logobg}>
            <Image
              source={ImagePaths.LOGO}
              style={{ height: 30 }}
              resizeMode="contain"
            />
          </View>

          <View style={{ marginHorizontal: 20 }}>
            <MyText fontType="regular" style={{ fontSize: 32, marginBottom: SCREEN_HEIGHT * 0.05 }}>
              Reset Password
            </MyText>

            <CustomInput
              control={control}
              name="email"
              placeholder='Email Address'
              label='Email Address'
              isOutline
              leftIcon='mail-outline'
              errors={errors}
            />

            <CustomInput
              control={control}
              name='password'
              placeholder='password'
              label='Password'
              isOutline
              leftIcon='lock-closed-outline'
              rightIcon={showPassword ? "eye-outline" : "eye-off-outline"}
              onRighticonPress={() => setShowPassword(!showPassword)}
              secureTextEntry={showPassword}
              errors={errors}
            />

      <CustomInput
              control={control}
              name='confirmPassword'
              placeholder='Confirm Password'
              label='Confirm Password'
              isOutline
              leftIcon='lock-closed-outline'
              rightIcon={showCPassword ? "eye-outline" : "eye-off-outline"}
              onRighticonPress={() => setShowCPassword(!showCPassword)}
              secureTextEntry={showPassword}
              errors={errors}
            />

            {/* <View style={styles.conditions}>
              <CustomIcon
                name={ischeck ? "checkbox" : "square-outline"}
                onPress={() => setIsCheck(!ischeck)}
                color={ischeck ? "#7F265B" : AppColors.black}
              />
              <MyText style={{ marginLeft: 10, color: AppColors.iconsGrey }}>
                Remember me
              </MyText>
            </View> */}
        

           <View style={{marginTop: 30}}>
           <CustomButton
              title='Submit'
              onPress={handleSubmit(onSubmit)}
              isdisabled={!isValid}
            />
           </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
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