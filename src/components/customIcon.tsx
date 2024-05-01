// CustomIcon.js
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';


type props = {
    name:string;
    size?: number;
    color?: string;
    iconLibrary?: string;
    onPress?: () => void;
}

const CustomIcon = ({ name, size = 20, color = '#000', iconLibrary, onPress }: props) => {
 
    let SelectedIcon;
    switch (iconLibrary) {
        case 'MaterialIcons':
            SelectedIcon =  <MaterialIcons name={name} size={size} color={color} onPress={onPress}/>;
            break;
        case 'MaterialCommunityIcons':``
        
            SelectedIcon =  <MaterialCommunityIcons name={name} size={size} color={color} onPress={onPress}/>;
            break;
        case 'Entypo':
            SelectedIcon =  <Entypo name={name} size={size} color={color} onPress={onPress}/>;
            break;
        default:
            SelectedIcon =  <Ionicons name={name} size={size} color={color} onPress={onPress}/>;
    }

return SelectedIcon;
};

export default CustomIcon;
