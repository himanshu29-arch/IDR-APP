import { View, Text, StatusBar, Image, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { ImagePaths } from '../../utils/imagepaths'
import { AppColors } from '../../utils/colors'
import MyText from '../../components/customtext'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../utils/Dimensions'
import CustomIcon from '../../components/customIcon'
import CustomDropdown from '../../components/customDropdown'
import { IconsPath } from '../../utils/InconsPath'

export default function Dashboard() {
  const [select, setSelect] = useState('')
  return (
    <ScrollView>
            <StatusBar translucent/>
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
            <CustomIcon name='notifications-outline' />
          </View>
        </View>
      </View>
      {/* Card */}

      <View style={[styles.card, {marginTop: -SCREEN_HEIGHT * 0.2}]}>
        <MyText fontType="medium" style={{ fontSize: 18, marginVertical: 10 }}>Select Client</MyText>
        <MyText style={{ fontSize: 14, marginVertical: 10 }}>
          Lorem Ipsum is simply dummy text of the printing and type setting industry.
        </MyText>

        <CustomDropdown
          options={["nothing"]}
          defaultOption='Choose option'
          onSelect={setSelect}
          isDarker
        />
        <MyText fontType="medium" style={{ fontSize: 18 }}>Assignments</MyText>

        <FlatList
         
          data={[{
            id: 1,
            name: 'Open tasks',
            img: IconsPath.Opentasks
          }, {
            id: 2,
            name: 'Open work order',
            img: IconsPath.Openwork
          }]}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          renderItem={({item}) => 
            <View style={styles.assigncontainer}>
          <MyText style={styles.opentasks}>00</MyText>
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
      data={[{
        id: 1,
        tickt: "WO1000001853"
      }]}
      style={{marginBottom: 200}}
      renderItem={({item}) => 
      <TouchableOpacity style={{
        backgroundColor: AppColors.lightgrey, padding: 15,
        borderRadius: 5, justifyContent: 'space-between', flexDirection:'row'
      }}>
        <MyText style={{fontSize: 14}}>
          {item.tickt}
        </MyText>
        <CustomIcon name='chevron-forward'/>
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