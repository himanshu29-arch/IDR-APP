import { View, Text, StyleSheet, SafeAreaView, Pressable, StatusBar, FlatList, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppColors } from '../../utils/colors'
import { SCREEN_WIDTH } from '../../utils/Dimensions'
import { ShadowStyle } from '../../utils/constants'
import MyText from '../../components/customtext'

export default function ViewNotes({ NotesData }) {
  const [notes, setNotes] = useState([])
  

  const handleChange = (val, key, index) => {
    const newData = [...techniciansdata];
    newData[index] = { ...newData[index], [key]: val };
    setNotes(newData);
  }

  useEffect(()=>{ setNotes(NotesData)},[])

    return (
        <View>
            <View style={[styles.card, ShadowStyle]}>
                <MyText fontType='bold'>
                    Notes Information
                </MyText>
                <View style={{ marginTop: 10 }}>
                    <FlatList
                        scrollEnabled={false}
                        data={notes}
                        renderItem={({ item, index}) =>
                            <View>
                                <MyText style={{ marginVertical: 5, color: AppColors.black }}>Parts</MyText>
                                <View style={[styles.viewcontainer, styles.outlined]}>
                                    <TextInput 
                                        value={item.parts}
                                        onChangeText={() => { }}
                                        style={[styles.default]}
                                    />
                                </View>

                                <MyText style={{ marginVertical: 5, color: AppColors.black }}>Labeling Methodology</MyText>
                                <View style={[styles.viewcontainer, styles.outlined]}>
                                    <TextInput 
                                        value={item.labeling_methodology}
                                        onChangeText={() => { }}
                                        style={[styles.default]}
                                    />
                                </View>

                                <MyText style={{ marginVertical: 5, color: AppColors.black }}>Equipment Installation</MyText>
                                <View style={[styles.viewcontainer, styles.outlined]}>
                                    <TextInput 
                                        value={item.equipment_installation}
                                        onChangeText={() => { }}
                                        style={[styles.default]}
                                    />
                                </View>

                                <MyText style={{ marginVertical: 5, color: AppColors.black }}>required Deliverables</MyText>
                                <View style={[styles.viewcontainer, styles.outlined]}>
                                    <TextInput 
                                        value={item.required_deliverables}
                                        onChangeText={() => { }}
                                        style={[styles.default]}
                                    />
                                </View>

                                <MyText style={{ marginVertical: 5, color: AppColors.black }}>Deliverable Instructions</MyText>
                                <View style={[styles.viewcontainer, styles.outlined]}>
                                    <TextInput 
                                        value={item.deliverable_instructions}
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