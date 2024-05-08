import { View, Text, Pressable,StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomDropdown from '../../components/customDropdown'
import CustomInput from '../../components/customInput'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addNote, addNoteSchema, generateTicket, technicianName } from '../../utils/validationScemas';
import { useDispatch } from 'react-redux';
import { useAddNoteMutation, useAddWorkOrderMutation, useGetAllClientQuery, useGetLocationByClientQuery } from '../../services/RTKClient';
import CustomButton from '../../components/customButton';
import { SafeAreaView } from 'react-native';
import CustomIcon from '../../components/customIcon';
import MyText from '../../components/customtext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AppColors } from '../../utils/colors';
import { SCREEN_WIDTH } from '../../utils/Dimensions';
import { ShadowStyle } from '../../utils/constants';
import CustomDatePicker from '../../components/customDatepicker';
import { getDate, timeFormatter } from '../../utils/helperfunctions';
import { useToast } from 'react-native-toast-notifications';
import Loader from '../../components/Loader';

export default function AddNote({navigation, route}) {
  const { workOrder } = route.params;

    const [addNote, {isLoading}] = useAddNoteMutation()
    const toast = useToast();
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
      } = useForm({
        mode: "all",
        defaultValues: {
            parts: "",
            LabelingMethodology: "",
            EquipmentRequired: "",
            RequireDeliverables: "",
            DeliverableInstructions: ""
        },
    resolver: yupResolver(addNoteSchema)
      });

     
      
    const onsubmit = (data) => {
      const {
        parts,
        LabelingMethodology,
        EquipmentRequired,
        RequireDeliverables,
        DeliverableInstructions
      } = data
      const body = {
        work_order_id: workOrder,
        parts: parts,
        labeling_methodology:LabelingMethodology,
        equipment_installation: EquipmentRequired,
        required_deliverables: RequireDeliverables,
        deliverable_instructions: DeliverableInstructions
      }

 addNote(body)
 .unwrap()
      .then((payload) => {
        toast.show(payload.message, {
          type: "success"
        });
        navigation.navigate("BottomNavigation")
      })
      .catch((error) =>{ 
        toast.show(error.data.message, {
          type: "danger"
        });
      });

    }
  return (
    <SafeAreaView style={styles.conatiner}>
      <Loader loading={isLoading}/>
    <View style={styles.mainrow}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pressable onPress={() => navigation.goBack()} style={{ padding: 5, borderRadius: 50, borderColor: AppColors.iconsGrey, borderWidth: 1 }}>
          <CustomIcon name='arrow-back' />
        </Pressable>
        <MyText fontType="bold" style={{ marginLeft: 20, fontSize: 20 }}>
          Add Notes
        </MyText>
      </View>
      <CustomIcon size={25} name='notifications-outline' />
    </View>
    <KeyboardAwareScrollView>
    <View style={[styles.card, ShadowStyle]}>
    <View>
           

          <CustomInput
            control={control}
            name="parts"
            label='Parts'
            errors={errors}
          />

          <CustomInput
            control={control}
            name="LabelingMethodology"
            label='Labeling Methodology'
            errors={errors}
          />
          <CustomInput
            control={control}
            name="EquipmentRequired"
            label='Equipment Required'
            errors={errors}
          />

<CustomInput
            control={control}
            name="RequireDeliverables"
            label='Require Deliverables'
            errors={errors}
          />
          <CustomInput
            control={control}
            name="DeliverableInstructions"
            label='Deliverable Instructions'
            errors={errors}
          />
         
          
          <View style={{marginTop: 30}}>
          <CustomButton
        title='Submit'
        onPress={handleSubmit(onsubmit)}
        isdisabled={!isValid}
        />
          </View>
          </View>
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