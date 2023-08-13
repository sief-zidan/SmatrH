import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
// import {AuthMain} from '../screens/authScreens';


import {  Faq, ForgetPassword, Login, SeconedStepVerify, RegisterSuccess, Signup, SetupHome, Country} 
from '../screens/authScreens';



const Stack = createStackNavigator();
const AuthStack = () => {
  return (
    // <Stack.Navigator
    //   screenOptions={{
    //     gestureDirection: 'horizontal',
    //     ...TransitionPresets.SlideFromRightIOS,
    //     headerShown: false,
    //   }}
    //   initialRouteName="AuthMain">
    //   <Stack.Screen name="AuthMain" component={AuthMain} />
    // </Stack.Navigator>
     <Stack.Navigator
      screenOptions={{
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}
      initialRouteName="Login"
      >
      
       <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
     <Stack.Screen name="SeconedStepVerify" component={SeconedStepVerify} />
     <Stack.Screen name="Faq" component={Faq} />
       <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      {/*<Stack.Screen name="NewPassword" component={NewPassword} /> */}
      <Stack.Screen name="RegisterSuccess" component={RegisterSuccess} />
      <Stack.Screen name="SetupHome" component={SetupHome} />
      <Stack.Screen name="Country" component={Country} />

 

     
    </Stack.Navigator>
  );
};

export default AuthStack;
