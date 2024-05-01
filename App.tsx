import { View, Text } from 'react-native'
import React from 'react'
import Splash from './src/screens/Splash/Splash'
import Login from './src/screens/Login/Login'
import EntryStack from './src/navigation/EntryStack'

export default function App() {
  return (
    <EntryStack/>
  )
}