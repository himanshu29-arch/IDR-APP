import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  StatusBar,
  FlatList,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AppColors } from "../../utils/colors";
import { SCREEN_WIDTH } from "../../utils/Dimensions";
import { ShadowStyle } from "../../utils/constants";
import MyText from "../../components/customtext";
import CustomButton from "../../components/customButton";
import { useUpdateTechnicianMutation } from "../../services/RTKClient";
import { useToast } from "react-native-toast-notifications";
import { fp, hp, wp } from "../../utils/resDimensions";

export default function ViewAssignees({ assignees, refetchworkorder }) {
  const [techniciansdata, setTechniciansdata] = useState(assignees);
  const [technicianEdit, setTechnicianEdit] = useState(false);
  const [updateTechnician, { isLoading }] = useUpdateTechnicianMutation();
  const toast = useToast();

  const handleChange = (val, key, index) => {
    const newData = [...techniciansdata];
    newData[index] = { ...newData[index], [key]: val };
    setTechniciansdata(newData);
  };

  const onSubmit = () => {
    console.log(techniciansdata);
    const body = {
      technician_id: techniciansdata[0]?.technician_id,
      work_order_id: techniciansdata[0]?.work_order_id,
      technician_name: techniciansdata[0]?.technician_name,
      project_manager: techniciansdata[0]?.project_manager,
      service_request: techniciansdata[0]?.service_request,
      other_details: techniciansdata[0]?.other_details,
      procedures: techniciansdata[0]?.procedures,
    };
    // console.log("BODY", techniciansdata[0]);

    // return

    updateTechnician(body)
      .unwrap()
      .then((payload) => {
        refetchworkorder();
        setTechnicianEdit(false);
        toast.show(payload.message, {
          type: "success",
        });
      })
      .catch((error) => {
        toast.show(error.data.message, {
          type: "danger",
        });
      });
  };

  return (
    <View>
      <View style={[styles.card, ShadowStyle]}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <MyText fontType="bold" style={{ fontSize: 22 }}>
            Technicians And Managers
          </MyText>
          {/* { technicianEdit ?
                     <CustomButton
                     title={"Submit"}
                     onPress={() => onSubmit()}
                     />
                     :
                     <CustomButton
                     title={"Edit"}
                     onPress={() => setTechnicianEdit(true)}
                     />
                   } */}
        </View>

        <View style={{ marginTop: 10 }}>
          <FlatList
            scrollEnabled={false}
            data={techniciansdata}
            renderItem={({ item, index }) => (
              <>
                <View style={[styles.innerCard, ShadowStyle]}>
                  <MyText style={{ marginVertical: 5, color: AppColors.black }}>
                    Technician Name
                  </MyText>
                  <View style={[styles.viewcontainer, styles.outlined]}>
                    <TextInput
                      value={item.technician_name}
                      onChangeText={(txt: string) =>
                        handleChange(txt, "technician_name", index)
                      }
                      style={[styles.default]}
                      editable={technicianEdit}
                      multiline
                    />
                  </View>

                  <MyText style={{ marginVertical: 5, color: AppColors.black }}>
                    Project Manager{" "}
                  </MyText>
                  <View style={[styles.viewcontainer, styles.outlined]}>
                    <TextInput
                      value={item.project_manager}
                      onChangeText={(txt: string) =>
                        handleChange(txt, "project_manager", index)
                      }
                      style={[styles.default]}
                      editable={technicianEdit}
                      multiline
                    />
                  </View>
                </View>
              </>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: AppColors.white,
    padding: 10,
  },
  mainrow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    backgroundColor: AppColors.white,
    width: SCREEN_WIDTH * 0.9,
    alignSelf: "center",
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
  },
  default: {
    borderRadius: 5,
    color: "black",
    padding: 10,
  },
  innerCard: {
    backgroundColor: AppColors.white,
    width: SCREEN_WIDTH * 0.79,
    alignSelf: "center",
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    marginBottom: hp(1),
  },
  outlined: {
    borderWidth: 1,
    borderRadius: 10,
  },
  notoutlined: {
    borderBottomWidth: 1,
  },
  viewcontainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: AppColors.darkgrey,
  },
  err: {
    color: AppColors.red,
    fontSize: 12,
    margin: 5,
  },
});
