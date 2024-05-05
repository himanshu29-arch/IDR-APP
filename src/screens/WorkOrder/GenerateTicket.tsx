import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomDropdown from '../../components/customDropdown'
import CustomInput from '../../components/customInput'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { generateTicket } from '../../utils/validationScemas';
import { useDispatch } from 'react-redux';
import { useAddWorkOrderMutation, useGetAllClientQuery, useGetLocationByClientQuery } from '../../services/RTKClient';
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

export default function GenerateTicket({ navigation }) {
  const dispatch = useDispatch()
  const [date, setDate] = useState(Date)
  const [select, setSelect] = useState({})
  const [status, setStatus] = useState("")
  const [location, setLocation] = useState([])
  const { data: clientData, } = useGetAllClientQuery()
  const { data: locationData, refetch, isError, error } = useGetLocationByClientQuery(select)
  const [addWorkOrder, { isLoading }] = useAddWorkOrderMutation()
  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "all",
    defaultValues: {
      WorkOrdertype: "",
      PONumber: "",
      ClientSite: "",
      ContactPerson: "",
      ContactPhone: "",
      ContactEmail: "",
      Issue: ""
    },
    resolver: yupResolver(generateTicket)
  });

  useEffect(() => {
    if (select?.client_id) {
      refetch();
    }
  }, [select?.client_id, refetch]);

  const isDisabled = () => {
    if (!isValid || Object.keys(select).length === 0 || status.length === 0 || location.length === 0) {
      return true
    } else {
      return false
    }
  }


  const onsubmit = (data) => {
    const {
      WorkOrdertype,
      PONumber,
      ClientSite,
      ContactPerson,
      ContactPhone,
      ContactEmail,
      Issue
    } = data
    const body = {
      client_id: select?.client_id,
      location_id: location?.location_id,
      client_name: select?.company_name,
      work_order_type: WorkOrdertype,
      generated_date: getDate(new Date()),
      generated_time: timeFormatter(new Date()),
      po_number: PONumber,
      client_site: ClientSite,
      job_location: location?.address_line_one,
      service_date: getDate(date),
      contact_person: ContactPerson,
      contact_phone_number: ContactPhone,
      contact_mail_id: ContactEmail,
      issue: Issue,
      status: status
    }
   
    addWorkOrder(body)
      .unwrap()
      .then((payload) => {
        toast.show(payload.message, {
          type: "success"
        });
        navigation.navigate("AddTechnician", {
          WorkOrder: payload?.work_order_id,
        })
      })
      .catch((error) => {
        toast.show(error.data.message, {
          type: "danger"
        });
      });

  }
  return (
    <SafeAreaView style={styles.conatiner}>
      <Loader loading={isLoading} />
      <View style={styles.mainrow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={() => navigation.goBack()} style={{ padding: 5, borderRadius: 50, borderColor: AppColors.iconsGrey, borderWidth: 1 }}>
            <CustomIcon name='arrow-back' />
          </Pressable>
          <MyText fontType="bold" style={{ marginLeft: 20, fontSize: 20 }}>
            New Work Order
          </MyText>
        </View>
        <CustomIcon size={25} name='notifications-outline' />
      </View>
      <KeyboardAwareScrollView>
        <View style={[styles.card, ShadowStyle]}>
          <View>
            <CustomDropdown
              label='Choose Client'
              options={clientData?.data}
              type="client"
              defaultOption={""}
              onSelect={setSelect}
            />

            <CustomDropdown
              label='Choose Location'
              options={locationData?.locations}
              type="location"
              defaultOption={""}
              onSelect={setLocation}
              isDisabled={typeof locationData === "undefined"}
            />

            <CustomInput
              control={control}
              name="WorkOrdertype"
              label='Work Order type'
              errors={errors}
            />

            <CustomInput
              control={control}
              name="PONumber"
              label='PO number'
              errors={errors}
              keyboardType="numeric"
            />
            <CustomInput
              control={control}
              name="ClientSite"
              label='Client Site'
              errors={errors}
            />
            <CustomInput
              control={control}
              name="ContactPerson"
              label='Contact Person'
              errors={errors}
            />
            <CustomInput
              control={control}
              name="ContactPhone"
              label='Contact Phone Number'
              errors={errors}
              keyboardType="phone-pad"
            />
            <CustomInput
              control={control}
              name="ContactEmail"
              label='Contact Email ID'
              errors={errors}
              keyboardType="email-address"
            />

            <CustomDatePicker
              date={date}
              setDate={setDate}
              label='Service date'
              minimumDate={new Date()}
            />
            <CustomInput
              control={control}
              name="Issue"
              label='Issue'
              errors={errors}
            />
            <CustomDropdown
              label='Status'
              options={["Open", "Project Completed"]}
              type="status"
              defaultOption={""}
              onSelect={setStatus}
            />
            <CustomButton
              title='Next'
              onPress={handleSubmit(onsubmit)}
              isdisabled={isDisabled()}
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