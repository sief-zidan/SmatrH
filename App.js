import React, {useState, useEffect} from 'react';
import {View, Platform, StatusBar} from 'react-native';
import Toast from 'react-native-toast-message';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {
  modifyIsFirst,
  modifyNetInfo,
  setUser,
} from './src/redux/reducers/UserReducer';
import Auth from './src/Services';
import NetInfo from '@react-native-community/netinfo';
import {COLORS} from './src/constants';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {AppStack, AuthStack} from './src/navigation';
import Onboarding from './src/screens/Onboarding';
import SplashScreen from './SplashScreen';
import { MenuProvider } from 'react-native-popup-menu';

const Stack = createStackNavigator();
const ObBoardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}
      initialRouteName="Onboarding">
      <Stack.Screen name="Onboarding" component={Onboarding} />
    </Stack.Navigator>
  );
};
 


const App = () => {
  const dispatch = useDispatch();
  const {login, first} = useSelector(state => state.UserReducer);
  const [loginChk, setloginChk] = useState(true);
  useEffect(() => {
    getUser();
    NetInfo.addEventListener(state => {
      dispatch(modifyNetInfo(state.isInternetReachable));
    });
  }, []);

  const getUser = async () => {
    let data = await Auth.getAccount();
    let isFirst = await Auth.getFirst();

    if (isFirst != '1') {
      dispatch(modifyIsFirst(true));
    }
    if (data != null) {
      dispatch(setUser(data));
    }

    setTimeout(() => {
      setloginChk(false);
    }, 2300);
  };

  if (loginChk) {
    return <SplashScreen />;
  }


  return (
    // <SafeAreaView style={{flex: 1}}>
    //   <StatusBar backgroundColor={COLORS.primary} />
    //   <NavigationContainer>
    //     {first ? <ObBoardStack /> : login ? <AppStack /> : <AuthStack />}
    //   </NavigationContainer>
    //   <Toast />
    // </SafeAreaView>


<SafeAreaView style={{ flex: 1 }}>
<StatusBar translucent backgroundColor={COLORS.black}/>
<MenuProvider>
  <NavigationContainer>
    {first ? <ObBoardStack /> :
    login ? <AppStack /> : <AuthStack />}
  </NavigationContainer>
  <Toast />
</MenuProvider>


</SafeAreaView>



  );
};

export default App;
