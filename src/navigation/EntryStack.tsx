import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavigation from './BottomNavigator';
import { NavigationContainer } from '@react-navigation/native';
import Splash from '../screens/Splash/Splash';
import Login from '../screens/Login/Login';

const Stack = createNativeStackNavigator();

export default function EntryStack() {
  const [splash, setSplash] = useState(true);


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
            <>
             {/* <Stack.Screen name="Login" component={Login} /> */}
             <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
             </>
            
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}