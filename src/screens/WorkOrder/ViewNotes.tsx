import { View, StyleSheet, FlatList, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { AppColors } from "../../utils/colors";
import { SCREEN_WIDTH } from "../../utils/Dimensions";
import { ShadowStyle } from "../../utils/constants";
import MyText from "../../components/customtext";
import CustomButton from "../../components/customButton";
import axios from "axios";
import { BASE_URL } from "../../services/apiConfig";
import { useSelector } from "react-redux";
import Snackbar from "react-native-snackbar";
import { RootState } from "../../redux/store";
import { hp, wp } from "../../utils/resDimensions";
import { extractDateAndTime } from "../../utils/extractData_Time";

export default function ViewNotes({
  NotesData,
  refetchworkorder,
  NavigateToAddNote,
}) {
  const [notes, setNotes] = useState(NotesData);
  const [notesEdit, setNotesEdit] = useState({});
  const { userData } = useSelector((state: RootState) => state.auth);

  const handleChange = (val, key, index) => {
    const newData = [...notes];
    newData[index] = { ...newData[index], [key]: val };
    setNotes(newData);
  };
  useEffect(() => {
    setNotes(NotesData);
  }, [NotesData]);

  const onEditNote = async (index) => {
    const body = {
      work_order_id: notes[index].work_order_id,
      note_id: notes[index].note_id,
      comments: notes[index].comments,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}work_order/update_note`,
        body,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (response.status === 200) {
        Snackbar.show({
          text: response?.data?.message,
          duration: 4000,
          backgroundColor: AppColors.primary,
        });
        setNotesEdit((prevState) => ({
          ...prevState,
          [notes[index].note_id]: false,
        }));
        refetchworkorder(); // Refetch the work order data after successful update
      }
    } catch (error) {
      Snackbar.show({
        text: error?.response?.data?.message,
        duration: 4000,
        backgroundColor: AppColors.red,
      });
    }
  };

  const handleEditToggle = (note_id) => {
    setNotesEdit((prevState) => ({
      ...prevState,
      [note_id]: !prevState[note_id],
    }));
  };

  function renderNotes({ item, index }) {
    const isEditing = notesEdit[item.note_id] || false;
    const date_time = extractDateAndTime(item?.updated_at);
    return (
      <View style={[styles.innerCard, ShadowStyle]}>
        <MyText style={{ marginVertical: 5, color: AppColors.black }}>
          Comment
        </MyText>
        <View style={[styles.viewcontainer, styles.outlined]}>
          <TextInput
            // value={item.comments}
            value={item?.comments}
            onChangeText={(txt) => handleChange(txt, "comments", index)}
            style={[styles.default]}
            editable={isEditing}
            multiline
          />
        </View>
        <MyText style={{ marginVertical: 5, color: AppColors.black }}>
          User Name
        </MyText>
        <View style={[styles.viewcontainer, styles.outlined]}>
          <TextInput
            value={item?.profile?.first_name + " " + item?.profile?.last_name}
            style={[styles.default]}
            editable={false}
            multiline
          />
        </View>
        <MyText style={{ marginVertical: 5, color: AppColors.black }}>
          Date and Time
        </MyText>

        <View style={[styles.viewcontainer, styles.outlined]}>
          <TextInput
            value={date_time?.date + ", " + date_time?.time}
            style={[styles.default]}
            editable={false}
            multiline
          />
        </View>
        <View style={{ marginTop: hp(2) }}>
          {/* {userData?.user?.user_type !== "Client Employee" ? (
            isEditing ? (
              <CustomButton
                title={"Submit"}
                onPress={() => onEditNote(index)}
              />
            ) : (
              <CustomButton
                title={"Edit"}
                onPress={() => handleEditToggle(item.note_id)}
              />
            )
          ) : null} */}

          {userData?.user?.user_type !== "Client Employee" &&
            (userData?.user?.user_type !== "IDR Employee" ||
              (userData?.user?.user_type === "IDR Employee" &&
                userData?.user?.user_id === item?.profile?.user_id)) &&
            (isEditing ? (
              <CustomButton
                _width={wp(70)}
                title={"Submit"}
                onPress={() => onEditNote(index)}
              />
            ) : (
              <CustomButton
                _width={wp(70)}
                title={"Edit"}
                onPress={() => handleEditToggle(item.note_id)}
              />
            ))}
        </View>
      </View>
    );
  }

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
            Comments
          </MyText>
          {userData?.user?.user_type != "Client Employee" ? (
            <CustomButton
              title={"Add Note"}
              onPress={NavigateToAddNote}
              _width={wp(30)}
            />
          ) : null}
        </View>
        <View style={{ marginTop: 10 }}>
          <FlatList
            scrollEnabled={false}
            data={notes} // Use notes state here
            renderItem={renderNotes}
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
  innerCard: {
    backgroundColor: AppColors.white,
    width: SCREEN_WIDTH * 0.79,
    alignSelf: "center",
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    marginBottom: hp(1),
  },
  default: {
    width: "85%",
    borderRadius: 5,
    padding: 10,
    color: "black",
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
