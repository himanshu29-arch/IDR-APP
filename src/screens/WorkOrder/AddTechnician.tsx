import { View, Text, Pressable,StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomDropdown from '../../components/customDropdown'
import CustomInput from '../../components/customInput'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { generateTicket, technicianName } from '../../utils/validationScemas';
import { useDispatch } from 'react-redux';
import { useAddTechnicianMutation, useAddWorkOrderMutation, useGetAllClientQuery, useGetLocationByClientQuery } from '../../services/RTKClient';
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

export default function AddTechnician({navigation, route}) {
  const { WorkOrder } = route.params;
  console.log("payload ===> Addtechnician ", WorkOrder);
  
    const [addTechnician, {isLoading}] = useAddTechnicianMutation()
    const toast = useToast();
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
      } = useForm({
        mode: "all",
        defaultValues: {
          TechnicianName: "",
          projectManager: "",
          serviceRequest: "",
          otherDetails: "",
          procedures: ""
        },
    resolver: yupResolver(technicianName)
      });

    
      
    const onsubmit = (data) => {
      const {
        TechnicianName,
        projectManager,
        serviceRequest,
        otherDetails,
        procedures
      } = data
      const body = {
        "work_order_id": WorkOrder,
        "technician_name":TechnicianName,
        "project_manager": projectManager,
        "service_request": serviceRequest,
        "other_details": otherDetails,  //optional
        "procedures": procedures  //optional
      }
console.log("==> ",body);
// return
addTechnician(body)
 .unwrap()
      .then((payload) => {
        console.log('fulfilled', payload)
        toast.show(payload.message, {
          type: "success"
        });
        navigation.navigate("AddNote",{
          workOrder: WorkOrder
        })
      })
      .catch((error) =>{ 
        console.log('rejected', error) 
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
          Add Technician
        </MyText>
      </View>
      <CustomIcon size={25} name='notifications-outline' />
    </View>
    <KeyboardAwareScrollView>
    <View style={[styles.card, ShadowStyle]}>
    <View>
           

          <CustomInput
            control={control}
            name="TechnicianName"
            label='Technician Name'
            errors={errors}
          />

          <CustomInput
            control={control}
            name="projectManager"
            label='Project Manager'
            errors={errors}
          />
          <CustomInput
            control={control}
            name="serviceRequest"
            label='Service Request'
            errors={errors}
          />

<CustomInput
            control={control}
            name="otherDetails"
            label='Other Details'
            errors={errors}
          />
          <CustomInput
            control={control}
            name="procedures"
            label='Procedures'
            errors={errors}
          />
         
          
           <CustomButton
        title='Next'
        onPress={handleSubmit(onsubmit)}
        isdisabled={!isValid}
        />
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