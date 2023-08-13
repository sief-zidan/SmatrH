import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  UIManager,
  LayoutAnimation,
  Modal,
  ActivityIndicator,
  StatusBar,
  Image,
  Linking,
  Alert,
  TextInput,
} from 'react-native';

import {RFValue} from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import {useSelector} from 'react-redux';
import {COLORS, FONTS, icons, images, SIZES} from '../../../constants';
import DatePicker from 'react-native-date-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import moment from 'moment';
import {FormInput} from '../../../components';
import utils from '../../../utils';
import {useIsFocused} from '@react-navigation/native';
import {color} from 'react-native-reanimated';
import {ScrollView} from 'react-native-gesture-handler';

const CARD_HEIGHT = 220;
const CARD_WIDTH = SIZES.width * 0.8;
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const Home = ({navigation}) => {
  const [isFlash, setIsFlash] = useState(false);

  function onSuccess(e) {
    Alert.alert('Home', 'device added successfly');
    setshow_modal(false);
  }

  const [show_modal, setshow_modal] = React.useState(false);
  const [roomname, setroomname] = React.useState(false);

  const [data, setdata] = React.useState([
    {
      image:
        'https://wpmedia.roomsketcher.com/content/uploads/2021/12/06163639/Add-Storage-To-Your-Home-Office.jpg',
      name: 'home',
      total_device: '4',
      on: '1',
    },
    {
      image:
        'https://wpmedia.roomsketcher.com/content/uploads/2021/12/06163639/Add-Storage-To-Your-Home-Office.jpg',
      name: 'off',
      total_device: '3',
      on: '1',
    },
    {
      image:
        'https://wpmedia.roomsketcher.com/content/uploads/2021/12/06163639/Add-Storage-To-Your-Home-Office.jpg',
      name: 'room',
      total_device: '7',
      on: '1',
    },
  ]);

  function addroom() {
    let arr = [...data];
    let opj = {
      image:
        'https://wpmedia.roomsketcher.com/content/uploads/2021/12/06163639/Add-Storage-To-Your-Home-Office.jpg',
      name: roomname,
      total_device: '0',
      on: '0',
    };
    arr.push(opj);
    setdata(arr);
    setshow_modal(false);
  }

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <StatusBar backgroundColor={'#ddd'} />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <Image
          source={{
            uri: 'https://media.istockphoto.com/id/1309328823/photo/headshot-portrait-of-smiling-male-employee-in-office.webp?b=1&s=170667a&w=0&k=20&c=MRMqc79PuLmQfxJ99fTfGqHL07EDHqHLWg0Tb4rPXQc=',
          }}
          style={{
            height: 70,
            width: 70,
            borderRadius: 35,
          }}
        />
        <Text
          style={{
            fontSize: 20,
            fontFamily: FONTS.fontFamily,
            color: '#000',
          }}>
          Home Name
        </Text>
        <TouchableOpacity
          onPress={() => {
            setshow_modal(true);
          }}>
          <Image source={icons.add} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          alignItems: 'center',
          marginTop: 10,
        }}>
        <Text
          style={{
            ...FONTS.body1,
            color: '#000',
          }}>
          Hello Saif zid 👋
        </Text>
        <Text
          style={{
            ...FONTS.body4,
            color: '#848484',
          }}>
          Welcome to your home
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 20,
        }}>
        <View
          style={{
            height: 150,
            width: 100,
            backgroundColor: '#EA1763',
            borderRadius: 30,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <Image source={icons.cloud} />
          <Text
            style={{
              ...FONTS.body2,
              color: '#fff',
            }}>
            27 °C
          </Text>

          <Text
            style={{
              ...FONTS.body2,
              color: '#fff',
            }}>
            Tanta
          </Text>
        </View>
        <View
          style={{
            height: 150,
            width: 100,
            backgroundColor: '#5B17EA',
            borderRadius: 30,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <Image source={icons.volt} />
          <Text
            style={{
              ...FONTS.body2,
              color: '#fff',
              textAlign: 'center',
            }}>
            13
          </Text>

          <Text
            numberOfLines={1}
            style={{
              ...FONTS.body2,
              color: '#fff',
            }}>
            Active device
          </Text>
        </View>
        <View
          style={{
            height: 150,
            width: 100,
            backgroundColor: '#EA8917',
            borderRadius: 30,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <Image source={icons.volt} />
          <Text
            style={{
              ...FONTS.body2,
              color: '#fff',
              textAlign: 'center',
            }}>
            312{'\n'} kwh
          </Text>

          <Text
            style={{
              ...FONTS.body2,
              color: '#fff',
            }}>
            used
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',

          alignItems: 'center',
          marginTop: 10,
        }}>
        <View
          style={{
            backgroundColor: '#000',
            borderRadius: 15,
            marginHorizontal: 10,
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
            3
          </Text>
        </View>
        <Text
          style={{
            fontSize: 20,
            fontFamily: FONTS.fontFamily,
            color: '#000',
          }}>
          Rooms
        </Text>
      </View>

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          {data.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('RoomDeatils');
              }}
              style={{
                backgroundColor: '#F0F0F0',
                borderRadius: 30,
                // alignItems: 'center',
                marginTop: 30,
                height: 260,
                width: 180,
                borderRadius: 20,
                marginLeft: 8,
                marginRight: index == data.length - 1 ? 10 : 0,
              }}>
              <Image
                source={{
                  uri: item.image,
                }}
                style={{
                  height: 150,
                  width: '100%',
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                }}
                resizeMode="cover"
              />
              <Image
                source={icons.pc}
                style={{
                  marginTop: 10,
                  alignSelf: 'center',
                }}
              />

              <Text
                style={{
                  ...FONTS.body3,
                  color: '#000',
                  textAlign: 'center',
                }}>
                {item.name}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 20,
                      marginLeft: 5,
                    }}>
                    {item.total_device}{' '}
                  </Text>

                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: FONTS.fontFamily,
                      color: '#B9B7BB',
                    }}>
                    devices
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 20,
                    }}>
                    {item.on}{' '}
                  </Text>

                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: FONTS.fontFamily,
                      color: COLORS.red,
                      marginRight: 5,
                    }}>
                    on
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={show_modal}
        onRequestClose={() => {
          setshow_modal(false);
        }}
        animationType="slide">
        <TouchableOpacity
          onPress={() => {
            setshow_modal(false);
          }}
          style={{
            margin: 15,
          }}>
          <Image source={icons.Backview} />
        </TouchableOpacity>

        <TextInput
          style={{
            width: '90%',
            // height: 50,
            // backgroundColor: '#ddd',
            borderWidth: 2,
            alignSelf: 'center',
            marginTop: 20,
            borderRadius: 15,
            borderColor: '#B6B6B6',
            padding: 15,
          }}
          placeholder="Enter your room name"
          value={roomname}
          onChangeText={value => {
            setroomname(value);
          }}
        />

        <TouchableOpacity
          onPress={() => {
            addroom();
          }}
          style={{
            // width: 250,
            // height: 100,
            alignSelf: 'center',
            backgroundColor: COLORS.red,
            marginTop: 50,
            alignItems: 'center',
            padding: 15,
            borderRadius: 30,
          }}>
          <Text
            style={{
              fontSize: 25,

              alignSelf: 'center',
              fontFamily: FONTS.fontFamily,
              color: '#fff',
            }}>
            Add Room
          </Text>
        </TouchableOpacity>
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

export default Home;
