import React, {useState} from 'react';
import {View, Text, ScrollView, Image, StyleSheet,ImageBackground , TouchableOpacity} from 'react-native';

import {FormInput, Header} from '../../../components';
import {COLORS, FONTS, icons, images, SIZES} from '../../../constants';
import {useDispatch, useSelector} from 'react-redux';
import Auth from '../../../Services';
import {removeUser} from '../../../redux/reducers/UserReducer';
import {RFValue} from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import {Button} from 'react-native-paper';

 
const Settings = ({navigation}) =>  {
 
 
  return (
   <View style={{
    flex:1, 
    backgroundColor:'#fff'
   }}>
      <View
        style={{
     
          alignItems: 'center',
          marginVertical: 10,

        }}>
        
        <Text
          style={{
            fontSize: 22,
            fontFamily: FONTS.fontFamily,
            color: '#000',
          }}>
            Settings
        </Text>
        
      </View>



      <TouchableOpacity
      onPress={()=>{
        navigation.navigate('Profile')
         
      }}
            style={{
              // height: 100,
              width: '95%',
              backgroundColor: '#F0F0F0',
              borderRadius: 25,
              // justifyContent: 'space-around',
              alignItems: 'center',
              flexDirection: 'row',
              alignSelf: 'center',
              padding: 15,
              marginBottom: 10,
            }}>
            <View
              style={{
                // width: '15%',
              }}>
              <Image
                source={ icons.personimg}
                style={{
                  height :50 , 
                  width : 50
                }}
              />
            </View>

            <View
              style={{
                // width: '50%',
              }}>
              <Text
                style={{
                  color: '#000',
                  fontWeight: 'bold',
                  ...FONTS.body2, 
                  marginLeft:20
                }}>
                {'Profile'}
              </Text>
              
            </View>

           
          </TouchableOpacity>

          <TouchableOpacity
          onPress={()=>{
            navigation.navigate('Notefication')
            
          }}
            style={{
              // height: 100,
              width: '95%',
              backgroundColor: '#F0F0F0',
              borderRadius: 25,
              // justifyContent: 'space-around',
              alignItems: 'center',
              flexDirection: 'row',
              alignSelf: 'center',
              padding: 15,
              marginBottom: 10,
            }}>
            <View
              style={{
                // width: '15%',
              }}>
              <Image
                source={ icons.notfi}
                style={{
                  height :50 , 
                  width : 50
                }}
              />
            </View>

            <View
              style={{
                // width: '50%',
              }}>
              <Text
                style={{
                  color: '#000',
                  fontWeight: 'bold',
                  ...FONTS.body2, 
                  marginLeft:20
                }}>
                {'Notification'}
              </Text>
              
            </View>

           
          </TouchableOpacity>

   </View>
  );
};
 

export default Settings;
