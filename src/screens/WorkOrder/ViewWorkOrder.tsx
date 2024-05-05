import { View, Text, StyleSheet, SafeAreaView, Pressable, StatusBar } from 'react-native'
import React from 'react'
import { AppColors } from '../../utils/colors'
import { SCREEN_WIDTH } from '../../utils/Dimensions'
import Loader from '../../components/Loader'
import CustomIcon from '../../components/customIcon'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ShadowStyle } from '../../utils/constants'
import MyText from '../../components/customtext'
import { useGetWorkOrderByIDQuery } from '../../services/RTKClient'
import CustomInput from '../../components/customInput'

export default function ViewWorkOrder({ navigation, route }) {
    const { OrderId } = route.params
    const { data, isLoading } = useGetWorkOrderByIDQuery(OrderId)

    return (
        <SafeAreaView style={styles.conatiner}>
            <Loader loading={isLoading} />
            <StatusBar backgroundColor={AppColors.white} barStyle={"dark-content"} translucent={false}/>
            <View style={styles.mainrow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Pressable onPress={() => navigation.goBack()} style={{ padding: 5, borderRadius: 50, borderColor: AppColors.iconsGrey, borderWidth: 1 }}>
                        <CustomIcon name='arrow-back' />
                    </Pressable>
                    <MyText fontType="bold" style={{ marginLeft: 20, fontSize: 20 }}>
                        Work Order Details
                    </MyText>
                </View>
            </View>
            <KeyboardAwareScrollView>
                <View style={[styles.card, ShadowStyle]}>
                    <MyText>
                        {JSON.stringify(data)}
                    </MyText>

                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        backgroundColor: AppColors.white,
        padding: 10
    },
    mainrow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },
    card: {

        backgroundColor: AppColors.white,
        width: SCREEN_WIDTH * 0.9,
        alignSelf: 'center',
        borderRadius: 20,
        padding: 20,
        marginVertical: 10

    },
})