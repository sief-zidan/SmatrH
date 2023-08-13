import React from 'react';
import {TransitionPresets} from '@react-navigation/stack';
import BottomTab from './BottomTab';
import MyShipments from '../screens/appScreens/Shipments/MyShipments';
import Mytrips from '../screens/appScreens/Shipments/Mytrips';
import {createStackNavigator} from '@react-navigation/stack';
import ShipmentDetails from '../screens/appScreens/ShipmentDetails';
import {AddShipment, AddTrip, Chat} from '../screens/appScreens';
 
import RoomDeatils from '../screens/appScreens/RoomDeatils/RoomDeatils';
import Statistics from '../screens/appScreens/Statistec/Statistics'

import Profile from '../screens/appScreens/Profile/Profile'

import Notefication from '../screens/appScreens/Noti/Notefication'


 const Stack = createStackNavigator();
const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}
      initialRouteName="MainStack">
      <Stack.Screen name="MainStack" component={BottomTab} />
      <Stack.Screen name="RoomDeatils" component={RoomDeatils} />
      <Stack.Screen name="Statistics" component={Statistics} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Notefication" component={Notefication} />



      {/* <Stack.Screen name="MyShipments" component={MyShipments} />
      <Stack.Screen name="Mytrips" component={Mytrips} />
      <Stack.Screen name="ShipmentDetails" component={ShipmentDetails} />
      <Stack.Screen name="AddShipment" component={AddShipment} />
      <Stack.Screen name="AddTrip" component={AddTrip} />
      <Stack.Screen name="Chat" component={Chat} /> */}
    </Stack.Navigator>
  );
};

export default AppStack;
