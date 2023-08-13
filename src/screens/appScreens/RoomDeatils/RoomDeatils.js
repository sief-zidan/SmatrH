import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Modal,
  Linking,
  StatusBar,
  Image,
  ImageBackground,
  Switch
} from 'react-native';
import {
  COLORS,
  FONTS,
  SIZES,
  images,
  icons,
  dummyData,
} from '../../../constants';
import SwitchToggle from 'react-native-switch-toggle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
const RoomDeatils = ({navigation, route}) => {
  const [isFlash, setIsFlash] = React.useState(false);
  const [show_modal, setshow_modal] = React.useState(false)

  function onSuccess (e) {
    Alert.alert('Home' , 'device added successfly')
   setshow_modal(false)
    };
  const [data, setdata] = React.useState([
    {
      on: false,
      name: 'smart lamp',
      describtion: 'warm',
    },
    {
      on: true,
      name: 'Air condation',
      describtion: 'warm',
    },
    {
      on: true,
      name: 'smart tv',
      describtion: 'warm',
    },
    {
      on: true,
      name: 'cctv',
      describtion: 'warm',
    },
    {
      on: true,
      name: 'water',
      describtion: 'warm',
    },
  ]);
  function toggleSwitch (index){
    let alldata = [...data];
    alldata[index].on = !alldata[index].on;
    setdata(alldata);
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F0EFF1',
      }}>
      <ImageBackground
        source={{
          uri: 'https://wpmedia.roomsketcher.com/content/uploads/2021/12/06163639/Add-Storage-To-Your-Home-Office.jpg',
        }}
        style={{
          height: 250,
          width: '100%',
        }}>
          <View
          style={{
            flexDirection:'row', 
            justifyContent:"space-between", 
            alignItems:'center' , 

          }}
          >
          <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            margin: 15,
          }}>
          <Image source={icons.Backview} />
        </TouchableOpacity>
        <TouchableOpacity
         style={{
          margin: 15,
        }}
          onPress={() => {
            setshow_modal(true);
          }}>
          <Image source={icons.add} />
        </TouchableOpacity>
          </View>
       
      </ImageBackground>
      <View
        style={{
          alignItems: 'center',
          marginTop: 10,
        }}>
        <Text
          style={{
            ...FONTS.body1,
            color: '#000',
            fontWeight: '400',
          }}>
          Living Room
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',

          alignItems: 'center',
          marginTop: 10,
          marginBottom: 10,
          marginLeft:10
        }}>
        <View
          style={{
            backgroundColor: '#000',
            borderRadius: 15,
            marginHorizon2tal: 10,
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 20,
            }}>
            {data.length}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 20,
            fontFamily: FONTS.fontFamily,
            color: '#000',
            marginLeft: 10,
          }}>
          Devices
        </Text>
      </View>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
          }}>
          {data.map((item, index) => (
            <View
              style={{
                height: 160,
                width: '45%',
                backgroundColor: '#fff',
                borderRadius: 20,
                margin: 5,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: 10,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    ...FONTS.body2,
                    fontFamily: FONTS.fontFamily,
                    fontWeight: 'bold',
                    color: item.on ? COLORS.red : '#000',
                  }}>
               
                  {item.on ? 'on' : 'off'}
                </Text>
                 <SwitchToggle
                  switchOn={item.on}
                  onPress={() => toggleSwitch(index)}
                  circleColorOff="#000"
                  circleColorOn="#fff"
                  backgroundColorOn={COLORS.red}
                  backgroundColorOff="#C4C4C4"
                  duration={100}
                  containerStyle={{
                    width: 40,
                    height: 23,
                    borderRadius: 25,
                    padding: 5,
                  }}
                  circleStyle={{
                    width: 15,
                    height: 15,
                    borderRadius: 20,
                  }}
                />  

                
              </View>
              <View
                style={{
                  alignSelf: 'center',
                  marginTop: 20,
                }}>
                <Image
                  source={icons.pc}
                  style={{
                    alignSelf: 'center',
                  }}
                />
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontFamily: FONTS.fontFamily,
                    fontSize: 17,
                    marginTop: 5,
                    textAlign: 'center',
                  }}>
                  {item.name}
                </Text>
                <Text
                  style={{
                    ...FONTS.body4,
                    color: '#848484',
                    textAlign: 'center',
                    marginTop: 5,
                  }}>
                  {item.describtion}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <Modal
      visible={show_modal}
      onRequestClose={()=>{
        setshow_modal(false);

      }}
      animationType='slide'
      >
        

 
      <TouchableOpacity
          onPress={() => {
            setshow_modal(false);
          }}
          style={{
            margin: 15,
          }}>
          <Image source={icons.Backview} />
        </TouchableOpacity>
   

       
      <QRCodeScanner
            reactivate={true}
            showMarker={true}
            markerStyle={{
              borderRadius: 20,
              borderColor: COLORS.red,
            }}
            flashMode={
              isFlash
                ? RNCamera.Constants.FlashMode.torch
                : RNCamera.Constants.FlashMode.off
            }
              onRead={e => {
              onSuccess(e);
            }}
            topContent={
              <Text style={[styles.centerText,{
                textAlign:'center'
              }]}>
                Please move your camera {'\n'} over the QR Code
              </Text>
            }
          
            bottomContent={
              <TouchableOpacity
                onPress={() => {
                  setIsFlash(!isFlash);
                 }}
                style={{
                  backgroundColor: COLORS.red,
                  width: 100,
                  height: 100,
                  borderRadius: 120 / 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                   <MaterialCommunityIcons
                  name={isFlash ? 'flash' : 'flash-off'}
                  size={40}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            }
          />
         
    
      </Modal>
      
    </View>
  );
};


const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

 


export default RoomDeatils;



