import { View, Text, StyleSheet, SafeAreaView, Pressable, StatusBar, FlatList, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppColors } from '../../utils/colors'
import { SCREEN_WIDTH } from '../../utils/Dimensions'
import { ShadowStyle } from '../../utils/constants'
import MyText from '../../components/customtext'

export default function ViewTechnician({ technicians }) {
  const [techniciansdata, setTechniciansdata] = useState([])
  

  const handleChange = (val, key, index) => {
    const newData = [...techniciansdata];
    newData[index] = { ...newData[index], [key]: val };
    setTechniciansdata(newData);
  }

  useEffect(()=>{ setTechniciansdata(technicians)},[])

    return (
        <View>
            <View style={[styles.card, ShadowStyle]}>
                <MyText fontType='bold'>
                    Technician Information
                </MyText>
                <View style={{ marginTop: 10 }}>
                    <FlatList
                        scrollEnabled={false}
                        data={techniciansdata}
                        renderItem={({ item, index}) =>
                            <View>
                                <MyText style={{ marginVertical: 5, color: AppColors.black }}>Technician Name</MyText>
                                <View style={[styles.viewcontainer, styles.outlined]}>
                                    <TextInput 
                                        value={item.technician_name}
                                        onChangeText={() => { }}
                                        style={[styles.default]}
                                    />
                                </View>

                                <MyText style={{ marginVertical: 5, color: AppColors.black }}>Project Manager </MyText>
                                <View style={[styles.viewcontainer, styles.outlined]}>
                                    <TextInput 
                                        value={item.project_manager}
                                        onChangeText={(txt: string) => handleChange(txt, "project_manager", index)}
                                        style={[styles.default]}
                                    />
                                </View>

                                <MyText style={{ marginVertical: 5, color: AppColors.black }}>Service Request</MyText>
                                <View style={[styles.viewcontainer, styles.outlined]}>
                                    <TextInput 
                                        value={item.service_request}
                                        onChangeText={() => { }}
                                        style={[styles.default]}
                                    />
                                </View>

                                <MyText style={{ marginVertical: 5, color: AppColors.black }}>Procedures</MyText>
                                <View style={[styles.viewcontainer, styles.outlined]}>
                                    <TextInput 
                                        value={item.procedures}
                                        onChangeText={() => { }}
                                        style={[styles.default]}
                                    />
                                </View>

                                <MyText style={{ marginVertical: 5, color: AppColors.black }}>Other Details</MyText>
                                <View style={[styles.viewcontainer, styles.outlined]}>
                                    <TextInput 
                                        value={item.other_details}
                                        onChangeText={() => { }}
                                        style={[styles.default]}
                                    />
                                </View>
                            </View>}
                    />
                </View>
            </View>
        </View>
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
    default: {
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
    },
    err: {
        color: AppColors.red,
        fontSize: 12,
        margin: 5,
    },
})