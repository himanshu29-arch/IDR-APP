import { View, Text, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { AppColors } from '../../utils/colors'
import { SCREEN_HEIGHT } from '../../utils/Dimensions'
import CustomIcon from '../../components/customIcon'
import MyText from '../../components/customtext'
import { ShadowStyle } from '../../utils/constants'

export default function WorkOrder({navigation}) {
  return (
    <SafeAreaView style={{ backgroundColor: AppColors.white, flex: 1 }}>
      <StatusBar backgroundColor={AppColors.white} barStyle={'dark-content'} translucent={false} />
      <View style={{ marginTop: StatusBar.currentHeight }}>
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

          <View style={[styles.card, ShadowStyle]}>
            <MyText fontType="medium" style={{ fontSize: 14 }}>
              Work Order Code
            </MyText>
            <MyText style={{ fontSize: 14 }}>
              WO100000001853
            </MyText>

            <View style={{ flexDirection: 'row', justifyContent:'space-between', width: '100%', marginTop: 30 }}>
              <View>
                <MyText fontType="medium" style={{ fontSize: 14 }}>
                  Client name
                </MyText>
                <MyText style={{ fontSize: 14, marginTop: 10 }}>
                  IDR Technology solutions
                </MyText>
              </View>
              <View>
                <MyText fontType="medium" style={{ fontSize: 14 }}>
                 Status
                </MyText>
                <MyText style={{ fontSize: 14, marginTop: 10 }}>
                 Open
                </MyText>
              </View>
            </View>
          </View>

        </View>
      </View>

      <TouchableOpacity style={[styles.fab, ShadowStyle]} onPress={() => navigation.navigate("GenerateTicket")}>
        <CustomIcon name='add' color={AppColors.white} size={30}/>
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
    marginVertical: 10,
    marginTop: 20

  },
  fab:{
    backgroundColor: AppColors.primary,
    borderRadius: 50, 
    width: 50, 
    height: 50,
    alignItems:'center',
    justifyContent:'center',
    position:'absolute',
    bottom: 50,
    right: 20
  }
})