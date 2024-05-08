import { View, Text, StyleSheet, SafeAreaView, Pressable, StatusBar, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppColors } from '../../utils/colors'
import { SCREEN_WIDTH } from '../../utils/Dimensions'
import Loader from '../../components/Loader'
import CustomIcon from '../../components/customIcon'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ShadowStyle } from '../../utils/constants'
import MyText from '../../components/customtext'
import { useGetAllClientQuery, useGetLocationByClientQuery, useGetWorkOrderByIDQuery, useUpdateTicketMutation } from '../../services/RTKClient'
import CustomInput from '../../components/customInput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { generateTicket, workorderview } from '../../utils/validationScemas'
import CustomDropdown from '../../components/customDropdown'
import CustomDatePicker from '../../components/customDatepicker'
import ViewTechnician from './ViewTecnician'
import ViewNotes from './ViewNotes'
import CustomButton from '../../components/customButton'
import { getDate, timeFormatter } from '../../utils/helperfunctions'
import { useToast } from 'react-native-toast-notifications'

export default function ViewWorkOrder({ navigation, route }) {
    const { OrderId } = route.params
    const { data, isLoading, refetch:refetchworkorder } = useGetWorkOrderByIDQuery(OrderId)
    const { data: clientData, isLoading: isLoading1 } = useGetAllClientQuery()
    const [client, setClient] = useState<string | object>("");
    const toast = useToast();
    const [date, setDate] = useState(Date);
    const [status, setStatus] = useState("")
    const [location, setLocation] = useState("")
    const [ticket, setTicket] = useState(false)
    const { data: locationData, refetch, } = useGetLocationByClientQuery(client)
    const [updateTicket, {isLoading: isLoading2}] = useUpdateTicketMutation()
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        reset
    } = useForm({
        mode: "all",
        defaultValues: {
            WorkOrdertype: "",
            PONumber: "",
            ClientSite: "",
            ContactPerson: "",
            ContactPhone: "",
            Issue: "",
            ServiceDate: "",
            ContactEmail: "",
        },

        resolver: yupResolver(workorderview)
    });

    useEffect(() => {
        if (client?.client_id) {
            refetch();
        }
    }, [client?.client_id, refetch]);

    useEffect(() => {
        if (typeof data !== "undefined") {
            setClient(data?.workOrder?.client_name)
            setStatus(data?.workOrder?.status)
            setLocation(data?.workOrder?.job_location)
            reset(
                {
                    WorkOrdertype: data?.workOrder?.work_order_type,
                    PONumber: data?.workOrder?.po_number,
                    ClientSite: data?.workOrder?.client_site,
                    ContactPerson: data?.workOrder?.contact_person,
                    ContactPhone: data?.workOrder?.contact_phone_number,
                    ContactEmail: data?.workOrder?.contact_mail_id,
                    Issue: data?.workOrder?.issue,
                    ServiceDate: data?.workOrder?.service_date
                });
        }

    }, [data])


    const onSubmit = (info) => {
        const { WorkOrdertype,
        PONumber,
        ClientSite,
        ContactPerson,
        ContactPhone,
        ContactEmail,
        Issue,
        ServiceDate,
        } = info;
      
        const body = {
            work_order_id: OrderId,
            client_name: typeof client === "string" ? client : client?.company_name,
            location_id: typeof location === "string"? data?.workOrder?.location_id : location?.location_id,
            client_id: typeof client === "string" ? data?.workOrder?.client_id :client?.client_id,
            work_order_type: WorkOrdertype,
            generated_date: getDate(new Date()),
            generated_time: timeFormatter(new Date()),
            po_number: PONumber,
            client_site: ClientSite,
            job_location: typeof location === "string"? location : location?.address_line_one,
            service_date: ServiceDate,
            contact_person: ContactPerson,
            contact_phone_number: ContactPhone,
            contact_mail_id:ContactEmail,
            issue: Issue, 
            status: status
          }

          console.log("BODY ===> ", body);
        //   return
          updateTicket(body)
          .unwrap()
          .then((payload) => {
            refetchworkorder()
            setTicket(false)
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
        <SafeAreaView style={styles.conatiner}>
            <Loader loading={isLoading || isLoading1 || isLoading2} />
            <StatusBar backgroundColor={AppColors.white} barStyle={"dark-content"} translucent={false} />
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
            <KeyboardAwareScrollView style={{ marginTop: 30 }}>
                <View style={[styles.card, ShadowStyle]}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <MyText fontType='bold' style={{fontSize: 22}}>
                        Ticket
                    </MyText>
                    
                   { ticket ?
                     <CustomButton
                     title={"Submit"}
                     onPress={handleSubmit(onSubmit)}
                     />
                     :
                     <CustomButton
                     title={"Edit"}
                     onPress={() => setTicket(true)}
                     />
                   }
                    </View>
                    <View style={{ marginTop: 10 }}>

                        <CustomDropdown
                            options={clientData?.data}
                            type="client"
                            defaultOption={client}
                            onSelect={setClient}
                            isDisabled={!ticket}
                        />
                        <CustomDropdown
                            label='Choose Location'
                            options={locationData?.locations}
                            type="location"
                            defaultOption={location}
                            onSelect={setLocation}
                            isDisabled={typeof locationData === "undefined" || !ticket}
                            
                        />


                        <CustomInput
                            control={control}
                            errors={errors}
                            name='WorkOrdertype'
                            label='Work Order type'
                            isDisabled={!ticket}
                        />
                        <CustomInput
                            control={control}
                            errors={errors}
                            name='PONumber'
                            label='PO Number'
                            isDisabled={!ticket}
                        />

                        <CustomInput
                            control={control}
                            errors={errors}
                            name='ClientSite'
                            label='Client Site'
                            isDisabled={!ticket}
                        />

                        <CustomInput
                            control={control}
                            errors={errors}
                            name='ContactPerson'
                            label='Contact Person'
                            isDisabled={!ticket}
                        />

                        <CustomInput
                            control={control}
                            errors={errors}
                            name='ContactPhone'
                            label='Contact Phone'
                            isDisabled={!ticket}
                        />

                        <CustomInput
                            control={control}
                            errors={errors}
                            name='ContactEmail'
                            label='Contact Email'
                            isDisabled={!ticket}
                        />

                        <CustomInput
                            control={control}
                            errors={errors}
                            name='Issue'
                            label='Issue'
                            isDisabled={!ticket}
                        />
                        <CustomDropdown
                            label='Status'
                            options={["Open", "Project Completed"]}
                            type="status"
                            defaultOption={status}
                            onSelect={setStatus}
                            isDisabled={!ticket}
                        />

                        <CustomDatePicker
                            setDate={setDate}
                            date={date}
                            label="Service Date"
                            isDisabled={!ticket}
                        />

                    </View>
                </View>
               {data?.workOrder?.technicians.length !== 0 && <ViewTechnician technicians={data?.workOrder?.technicians}/>}
               {data?.workOrder?.notes.length !== 0 &&  <ViewNotes NotesData={data?.workOrder?.notes}/>}
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