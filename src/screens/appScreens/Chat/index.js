import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  SectionList,
  ToastAndroid,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {COLORS, FONTS, images} from '../../../constants';
import database from '@react-native-firebase/database';
import {useSelector} from 'react-redux';
import {Avatar} from 'react-native-paper';
import MsgComponent from './MsgComponent';
const Chat = ({navigation, route}) => {
  //   const {receiverData} = route.params;
  const {userData} = useSelector(state => state.UserReducer);
  const [msg, setMsg] = useState('');
  const [update, setupdate] = useState(false);
  const [disabled, setdisabled] = useState(false);
  const [allChat, setallChat] = useState([
    {
      from: '20',
      to: '25',
      message: 'إن شاء الله يوم السبت اللى جاى فى مطار القاهرة',
      send_time: '2023-06-18 10:06:40',
    },
    {
      from: '25',
      to: '20',
      message: 'كنت عاوز استفسر عن ميعاد رحلتك وهستلم منك الشحنة فين بالظبط',
      send_time: '2023-06-18 10:06:20',
    },
    {
      from: '20',
      to: '25',
      message: 'وعليكم السلام',
      send_time: '2023-06-18 10:05:20',
    },
    {
      from: '25',
      to: '20',
      message: 'السلام عليكم',
      send_time: '2023-06-18 10:04:20',
    },
  ]);
  const msgValid = txt => txt && txt.replace(/\s/g, '').length;

  //   useEffect(() => {
  //     const onChildAdd = database()
  //       .ref('/messages/' + receiverData.roomId)
  //       .on('child_added', snapshot => {
  //         console.log('A new node has been added', snapshot.val());
  //         setallChat(state => [snapshot.val(), ...state]);
  //       });

  //     return () =>
  //       database()
  //         .ref('/messages/' + receiverData.roomId)
  //         .off('child_added', onChildAdd);
  //   }, [receiverData.roomId]);

  const sorted = () => {
    return allChat.sort(function (a, b) {
      return new Date(b.sendTime) < new Date(a.sendTime)
        ? -1
        : new Date(b.sendTime) > new Date(a.sendTime)
        ? 1
        : 0;
    });
  };

  //   function sendMsg() {
  //     if (msg == '' || msgValid(msg) == 0) {
  //       ToastAndroid.showWithGravityAndOffset(
  //         'Enter Something ....',
  //         ToastAndroid.SHORT,
  //         ToastAndroid.BOTTOM,
  //         25,
  //         50,
  //       );
  //       return;
  //     }

  //     setdisabled(true);
  //     let msgData = {
  //       roomId: receiverData.roomId,
  //       message: msg.trim(),
  //       from: userData?.id,
  //       to: receiverData.id,
  //       sendTime: moment().format(),
  //       msgType: 'text',
  //     };

  //     const newRefrance = database()
  //       .ref('/messages/' + receiverData.roomId)
  //       .push();
  //     console.log('Auto generated key ', newRefrance.key);
  //     msgData.id = newRefrance.key;
  //     newRefrance.set(msgData).then(() => {
  //       let chatListUpdate = {
  //         lastMsg: msg.trim(),
  //         sendTime: msgData.sendTime,
  //       };
  //       database()
  //         .ref('/chatlist/' + receiverData.id + '/' + userData.id)
  //         .update(chatListUpdate)
  //         .then(() => {
  //           console.log('data updated');
  //         });
  //       database()
  //         .ref('/chatlist/' + userData.id + '/' + receiverData.id)
  //         .update(chatListUpdate)
  //         .then(() => {
  //           console.log('data updated');
  //         });
  //       setMsg('');
  //     });
  //     setdisabled(false);
  //   }
  function renderHeader() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={1}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Ionicons
            style={{
              marginHorizontal: 10,
              color: COLORS.white,
            }}
            size={30}
            name="chevron-back"
          />
          <Avatar.Image size={40} source={images.main_logo_full} />

          {/* <Avatar.Image size={40} source={{uri: receiverData.img}} /> */}
        </TouchableOpacity>
        <View style={{flex: 1, marginLeft: 10}}>
          <Text
            numberOfLines={1}
            style={{
              color: COLORS.white,
              ...FONTS.h3,
              textTransform: 'capitalize',
            }}>
            {/* {receiverData.name} */}
            Mohamed Ali
          </Text>

          {/* <Text
                style={{ color: COLORS.primaryBackground, fontSize: 10,fontFamily: FONTS.Regular }}
            >
                {lastSeen}
            </Text> */}
        </View>

        {/* <Icon
            style={{
                marginHorizontal: 10,
                color: COLORS.themeColor
            }}
            name="videocam-outline"
            type="Ionicons"
        /> */}
      </View>
    );
  }

  function renderBody() {
    return (
      <ImageBackground
        style={{
          flex: 1,
        }}
        source={images.chatBackground}>
        <FlatList
          style={{flex: 1}}
          data={sorted()}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          inverted
          renderItem={({item, index}) => {
            return (
              <MsgComponent
                sender={item.from == userData.user_id}
                item={item}
                index={index}
              />
            );
          }}
        />
      </ImageBackground>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      {renderHeader()}
      {renderBody()}
      <View
        style={{
          backgroundColor: COLORS.darkOverlayColor2,
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 7,
          justifyContent: 'space-evenly',
        }}>
        <TextInput
          style={{
            backgroundColor: COLORS.white,
            width: '80%',
            borderRadius: 25,
            borderWidth: 0.5,
            borderColor: COLORS.white,
            paddingHorizontal: 15,
            color: COLORS.black,
            ...FONTS.h3,
          }}
          placeholder="type a message"
          placeholderTextColor={COLORS.black}
          multiline={true}
          value={msg}
          onChangeText={val => setMsg(val)}
        />

        <TouchableOpacity
          disabled={disabled}
          onPress={() => {
            sendMsg();
          }}>
          <Ionicons
            style={{
              // marginHorizontal: 15,
              color: COLORS.white,
            }}
            name="paper-plane-sharp"
            size={35}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container: {
    height: 70,
    backgroundColor: COLORS.primary,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default Chat;
