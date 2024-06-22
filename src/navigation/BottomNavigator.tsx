import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Dashboard from "../screens/Dashboard/Dashboard";
import { Image, Platform, StyleSheet } from "react-native";
import { IconsPath } from "../utils/InconsPath";
import { AppColors } from "../utils/colors";
import MyText from "../components/customtext";
import WorkOrder from "../screens/WorkOrder/WorkOrder";
import Inventory from "../screens/Inventory/Inventory";
import Equipment from "../screens/Equipment/Equipment";
import Settings from "../screens/Settings/Settings";
import { hp } from "../utils/resDimensions";

const Tab = createBottomTabNavigator();

export default function BottomNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        tabBarActiveTintColor: "#e91e63",
        headerShown: false,
        tabBarActiveBackgroundColor: AppColors.primary,
        tabBarInactiveBackgroundColor: AppColors.primary,
        tabBarStyle: { height: Platform.OS == "ios" ? hp(11) : hp(8) },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: ({ focused }) => (
            <MyText
              fontType="medium"
              style={[
                styles.tabBarLabel,
                {
                  color: focused ? AppColors.white : AppColors.InActiveBottomC,
                },
              ]}
            >
              Dashboard
            </MyText>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              style={{ width: 25, height: 25 }}
              source={focused ? IconsPath.HomeActive : IconsPath.HomeIn}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Work Order"
        component={WorkOrder}
        options={{
          tabBarLabel: ({ focused }) => (
            <MyText
              fontType="medium"
              style={[
                styles.tabBarLabel,
                {
                  color: focused ? AppColors.white : AppColors.InActiveBottomC,
                },
              ]}
            >
              Work order
            </MyText>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              style={{ width: 25, height: 25 }}
              source={focused ? IconsPath.Workactive : IconsPath.WorkIn}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Inventory"
        component={Inventory}
        options={{
          tabBarLabel: ({ focused }) => (
            <MyText
              fontType="medium"
              style={[
                styles.tabBarLabel,
                {
                  color: focused ? AppColors.white : AppColors.InActiveBottomC,
                },
              ]}
            >
              Inventory
            </MyText>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              style={{ width: 25, height: 25 }}
              source={focused ? IconsPath.Inventory : IconsPath.InventoryIn}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Equipment"
        component={Equipment}
        options={{
          tabBarLabel: ({ focused }) => (
            <MyText
              fontType="medium"
              style={[
                styles.tabBarLabel,
                {
                  color: focused ? AppColors.white : AppColors.InActiveBottomC,
                },
              ]}
            >
              Equipment
            </MyText>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              style={{ width: 25, height: 25 }}
              source={focused ? IconsPath.Equipment : IconsPath.EquipmentIn}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: ({ focused }) => (
            <MyText
              fontType="medium"
              style={[
                styles.tabBarLabel,
                {
                  color: focused ? AppColors.white : AppColors.InActiveBottomC,
                },
              ]}
            >
              Settings
            </MyText>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              style={{ width: 25, height: 25 }}
              source={focused ? IconsPath.Settings : IconsPath.SettingsIna}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 12,
    bottom: 9,
  },
});
