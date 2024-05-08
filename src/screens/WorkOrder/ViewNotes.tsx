import { View, Text, StyleSheet, SafeAreaView, Pressable, StatusBar, FlatList, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppColors } from '../../utils/colors'
import { SCREEN_WIDTH } from '../../utils/Dimensions'
import { ShadowStyle } from '../../utils/constants'
import MyText from '../../components/customtext'
import CustomButton from '../../components/customButton'
import { useUpdateNotesMutation } from '../../services/RTKClient'
import { useToast } from 'react-native-toast-notifications'

export default function ViewNotes({ NotesData, refetchworkorder }) {
  const [notes, setNotes] = useState(NotesData)
  const [notesEdit, setNotesEdit] = useState(false)
  const [updateNotes, {isLoading}] = useUpdateNotesMutation()
  const toast = useToast();

  const handleChange = (val, key, index) => {
    const newData = [...notes];
    newData[index] = { ...newData[index], [key]: val };
    setNotes(newData);
  }


  const onSubmit = () => {
console.log(notes);

const body = {
  technician_id: notes[0].technician_id,
  work_order_id: notes[0].work_order_id,
  technician_name: notes[0].technician_name,
  project_manager: notes[0].project_manager,
  service_request: notes[0].service_request,
  other_details: notes[0].other_details,  //optional
  procedures: notes[0].procedures, //optional
  note_id: notes[0].note_id

}

    updateNotes(body)
    .unwrap()
    .then((payload) => {
     refetchworkorder()
      setNotesEdit(false)
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
        <View>
            <View style={[styles.card, ShadowStyle]}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <MyText fontType='bold' style={{fontSize: 22}}>
                        Notes Information
                    </MyText>
                    { notesEdit ?
                     <CustomButton
                     title={"Submit"}
                     onPress={() => onSubmit()}
                     />
                     :
                     <CustomButton
                     title={"Edit"}
                     onPress={() => setNotesEdit(true)}
                     />
                   }
                    </View>
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
                                         onChangeText={(txt: string) => handleChange(txt, "parts", index)}
                                        style={[styles.default]}
                                        editable={notesEdit}
                                    />
                                </View>

                                <MyText style={{ marginVertical: 5, color: AppColors.black }}>Labeling Methodology</MyText>
                                <View style={[styles.viewcontainer, styles.outlined]}>
                                    <TextInput 
                                        value={item.labeling_methodology}
                                         onChangeText={(txt: string) => handleChange(txt, "labeling_methodology", index)}
                                        style={[styles.default]}
                                        editable={notesEdit}
                                    />
                                </View>

                                <MyText style={{ marginVertical: 5, color: AppColors.black }}>Equipment Installation</MyText>
                                <View style={[styles.viewcontainer, styles.outlined]}>
                                    <TextInput 
                                        value={item.equipment_installation}
                                         onChangeText={(txt: string) => handleChange(txt, "equipment_installation", index)}
                                        style={[styles.default]}
                                        editable={notesEdit}
                                    />
                                </View>

                                <MyText style={{ marginVertical: 5, color: AppColors.black }}>required Deliverables</MyText>
                                <View style={[styles.viewcontainer, styles.outlined]}>
                                    <TextInput 
                                        value={item.required_deliverables}
                                         onChangeText={(txt: string) => handleChange(txt, "required_deliverables", index)}
                                        style={[styles.default]}
                                        editable={notesEdit}
                                    />
                                </View>

                                <MyText style={{ marginVertical: 5, color: AppColors.black }}>Deliverable Instructions</MyText>
                                <View style={[styles.viewcontainer, styles.outlined]}>
                                    <TextInput 
                                        value={item.deliverable_instructions}
                                         onChangeText={(txt: string) => handleChange(txt, "deliverable_instructions", index)}
                                        style={[styles.default]}
                                        editable={notesEdit}
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