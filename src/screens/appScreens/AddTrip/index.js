import React, {useEffect, useRef, useState} from 'react';
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
  TextInput,
} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../../constants';
import {RFValue} from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import AirPorts from '../AddShipment/AirPorts';
import utils from '../../../utils';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {ActivityIndicator} from 'react-native-paper';
// import Airlines from './Airlines';
const AddTrip = ({navigation}) => {
  const {userData} = useSelector(s => s.UserReducer);

  const shakeRef = useRef();
  const [addObjectInputs, setAddObjectInputs] = useState({
    weight: '',
    flightType1: 'air',
    flightType2: 'air',

    category: null,
    bookingRefrance: '',
    firstName: '',
    lastName: '',
  });
  const [DatePickerRes, setDatePickerRes] = useState(''); // travel, available_from , available_to

  // flightType   air, train, car
  // Locations
  //  // from
  const [fromName, setFromName] = useState(null);
  const [fromNameOpen, setFromNameOpen] = useState(false);
  const [airports1, setAirPorts1] = useState([]);
  const [errorFromAir, setErrorFromAir] = useState(false);
  //  // to
  const [toName, setToName] = useState(null);

  const [toNameOpen, setToNameOpen] = useState(false);
  const [airports2, setAirPorts2] = useState([]);
  const [errorToAir, setErrorToAir] = useState(false);
  //
  const [errorAddWeight, setErrorAddWeight] = useState(false);
  //
  const [dateTravelValue, setDateTravelValue] = useState('');
  const [dateAvailableFromlValue, setDateAvailableFromValue] = useState('');
  const [dateAvailableTolValue, setDateAvailableToValue] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [errorTravelDate, setErrorTravelDate] = useState(false);
  const [errorAvailableFromDate, setErrorAvailableFromDate] = useState(false);
  const [errorAvailableToDate, setErrorAvailableToDate] = useState(false);

  const [shipmentNote, setShipmentNote] = useState('');
  //
  const [meetingZones, setMeetingZones] = useState([]);
  const [newMeetingZone, setNewMeetingZone] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setAirPorts1(AirPorts);
    setAirPorts2(AirPorts);
    // setAirlines(Airlines);
  }, []);

  async function _AddTrip() {
    if (!fromName || !toName) {
      shakeRef.current.shake();
      if (!fromName) {
        setErrorFromAir(true);
      }
      if (!toName) {
        setErrorToAir(true);
      }
      return;
    }
    if (addObjectInputs?.weight == '') {
      setErrorAddWeight(true);
      return;
    }
    if (dateTravelValue == '') {
      errorTravelDate(true);
      return;
    }
    if (dateAvailableFromlValue == '') {
      errorAvailableFromDate(true);
      return;
    }
    if (dateAvailableTolValue == '') {
      errorAvailableToDate(true);
      return;
    }
    if (meetingZones.length == 0) {
      utils.toastAlert('info', 'Please Add at least one meetzone');
      return;
    }
    let allFrom = [...AirPorts].find(item => item.value == fromName);
    let allTo = [...AirPorts].find(item => item.value == toName);
    let data_to_send = {
      from_country: allFrom.city_name,
      to_country: allTo.city_name,
      note: shipmentNote.trim(),
      user_id: userData.user_id,
      total_weight: addObjectInputs?.weight.trim(),
      consumed_weight: '0',
      departure_date: moment(dateTravelValue).format('YYYY-MM-DD'),
      departure_time: moment(dateTravelValue).format('hh:mm:ss'),
      from_country_code: allFrom.country_code,
      to_country_code: allTo.country_code,
      pickup_availablity_date_from: moment(dateAvailableFromlValue).format(
        'YYYY-MM-DD',
      ),
      pickup_availablity_date_to: moment(dateAvailableTolValue).format(
        'YYYY-MM-DD',
      ),
      meeting_point_areas: meetingZones.join('//camp//'),
    };
    setLoading(true);
    let res = await axios.post(
      'https://camp-coding.tech/ship_shop/user/home/insert_trip.php',
      data_to_send,
    );

    if (res.data.status == 'success') {
      utils.toastAlert('success', res.data.message);
      navigation.goBack();
    } else {
      utils.toastAlert(
        'error',
        res.data.message || 'something went wrong please try again later',
      );
    }
    setLoading(false);
  }
  function renderHeader() {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            width: RFValue(40),
            alignItems: 'flex-start',
          }}>
          <Ionicons name="arrow-back" size={RFValue(24)} color={COLORS.white} />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            ...FONTS.h3,
            color: COLORS.white,
            textAlign: 'left',
          }}>
          Add your trip
        </Text>
      </View>
    );
  }

  function renderBody() {
    return (
      <View
        style={{
          marginHorizontal: SIZES.radius,
        }}>
        <Text
          style={{
            ...FONTS.h2,
            fontWeight: 'bold',
          }}>
          Trip Details
        </Text>
        {/* From And To */}
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: SIZES.radius,
            padding: SIZES.base,
          }}>
          <Animatable.View ref={shakeRef}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons
                name="airplane-takeoff"
                size={RFValue(24)}
                color={COLORS.black}
              />
              {/* From */}
              <DropDownPicker
                hideSelectedItemIcon={true}
                modalTitle="Select an item"
                searchPlaceholder={'Search...'}
                dropDownDirection="AUTO"
                // bottomOffset={100}
                modalProps={{
                  animationType: 'slide',
                }}
                listMode="MODAL"
                searchable={true}
                // theme="DARK"
                // mode="BADGE"
                dropDownContainerStyle={{
                  borderColor: COLORS.secondary,
                }}
                selectedItemContainerStyle={{
                  backgroundColor: COLORS.transparentBlack1,
                }}
                selectedItemLabelStyle={
                  {
                    // fontWeight: 'bold',
                  }
                }
                itemSeparatorStyle={
                  {
                    // backgroundColor: COLORS.secondary,
                  }
                }
                style={{
                  // alignSelf: 'center',
                  width: '90%',
                  borderColor: COLORS.transparent,
                }}
                open={fromNameOpen}
                value={fromName}
                items={airports1}
                setOpen={e => {
                  setFromNameOpen(e);
                }}
                setValue={e => {
                  setFromName(e);
                  setErrorFromAir(false);
                }}
                setItems={e => {
                  setAirPorts1(e);
                }}
                placeholder={'From (City)'}
              />
            </View>
            {errorFromAir && (
              <Text style={{...FONTS.h3, color: COLORS.red}}>Required</Text>
            )}

            <View
              style={{
                height: 1.5,
                backgroundColor: COLORS.gray3,
                marginVertical: SIZES.radius,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons
                name="airplane-landing"
                size={RFValue(24)}
                color={COLORS.black}
              />
              {/* To */}
              <DropDownPicker
                hideSelectedItemIcon={true}
                modalTitle="Select an item"
                searchPlaceholder={'Search...'}
                dropDownDirection="AUTO"
                // bottomOffset={100}
                modalProps={{
                  animationType: 'slide',
                }}
                listMode="MODAL"
                searchable={true}
                // theme="DARK"
                // mode="BADGE"
                dropDownContainerStyle={{
                  borderColor: COLORS.secondary,
                }}
                selectedItemContainerStyle={{
                  backgroundColor: COLORS.transparentBlack1,
                }}
                selectedItemLabelStyle={
                  {
                    // fontWeight: 'bold',
                  }
                }
                itemSeparatorStyle={{
                  backgroundColor: COLORS.secondary,
                }}
                style={{
                  // alignSelf: 'center',
                  width: '90%',
                  borderColor: COLORS.transparent,
                }}
                open={toNameOpen}
                value={toName}
                items={airports2}
                setOpen={e => {
                  setToNameOpen(e);
                }}
                setValue={e => {
                  setToName(e);
                  setErrorToAir(false);
                }}
                setItems={e => {
                  setErrorToAir(false);
                  setAirPorts2(e);
                }}
                placeholder={'To (City)'}
              />
            </View>
            {errorToAir && (
              <Text style={{...FONTS.h3, color: COLORS.red}}>Required</Text>
            )}
          </Animatable.View>
        </View>
        {/* Weight */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.white,
            // paddingVertical: RFValue(4),
            paddingHorizontal: RFValue(8),
            marginVertical: SIZES.padding,

            // ...styles.shadowS,
          }}>
          <MaterialCommunityIcons
            name="weight-kilogram"
            size={RFValue(24)}
            color={COLORS.black}
          />
          <TextInput
            keyboardType="number-pad"
            value={addObjectInputs?.weight}
            onChangeText={val => {
              setAddObjectInputs({...addObjectInputs, weight: val});
              setErrorAddWeight(false);
            }}
            placeholder={'Available weight'}
            style={{
              // backgroundColor: 'red',
              flex: 1,
            }}
          />
        </View>
        {errorAddWeight && (
          <Text style={{...FONTS.h3, color: COLORS.red}}>Required</Text>
        )}

        {/* Date */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode={DatePickerRes == 'travel' ? 'datetime' : 'date'}
          minimumDate={new Date()}
          onConfirm={date => {
            if (DatePickerRes == 'travel') {
              setDateTravelValue(date);
              setErrorTravelDate(false);
            } else if (DatePickerRes == 'available_from') {
              setDateAvailableFromValue(date);
              setErrorAvailableFromDate(false);
            } else {
              setDateAvailableToValue(date);
              setErrorAvailableToDate(false);
            }
            setDatePickerVisibility(false);
          }}
          onCancel={() => {
            setDatePickerVisibility(false);
          }}
        />
        <TouchableOpacity
          onPress={() => {
            setDatePickerRes('travel');
            setDatePickerVisibility(true);
          }}
          activeOpacity={0.8}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.white,
            padding: SIZES.radius,
            marginVertical: RFValue(15),
          }}>
          <Ionicons
            name="md-calendar-sharp"
            size={RFValue(24)}
            color={COLORS.black}
          />
          {/* From */}
          <Text
            style={{
              ...FONTS.h3,
            }}>
            {'  '}
            {dateTravelValue
              ? moment(dateTravelValue).format('LL LT')
              : 'Travel Date'}
          </Text>
        </TouchableOpacity>
        {errorTravelDate && (
          <Text style={{...FONTS.h3, color: COLORS.red}}>
            The field mustn't be empty
          </Text>
        )}
        <TouchableOpacity
          onPress={() => {
            setDatePickerRes('available_from');
            setDatePickerVisibility(true);
          }}
          activeOpacity={0.8}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.white,
            padding: SIZES.radius,
          }}>
          <Ionicons
            name="md-calendar-sharp"
            size={RFValue(24)}
            color={COLORS.black}
          />
          {/* From */}
          <Text
            style={{
              ...FONTS.h3,
            }}>
            {'  '}
            {dateAvailableFromlValue
              ? moment(dateAvailableFromlValue).format('LL')
              : 'Available Pickup From'}
          </Text>
        </TouchableOpacity>

        {errorAvailableFromDate && (
          <Text style={{...FONTS.h3, color: COLORS.red}}>
            The field mustn't be empty
          </Text>
        )}
        <TouchableOpacity
          onPress={() => {
            setDatePickerRes('available_to');
            setDatePickerVisibility(true);
          }}
          activeOpacity={0.8}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.white,
            padding: SIZES.radius,
            marginVertical: RFValue(15),
          }}>
          <Ionicons
            name="md-calendar-sharp"
            size={RFValue(24)}
            color={COLORS.black}
          />
          {/* From */}
          <Text
            style={{
              ...FONTS.h3,
            }}>
            {'  '}
            {dateAvailableTolValue
              ? moment(dateAvailableTolValue).format('LL')
              : 'Available Pickup To'}
          </Text>
        </TouchableOpacity>

        {errorAvailableToDate && (
          <Text style={{...FONTS.h3, color: COLORS.red}}>
            The field mustn't be empty
          </Text>
        )}
        {/* Transportation Type */}

        {/* {addObjectInputs?.flightType == 'air' && (
          <View>
            <Text style={{...FONTS.h3}}>Booking info</Text>


            <DropDownPicker
              hideSelectedItemIcon={true}
              modalTitle="Select an item"
              searchPlaceholder={'Search...'}
              dropDownDirection="AUTO"
              // bottomOffset={100}
              modalProps={{
                animationType: 'slide',
              }}
              listMode="MODAL"
              searchable={true}
              // theme="DARK"
              // mode="BADGE"
              dropDownContainerStyle={{
                borderColor: COLORS.secondary,
              }}
              selectedItemContainerStyle={{
                backgroundColor: COLORS.transparentBlack1,
              }}
              selectedItemLabelStyle={
                {
                  // fontWeight: 'bold',
                }
              }
              itemSeparatorStyle={
                {
                  // backgroundColor: COLORS.secondary,
                }
              }
              style={{
                // alignSelf: 'center',
                width: '100%',
                borderColor: COLORS.transparent,
              }}
              open={airlineOpen}
              value={airlineName}
              items={airlines}
              setOpen={e => {
                setAirlineOpen(e);
              }}
              setValue={e => {
                setAirlineName(e);
                setErrorAirline(false);
              }}
              setItems={e => {
                setAirlines(e);
              }}
              placeholder={'Airline'}
            />
            {errorFromAir && (
              <Text style={{...FONTS.h3, color: COLORS.red}}>Required</Text>
            )}

            <TextInput
              value={addObjectInputs?.bookingRefrance}
              onChangeText={val => {
                setAddObjectInputs({...addObjectInputs, bookingRefrance: val});
                setErrorBookingRefrance(false);
              }}
              placeholder="Booking Refrance"
              style={{
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.white,
                fontWeight: '900',
                padding: SIZES.base,
                height: RFValue(45),
                marginVertical: RFValue(20),
              }}
            />

            {errorBookingRefrance && (
              <Text style={{...FONTS.h3, color: COLORS.red}}>Required</Text>
            )}
            <TextInput
              value={addObjectInputs?.firstName}
              onChangeText={val => {
                setAddObjectInputs({...addObjectInputs, firstName: val});
                setErrorFirstName(false);
              }}
              placeholder="First name (on booking card)"
              style={{
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.white,
                fontWeight: '900',
                padding: SIZES.base,
                height: RFValue(45),
                // marginVertical: RFValue(20),
              }}
            />

            {errorFirstName && (
              <Text style={{...FONTS.h3, color: COLORS.red}}>Required</Text>
            )}
            <TextInput
              value={addObjectInputs?.lastName}
              onChangeText={val => {
                setAddObjectInputs({...addObjectInputs, lastName: val});
                setErrorLastName(false);
              }}
              placeholder="Last name (on booking card)"
              style={{
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.white,
                fontWeight: '900',
                padding: SIZES.base,
                height: RFValue(45),
                marginVertical: RFValue(20),
              }}
            />

            {errorLastName && (
              <Text style={{...FONTS.h3, color: COLORS.red}}>Required</Text>
            )}
          </View>
        )} */}
        {/* Footer */}
        {meetingZones.map((item, index) => {
          return (
            <View
              style={{
                backgroundColor: COLORS.gray3,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: SIZES.base,
                borderRadius: SIZES.radius,
                marginBottom: RFValue(10),
              }}>
              <Text
                style={{
                  ...FONTS.h3,
                }}>
                {item}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setMeetingZones(
                    meetingZones.filter((_, innerIndex) => innerIndex != index),
                  );
                }}>
                <Ionicons
                  name="trash-sharp"
                  color={COLORS.red}
                  size={RFValue(25)}
                />
              </TouchableOpacity>
            </View>
          );
        })}
        <View
          style={{
            backgroundColor: COLORS.gray3,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: SIZES.base,
            borderRadius: SIZES.radius,
            marginBottom: RFValue(10),
          }}>
          <TextInput
            value={newMeetingZone}
            onChangeText={val => {
              setNewMeetingZone(val);
            }}
            placeholder="Add Metting Zone"
            style={{
              flex: 1,
              backgroundColor: COLORS.light20,
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}
          />
          <TouchableOpacity
            onPress={() => {
              if (newMeetingZone.trim().length < 3) {
                utils.toastAlert(
                  'info',
                  'Please Write a Right Meeting Zone at least 3 chars',
                );
              } else {
                setMeetingZones([...meetingZones, newMeetingZone.trim()]);
                setNewMeetingZone('');
              }
            }}>
            <Ionicons
              name="ios-add-circle"
              color={COLORS.green}
              size={RFValue(25)}
            />
          </TouchableOpacity>
        </View>

        <TextInput
          multiline={true}
          value={shipmentNote}
          onChangeText={val => {
            setShipmentNote(val);
          }}
          placeholder="Notes"
          style={{
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.white,
            fontWeight: '900',
            padding: SIZES.base,
            minHeight: RFValue(90),
            maxHeight: RFValue(180),
          }}
        />

        <TouchableOpacity
          onPress={() => {
            _AddTrip();
          }}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: RFValue(100),
            alignItems: 'center',
            justifyContent: 'center',
            padding: SIZES.radius,
            ...styles.shadowS,
            marginVertical: RFValue(20),
          }}>
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.black,
              }}>
              DONE
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.dark60} />
      {renderHeader()}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          // marginTop: SIZES.radius,
          // paddingHorizontal: SIZES.padding,
          paddingVertical: SIZES.padding,
        }}>
        {renderBody()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light60,
  },
  headerContainer: {
    backgroundColor: COLORS.dark60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.radius,
  },
  transRow: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RFValue(50),
    height: '100%',
  },
});

export default AddTrip;
