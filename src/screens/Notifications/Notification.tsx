import {
  View,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  Pressable,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AppColors } from "../../utils/colors";
import MyText from "../../components/customtext";
import CustomIcon from "../../components/customIcon";
import { BASE_URL } from "../../services/apiConfig";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import EquipmentCard from "../../components/EquipmentCard";
import { Toast } from "react-native-toast-notifications";
import { wp } from "../../utils/resDimensions";
import Loader from "../../components/Loader";

export default function Notifications({ navigation }) {
  const { userData } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [invitationData, setInvitationData] = useState([]);
  useEffect(() => {
    getInvitationDataApi();
  }, []);
  const onRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      getInvitationDataApi();
      setIsRefreshing(false);
    }, 2000);
  }, []);

  const getInvitationDataApi = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}equipment/invitations`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      if (response.status === 200) {
        setIsLoading(false);
        setInvitationData(response?.data?.invitations);
      }
    } catch (error) {
      console.log("🚀 ~ getWorkOrderByClientId ~ error:", error);
      setIsLoading(false);
    }
  };

  const invitationAcceptApi = async (equipment_id) => {
    try {
      const body = {
        is_accepted: true,
        assign_equip_id: equipment_id,
      };
      console.log("🚀 ~ invitationAcceptRejectApi ~ body:", body);
      const response = await axios.post(`${BASE_URL}equipment/accept`, body, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      if (response.status === 200) {
        Toast.show(response?.data?.message, {
          type: "success",
        });
        navigation.goBack();
      }
    } catch (error) {
      Toast.show(error?.response?.data?.message, {
        type: "danger",
      });
      console.log(
        "🚀 ~ invitation accept request error:",
        error?.response?.data
      );
      setIsLoading(false);
    }
  };
  const invitationRejectApi = async (equipment_id) => {
    try {
      const body = {
        is_accepted: false,
        assign_equip_id: equipment_id,
      };
      console.log("🚀 ~ invitationAcceptRejectApi ~ body:", body);
      const response = await axios.post(`${BASE_URL}equipment/accept`, body, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      if (response.status === 200) {
        console.log(
          "🚀 ~ invitationAcceptRejectApi ~ response:",
          response?.data
        );
        Toast.show(response?.data?.message, {
          type: "success",
        });
        navigation.goBack();
        console.log(response?.data);
      }
    } catch (error) {
      Toast.show(error?.response?.data?.message, {
        type: "danger",
      });
      console.log(
        "🚀 ~ invitation reject request error:",
        error?.response?.data
      );
      setIsLoading(false);
    }
  };

  function onAcceptPress(eq_id) {
    invitationAcceptApi(eq_id);
  }
  function onRejectPress(eq_id) {
    invitationRejectApi(eq_id);
  }

  async function onReturnPress(eq_id) {
    console.log(
      "🚀 ~ onReturnPress ~ eq_id:",
      `${BASE_URL}equipment/return_request/${eq_id}`
    );
    console.log(userData.token);
    try {
      const response = await axios.patch(
        `${BASE_URL}equipment/return_request/${eq_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      if (response.status === 200) {
        Toast.show(response?.data?.message, {
          type: "success",
        });
        console.log(response?.data);
      }
    } catch (error) {
      console.log("🚀 ~ return request:", error?.response?.data);
      Toast.show(error.response?.data?.message, {
        type: "danger",
      });
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView
      style={{ backgroundColor: AppColors.white, flex: 1, padding: 10 }}
    >
      <StatusBar
        backgroundColor={AppColors.white}
        barStyle={"dark-content"}
        translucent={false}
      />
      <Loader loading={isLoading} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: wp(6),
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
          Notifications
        </MyText>
      </View>

      {invitationData.length == 0 ? (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <MyText>No Notifications</MyText>
        </View>
      ) : (
        <FlatList
          data={invitationData}
          renderItem={({ item }) =>
            EquipmentCard({ item, onAcceptPress, onRejectPress, onReturnPress })
          }
          refreshControl={
            <RefreshControl
              colors={[AppColors.primary]}
              refreshing={isRefreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
