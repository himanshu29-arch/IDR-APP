import { View, Text, StyleSheet, StatusBar, Image, Linking } from 'react-native'
import React, { useEffect } from 'react'
import { AppColors } from '../../utils/colors'
import { ImagePaths } from '../../utils/imagepaths'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../utils/Dimensions'
import { Fonts } from '../../utils/constants'
export default function Splash({navigation}) {

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor='transparent' />
            <Image
                source={ImagePaths.TOPCIRCLE}
                style={{ width: 190, marginTop: -65 }}
                resizeMode="contain"
            />

            <View style={{flexDirection: 'column'}}>
                <View style={styles.logobg}>
                    <Image
                        source={ImagePaths.LOGO}
                        style={{ height: 30 }}
                        resizeMode="contain"
                    />
                </View>
                {/* <Text style={styles.txt}>Lorem Ipsum is simply dummy text of the printing and type setting industry.</Text> */}
            </View>



            <Image
                source={ImagePaths.BOTTOMCIRCLE}
                style={{ width: 190, alignSelf: 'flex-end', margin: -10 }}
                resizeMode="contain"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.primary,
        justifyContent: 'space-between'
    },
    logobg: {
        backgroundColor: AppColors.white,
        padding: 10,
        borderRadius: 10,
        width: SCREEN_WIDTH * 0.8,
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: -SCREEN_HEIGHT * 0.1
    },
    txt: {
        color: AppColors.white, 
        marginBottom: -100, 
        width: '75%',
        alignSelf: 'center',
        margin: 30,
        textAlign : 'center',
        lineHeight: 30,
        fontSize: 16,
        fontFamily: Fonts.MEDIUM,
    }
})