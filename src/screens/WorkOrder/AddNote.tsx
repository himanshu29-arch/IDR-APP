import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import CustomDropdown from "../../components/customDropdown";
import CustomInput from "../../components/customInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  addNote,
  addNoteSchema,
  generateTicket,
  technicianName,
} from "../../utils/validationScemas";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddNoteMutation,
  useAddWorkOrderMutation,
  useGetAllClientQuery,
  useGetLocationByClientQuery,
} from "../../services/RTKClient";
import CustomButton from "../../components/customButton";
import { SafeAreaView } from "react-native";
import CustomIcon from "../../components/customIcon";
import MyText from "../../components/customtext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppColors } from "../../utils/colors";
import { SCREEN_WIDTH } from "../../utils/Dimensions";
import { ShadowStyle } from "../../utils/constants";
import { useToast } from "react-native-toast-notifications";
import Loader from "../../components/Loader";
import Snackbar from "react-native-snackbar";
import { BASE_URL } from "../../services/apiConfig";
import axios from "axios";
import { RootState } from "../../redux/store";
import { hp, wp } from "../../utils/resDimensions";

export default function AddNote({ navigation, route }) {
  const { OrderId } = route.params;
  console.log("🚀 ~ AddNote ~ OrderId:", OrderId);
  const { userData } = useSelector((state: RootState) => state.auth);

  const [addNote, { isLoading }] = useAddNoteMutation();
  const [comment, setComment] = useState("");
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
      DeliverableInstructions: "",
    },
    resolver: yupResolver(addNoteSchema),
  });

  // const onsubmit = (data) => {
  //   const {
  //     parts,
  //     LabelingMethodology,
  //     EquipmentRequired,
  //     RequireDeliverables,
  //     DeliverableInstructions,
  //   } = data;
  //   const body = {
  //     work_order_id: workOrder,
  //     parts: parts,
  //     labeling_methodology: LabelingMethodology,
  //     equipment_installation: EquipmentRequired,
  //     required_deliverables: RequireDeliverables,
  //     deliverable_instructions: DeliverableInstructions,
  //   };

  //   addNote(body)
  //     .unwrap()
  //     .then((payload) => {
  //       toast.show(payload.message, {
  //         type: "success",
  //       });
  //       navigation.navigate("BottomNavigation");
  //     })
  //     .catch((error) => {
  //       toast.show(error.data.message, {
  //         type: "danger",
  //       });
  //     });
  // };

  const onsubmit = async () => {
    const body = {
      work_order_id: OrderId,
      comments: comment,
    };
    console.log("🚀 ~ onSubmit ~ body:", body);
    try {
      const response = await axios.post(
        `${BASE_URL}work_order/note/add`,
        body,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (response.status === 200) {
        navigation.navigate("ViewWorkOrder", {
          OrderId: OrderId,
        });
        Snackbar.show({
          text: response?.data?.message,
          duration: 4000,
          backgroundColor: AppColors.primary,
        });
      }
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
      Snackbar.show({
        text: error?.response?.data?.message,
        duration: 4000,
        backgroundColor: AppColors.red,
      });
    }
  };

  return (
    <SafeAreaView style={styles.conatiner}>
      <Loader loading={isLoading} />
      <View style={styles.mainrow}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: wp(5),
          }}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              padding: 5,
              borderRadius: 50,
              borderColor: AppColors.iconsGrey,
              borderWidth: 1,
            }}
          >
            <CustomIcon name="arrow-back" />
          </Pressable>
          <MyText fontType="bold" style={{ marginLeft: 20, fontSize: 20 }}>
            Add Comments
          </MyText>
        </View>
        <View style={{ marginRight: wp(5) }}>
          <CustomIcon size={25} name="notifications-outline" />
        </View>
      </View>
      <KeyboardAwareScrollView>
        <View style={[styles.card, ShadowStyle]}>
          <View>
            {/* <CustomInput
              control={control}
              name="parts"
              label="Parts"
              errors={errors}
            />

            <CustomInput
              control={control}
              name="LabelingMethodology"
              label="Labeling Methodology"
              errors={errors}
            />
            <CustomInput
              control={control}
              name="EquipmentRequired"
              label="Equipment Required"
              errors={errors}
            />

            <CustomInput
              control={control}
              name="RequireDeliverables"
              label="Require Deliverables"
              errors={errors}
            />*/}
            <MyText style={{ marginVertical: 5, color: AppColors.black }}>
              Comment
            </MyText>
            <View style={[styles.viewcontainer, styles.outlined]}>
              <TextInput
                value={comment}
                onChangeText={setComment}
                style={[styles.default]}
                multiline
              />
            </View>
            <View style={{ marginTop: 30 }}>
              <CustomButton
                _width={wp(80)}
                title="Submit"
                onPress={onsubmit}
                isdisabled={!comment}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
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
    marginVertical: hp(3),
  },
  viewcontainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: AppColors.darkgrey,
  },
  outlined: {
    borderWidth: 1,
    borderRadius: 10,
  },
  default: {
    width: "85%",
    borderRadius: 5,
    padding: 10,
    color: "black",
  },
});
