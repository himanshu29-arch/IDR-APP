import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigation from './BottomNavigator';
import { NavigationContainer } from '@react-navigation/native';
import Splash from '../screens/Splash/Splash';
import Login from '../screens/Login/Login';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import NewWorkOrder from '../screens/WorkOrder/AddTechnician';
import GenerateTicket from '../screens/WorkOrder/GenerateTicket';
import AddTechnician from '../screens/WorkOrder/AddTechnician';
import AddNote from '../screens/WorkOrder/AddNote';
import ViewWorkOrder from '../screens/WorkOrder/ViewWorkOrder';

const Stack = createNativeStackNavigator();

export default function EntryStack() {
  const [splash, setSplash] = useState(true);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)


  useEffect(() => {
    setTimeout(() => {
      setSplash(false)
    }, 2500);
  }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        {
          splash ?
            <Stack.Screen name="Splash" component={Splash} />
            :
            isLoggedIn ?
            <>
            <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
            <Stack.Screen name="GenerateTicket" component={GenerateTicket} />
            <Stack.Screen name="AddTechnician" component={AddTechnician} />
            <Stack.Screen name="AddNote" component={AddNote} />
            <Stack.Screen name="ViewWorkOrder" component={ViewWorkOrder} />
            
            </>
            :
            <Stack.Screen name="Login" component={Login} />
            
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}