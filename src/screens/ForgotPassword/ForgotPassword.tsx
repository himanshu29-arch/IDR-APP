import { View, Text, SafeAreaView, StyleSheet, StatusBar, KeyboardAvoidingView, ScrollView, Alert, ToastAndroid, Pressable } from 'react-native'
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
import { forgotPasswordScema, loginValidationSchema } from '../../utils/validationScemas'
import { useForgotpasswordMutation, useLoginMutation } from '../../services/RTKClient'
import { useDispatch } from 'react-redux'
import { signIn } from '../../redux/slices/authSlice'
import { useToast } from 'react-native-toast-notifications'
import Loader from '../../components/Loader'


type prop = { email: string, password: string }

export default function ForgotPassword({ navigation }) {
    const [forgotpassword, { isLoading }] = useForgotpasswordMutation()

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        mode: "all",
        defaultValues: {
            email: ""
        },
        resolver: yupResolver(forgotPasswordScema),

    });

    const toast = useToast();

    const onSubmit = (data: prop) => {
        const { email } = data;
        const body = {
            email_id: email
        }

        forgotpassword(body)
            .unwrap()
            .then((payload) => {
                console.log("payload", payload);
                navigation.goBack()
                toast.show(payload.message, {
                    type: "success"
                });
            })
            .catch((error) => {
                toast.show(error.data.message, {
                    type: "danger"
                });
            });
    }
    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <SafeAreaView style={{
                flex: 1, backgroundColor: "white", padding: 10 
            }}>
                <Loader loading={isLoading} />
                <StatusBar backgroundColor={AppColors.white} barStyle={'dark-content'} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Pressable onPress={() => navigation.goBack()} style={{ padding: 5, borderRadius: 50, borderColor: AppColors.iconsGrey, borderWidth: 1 }}>
                        <CustomIcon name='arrow-back' />
                    </Pressable>
                    <MyText fontType="bold" style={{ marginLeft: 20, fontSize: 20 }}>
                        Forgot Password
                    </MyText>
                </View>
                <ScrollView>
                    <View style={[styles.logobg, {marginBottom: 50}]}>
                        <Image
                            source={ImagePaths.LOGO}
                            style={{ height: 30 }}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={{ marginHorizontal: 20 }}>
                     

                        <CustomInput
                            control={control}
                            name="email"
                            placeholder=''
                            label='Email Address'
                            isOutline
                            leftIcon='mail-outline'
                            errors={errors}
                        />


                        <View style={{ marginTop: 30 }}>
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