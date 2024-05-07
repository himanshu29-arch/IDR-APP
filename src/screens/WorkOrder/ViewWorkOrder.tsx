import { View, Text, StyleSheet, SafeAreaView, Pressable, StatusBar, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppColors } from '../../utils/colors'
import { SCREEN_WIDTH } from '../../utils/Dimensions'
import Loader from '../../components/Loader'
import CustomIcon from '../../components/customIcon'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ShadowStyle } from '../../utils/constants'
import MyText from '../../components/customtext'
import { useGetAllClientQuery, useGetLocationByClientQuery, useGetWorkOrderByIDQuery } from '../../services/RTKClient'
import CustomInput from '../../components/customInput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { generateTicket, workorderview } from '../../utils/validationScemas'
import CustomDropdown from '../../components/customDropdown'
import CustomDatePicker from '../../components/customDatepicker'
import ViewTechnician from './ViewTecnician'
import ViewNotes from './ViewNotes'

export default function ViewWorkOrder({ navigation, route }) {
    const { OrderId } = route.params
    const { data, isLoading } = useGetWorkOrderByIDQuery(OrderId)
    const { data: clientData, isLoading: isLoading1 } = useGetAllClientQuery()
    const [client, setClient] = useState<string | object>("");
    const [date, setDate] = useState(Date);
    const [status, setStatus] = useState("")
    const [location, setLocation] = useState("")
    const { data: locationData, refetch, } = useGetLocationByClientQuery(client)
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
            ContactEmail: "",
            Issue: "",
            ServiceDate: "",
            ContactMail: ""
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
                    ServiceDate: data?.workOrder?.service_date,
                    ContactMail: data?.workOrder?.contact_mail_id
                });
        }

    }, [data])

    console.log("CHECK ", data?.workOrder?.notes);

    return (
        <SafeAreaView style={styles.conatiner}>
            <Loader loading={isLoading} />
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
                    <MyText fontType='bold'>
                        Select Client
                    </MyText>
                    <View style={{ marginTop: 10 }}>

                        <CustomDropdown
                            options={clientData?.data}
                            type="client"
                            defaultOption={client}
                            onSelect={setClient}
                        />
                        <CustomDropdown
                            label='Choose Location'
                            options={locationData?.locations}
                            type="location"
                            defaultOption={location}
                            onSelect={setLocation}
                            isDisabled={typeof locationData === "undefined"}
                        />


                        <CustomInput
                            control={control}
                            errors={errors}
                            name='WorkOrdertype'
                            label='Work Order type'
                        />
                        <CustomInput
                            control={control}
                            errors={errors}
                            name='PONumber'
                            label='PO Number'
                        />

                        <CustomInput
                            control={control}
                            errors={errors}
                            name='ClientSite'
                            label='Client Site'
                        />

                        <CustomInput
                            control={control}
                            errors={errors}
                            name='ContactPerson'
                            label='Contact Person'
                        />

                        <CustomInput
                            control={control}
                            errors={errors}
                            name='ContactPhone'
                            label='Contact Phone'
                        />

                        <CustomInput
                            control={control}
                            errors={errors}
                            name='ContactMail'
                            label='Contact Email'
                        />

                        <CustomInput
                            control={control}
                            errors={errors}
                            name='Issue'
                            label='Issue'
                        />
                        <CustomDropdown
                            label='Status'
                            options={["Open", "Project Completed"]}
                            type="status"
                            defaultOption={status}
                            onSelect={setStatus}
                        />

                        <CustomDatePicker
                            setDate={setDate}
                            date={date}
                            label="Service Date"
                        />

                    </View>
                </View>
                <ViewTechnician technicians={data?.workOrder?.technicians}/>
                <ViewNotes NotesData={data?.workOrder?.notes}/>
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