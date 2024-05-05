import { View, Text, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, FlatList, ScrollView, TouchableWithoutFeedback, Alert } from 'react-native'
import React, { useState } from 'react'
import { AppColors } from '../../utils/colors'
import { SCREEN_HEIGHT } from '../../utils/Dimensions'
import CustomIcon from '../../components/customIcon'
import MyText from '../../components/customtext'
import { ShadowStyle } from '../../utils/constants'
import { useDeleteWorkOrderMutation, useGetAllWorkOrderQuery } from '../../services/RTKClient'
import Loader from '../../components/Loader'

export default function WorkOrder({ navigation }) {
  const { data: workOrder, isLoading: isLoading1, refetch } = useGetAllWorkOrderQuery()
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState({})
  const [deleteWorkOrder, {isLoading: isLoading2}] = useDeleteWorkOrderMutation()

  const showAlert = () => {
    Alert.alert(
      'Delete',
      'Are you confirm to delete this work order?', // <- this part is optional, you can pass an empty string
      [
        {text: 'DELETE', onPress: () => onDelete()},
        {text: 'Cancel', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }

  const onDelete =() => {
    console.log("SELECTED +++ ==> ", selected);
    deleteWorkOrder(selected)
    .unwrap()
    .then((payload) => {
      console.log("Payload", payload);
      setShow(false)
      refetch()
    })
    .catch((error) => {
      console.log("Error", error);
      
    })
  } 
  return (


    <SafeAreaView style={{ backgroundColor: AppColors.white, flex: 1 }}>
      <StatusBar backgroundColor={AppColors.white} barStyle={'dark-content'} translucent={false} />
  <Loader loading={isLoading1 || isLoading2}/>
      <ScrollView>
        <TouchableWithoutFeedback style={{ marginTop: StatusBar.currentHeight }} onPress={() => {
          setSelected({})
          setShow(false)
        }}>
          <View style={{ padding: 15 }}>
            <View style={styles.mainRow}>
              <View >
                <MyText fontType="bold" style={{
                  fontSize: 18,
                  color: AppColors.black,
                }} >Work Order</MyText>
              </View>
              <View style={styles.AC}>
                <CustomIcon name='notifications-outline' />
              </View>
            </View>

            <TouchableOpacity style={styles.filter}>
              <MyText>
                Filters
              </MyText>
              <CustomIcon name='chevron-forward' color={AppColors.darkgreyColor} />
            </TouchableOpacity>
            <FlatList
              data={workOrder?.workOrder}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              renderItem={({ item }) =>
                <View style={[styles.card, ShadowStyle]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <View>
                      <MyText fontType="medium" style={{ fontSize: 14 }}>
                        Work Order Code
                      </MyText>
                      <MyText style={{ fontSize: 14 }}>
                        {item.work_order_type}
                      </MyText>
                    </View>
                    <CustomIcon name='ellipsis-vertical' onPress={() => {
                      setSelected(item)
                      setShow(true)
                    }} />
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 30 }}>
                    <View>
                      <MyText fontType="medium" style={{ fontSize: 14 }}>
                        Client name
                      </MyText>
                      <MyText style={{ fontSize: 14, marginTop: 10 }}>
                        {item.client_name}
                      </MyText>
                    </View>
                    <View>
                      <MyText fontType="medium" style={{ fontSize: 14 }}>
                        Status
                      </MyText>
                      <MyText style={{ fontSize: 14, marginTop: 10 }}>
                        {item.status}
                      </MyText>
                    </View>
                  </View>
                </View>
              }
            />

          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      {
        show && <View style={[{ backgroundColor: AppColors.white, paddingVertical: 30, margin: 10, borderRadius: 10, alignItems: 'center' }, ShadowStyle]}>
          <MyText style={{ fontSize: 16, margin: 10 }} fontType="medium">
            Edit record
          </MyText>
          <MyText style={{ fontSize: 16, margin: 10 }} fontType="medium" onPress={()=> showAlert()}>
            Delete record
          </MyText>
        </View>
      }

      <TouchableOpacity style={[styles.fab, ShadowStyle]} onPress={() => navigation.navigate("GenerateTicket")}>
        <CustomIcon name='add' color={AppColors.white} size={30} />
      </TouchableOpacity>
    </SafeAreaView>

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
    justifyContent: 'space-between'
  },
  AC: {

    backgroundColor: AppColors.lightgrey,
    borderRadius: 50,
    height: 40, width: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  filter: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 5,
    padding: 10,
    backgroundColor: AppColors.darkgrey,
    marginTop: 10
  },
  card: {
    backgroundColor: AppColors.white,
    alignItems: 'flex-start',
    borderRadius: 10,
    padding: 20,
    margin: 10

  },
  fab: {
    backgroundColor: AppColors.primary,
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 50,
    right: 20
  }
})