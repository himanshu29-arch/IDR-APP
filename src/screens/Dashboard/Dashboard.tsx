import { View, Text, StatusBar, Image, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ImagePaths } from '../../utils/imagepaths'
import { AppColors } from '../../utils/colors'
import MyText from '../../components/customtext'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../utils/Dimensions'
import CustomIcon from '../../components/customIcon'
import CustomDropdown from '../../components/customDropdown'
import { IconsPath } from '../../utils/InconsPath'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { useGetAllClientQuery, useGetAllWorkOrderQuery, useGetWorkOrderByClientIdQuery } from '../../services/RTKClient'
import Loader from '../../components/Loader'
import ModalDropdown from '../../components/customDropdown'

export default function Dashboard({navigation}) {
  const [select, setSelect] = useState({})
  const { userData } = useSelector((state: RootState) => state.auth);
  const { data:clientData, isLoading } = useGetAllClientQuery()
  const { data: workOrder, isLoading: isLoading1, refetch } = useGetWorkOrderByClientIdQuery(select)
  const[openWorkOrder, setOpenWorkOrder] = useState([])


 useEffect(() => {
  // if (select?.client_id) {
    refetch()
    .then((res)=>{
console.log("RES ==> ", res.data);

      if(res?.data?.workorders?.length !== 0){
       const OpenOrder =  res?.data?.workorders.filter((i) => i.status === "Open");
       setOpenWorkOrder(OpenOrder)

      } else {
        setOpenWorkOrder([])
      }
    })
  // }
}, [select, refetch]);
 
 
  return (
    <ScrollView>
      <StatusBar translucent={true} />
      <Loader loading={isLoading || isLoading1}/>
      <View>
        <StatusBar translucent backgroundColor='transparent' />
        <View style={styles.blueContainer}>
          <Image
            source={ImagePaths.TOPCIRCLE}
            style={{ width: 190, marginTop: -65, position: 'absolute' }}
            resizeMode="contain"
          />
          <View style={styles.mainRow}>
            <View style={styles.row}>
              <View style={styles.AC}>
                <MyText fontType="bold" style={{
                  fontSize: 16,
                  color: AppColors.primary,
                }} >AC</MyText>
              </View>
              <View style={{ marginLeft: 10 }}>
                <MyText fontType="bold" style={{
                  fontSize: 16,
                  color: AppColors.white,
                }}>Alex Connors</MyText>
                <MyText style={{
                  fontSize: 12,
                  color: AppColors.InActiveBottomC,
                }}>Super Admin</MyText>
              </View>
            </View>

            <View style={[styles.AC, styles.row]}>
              <CustomIcon name='notifications-outline' onPress={() => navigation.navigate("Notifications")}/>
            </View>
          </View>
        </View>
        {/* Card */}

        <View style={[styles.card, { marginTop: -SCREEN_HEIGHT * 0.2 }]}>
          <MyText fontType="medium" style={{ fontSize: 18, marginVertical: 10 }}>Select Client</MyText>
        

          <CustomDropdown
            options={clientData?.data}
            type="client"
            defaultOption={""}
            onSelect={setSelect}
            isDarker
          />
          <MyText fontType="medium" style={{ fontSize: 18 }}>Assignments</MyText>

          <FlatList

            data={[
            {
              id: 1,
              name: 'Open work order',
              img: IconsPath.Openwork
            },
            {
              id: 2,
              name: 'All work order',
              img: IconsPath.Openwork
            }]}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            renderItem={({ item }) =>
              <View style={styles.assigncontainer}>
                <MyText style={styles.opentasks}>{item?.id === 1 ? typeof openWorkOrder?.length === "undefined" ? 0 : openWorkOrder?.length : typeof workOrder?.workorders?.length === "undefined" ? "0": workOrder?.workorders?.length}</MyText>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                  <Image
                    source={item.img}
                    style={{ width: 12, height: 12, marginRight: 10 }}
                  />
                  <MyText style={{ fontSize: 14 }}>{item.name}</MyText>
                </View>
              </View>}
          />
        </View>
        <View style={styles.card}>
          <MyText fontType="medium" style={{ fontSize: 18 }}>Open Work Order</MyText>
          <FlatList
            data={openWorkOrder}
            scrollEnabled={false}
            renderItem={({ item }) =>
              <TouchableOpacity
            onPress={() => navigation.navigate("ViewWorkOrder",{
              OrderId: item.work_order_id
            })} style={{
                backgroundColor: AppColors.lightgrey, padding: 15,
                borderRadius: 5, justifyContent: 'space-between', flexDirection: 'row',
                marginVertical: 5
              }}>
                <MyText style={{ fontSize: 14 }}>
                  {item.client_name}
                </MyText>
                <CustomIcon name='chevron-forward' />
              </TouchableOpacity>}
          />
        </View>

      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  blueContainer: {
    backgroundColor: AppColors.primary,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingBottom: 30
  },
  mainRow: {
    flexDirection: 'row',
    height: SCREEN_HEIGHT * 0.35,
    justifyContent: 'space-between'
  },
  AC: {

    backgroundColor: AppColors.white,
    borderRadius: 50,
    height: 40, width: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: AppColors.primary,
    backgroundColor: AppColors.white,
    borderRadius: 50,
    padding: 8
  },
  card: {
    backgroundColor: AppColors.white,
    width: SCREEN_WIDTH * 0.9,
    alignSelf: 'center',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10

  },
  row: { marginTop: 50, marginHorizontal: 20, flexDirection: 'row' },
  assigncontainer: {
    height: 120,
    width: SCREEN_WIDTH * 0.35,
    backgroundColor: AppColors.lightgrey,
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
    justifyContent: 'center'
  },
  opentasks: {
    color: AppColors.darkgreyColor,
    backgroundColor: AppColors.darkgrey,
    borderRadius: 30, padding: 10,
  }

})