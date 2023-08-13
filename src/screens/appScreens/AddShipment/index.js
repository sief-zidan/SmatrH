import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  Animated,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {FONTS, images, icons, SIZES, COLORS} from '../../../constants';
import {RFValue} from 'react-native-responsive-fontsize';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import airports from './AirPorts';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import * as Animatabe from 'react-native-animatable';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import ImageCropPicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import utils from '../../../utils';

const ScreenTwoRows = ({label, val, isP = false}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        marginBottom: RFValue(8),
      }}>
      <View
        style={{
          flex: 1,
          // alignItems: 'center',
          // justifyContent: 'center',
        }}>
        <Text
          style={{
            ...FONTS.h3,
            color: COLORS.gray,
          }}>
          {label}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            ...FONTS.h3,
            color: isP ? COLORS.primary : COLORS.black,
            fontWeight: 'bold',
          }}>
          {val}
        </Text>
      </View>
    </View>
  );
};
const AddShipment = ({navigation}) => {
  const {userData} = useSelector(s => s.UserReducer);

  const shakeRef = useRef();
  //
  const flatListRef = useRef();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  //
  const [fromName, setFromName] = useState(null);
  const [fromNameOpen, setFromNameOpen] = useState(false);
  const [airports1, setAirPorts1] = useState([]);
  //
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateValue, setDateValue] = useState('');
  const [shipmentName, setShipmentName] = useState('');
  const [shipmentNote, setShipmentNote] = useState('');
  const [travelerReward, setTravelerReward] = useState('');

  //
  const [toName, setToName] = useState(null);
  const [toNameOpen, setToNameOpen] = useState(false);
  const [airports2, setAirPorts2] = useState([]);
  const onViewChangeRef = useRef(({viewableItems, changes}) => {
    setCurrentIndex(viewableItems[0].index);
  });

  // Main Page Errors
  const [errorFromAir, setErrorFromAir] = useState(false);
  const [errorToAir, setErrorToAir] = useState(false);
  const [errorDate, setErrorDate] = useState(false);
  const [errorShipmentName, setErrorShipmentName] = useState(false);
  const [errorisEmptyItems, setErrorisEmptyItems] = useState(false);
  const [errorTravelerReward, setErrorTravelerReward] = useState(false);
  // Add Modal Errors
  const [errorAddLink, setErrorAddLink] = useState(false);
  const [errorAddName, setErrorAddName] = useState(false);
  const [errorAddPrice, setErrorAddPrice] = useState(false);
  const [errorAddWeight, setErrorAddWeight] = useState(false);
  const [errorAddCategory, setErrorAddCategory] = useState(false);
  const [errorAddPhotos, setErrorAddPhotos] = useState(false);
  const [loadingAddShipment, setLoadingAddShipment] = useState(false);
  //
  const [shipmentItems, setShipmentItems] = useState([]);
  const [visableAddModal, setVisableAddModal] = useState(false);
  const [addItemObj, setAddItemObj] = useState({
    link: '',
    name: '',
    qty: 1,
    price: '',
    weight: '',
    itemId: '',
    photos: [],
    category: '',
  });

  const [addItemCategoryVal, setAddItemCategoryVal] = useState(null);
  const [addItemCategoryOpen, setAddItemCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([
    {
      label: 'Electronics - Other',
      value: 'Electronics - Other',
    },
    {
      label: 'Electronics - Mobile & Tablet',
      value: 'Electronics - Mobile & Tablet',
    },
    {
      label: 'Electronics - Laptop',
      value: 'Electronics - Laptop',
    },
    {
      label: 'Cosmetics',
      value: 'Cosmetics',
    },
    {
      label: 'Clothing',
      value: 'Clothing',
    },
    {
      label: 'Shoes & Bags',
      value: 'Shoes & Bags',
    },
    {
      label: 'Watches & Sunglasses',
      value: 'Watches & Sunglasses',
    },
    {
      label: 'Dietary Supplements - Other',
      value: 'Dietary Supplements - Other',
    },
    {
      label: 'Dietary Supplements - Vitamins',
      value: 'Dietary Supplements - Vitamins',
    },
    {
      label: 'Food',
      value: 'Food',
    },
    {
      label: 'Books',
      value: 'Books',
    },
  ]);
  const [shipmentId, setShipmentId] = useState('');
  const [loadingFinalPush, setLoadingFinalPush] = useState(false);

  useEffect(() => {
    setAirPorts1(airports);
    setAirPorts2(airports);
  }, []);

  function _checkScreenInputs() {
    let allow = true;
    if (!fromName || !toName) {
      allow = false;
      shakeRef.current.shake();
      if (!fromName) {
        setErrorFromAir(true);
      }
      if (!toName) {
        setErrorToAir(true);
      }
    }

    if (!dateValue) {
      allow = false;

      setErrorDate(true);
    }

    if (!shipmentName) {
      allow = false;

      setErrorShipmentName(true);
    }

    if (travelerReward == '' || travelerReward * 0 != 0) {
      allow = false;

      setErrorTravelerReward(true);
    }

    // if (shipmentItems.length == 0) {
    //   allow = false;

    //   setErrorisEmptyItems(true);
    // }
    if (allow) {
      if (shipmentId != '') {
        if (shipmentItems.length > 0) {
          flatListRef?.current?.scrollToIndex({
            index: 1,
            animated: true,
          });
        } else {
          setErrorisEmptyItems(true);
        }
      } else {
        _addShipmetFun();
      }
    }
  }

  async function _addShipmetFun() {
    setLoadingAddShipment(true);
    let fromRealName = [...airports].find(item => item.value == fromName);
    let toRealName = [...airports].find(item => item.value == toName);

    let data_to_send = {
      from_country: fromRealName.label,
      to_country: toRealName.label,
      from_country_code: fromRealName.country_code,
      to_country_code: toRealName.country_code,
      before_date: moment(dateValue).utc().format('YYYY-MM-DD'),
      shipment_name: shipmentName.trim(),
      note: shipmentNote.trim(),
      user_id: userData.user_id,
      traveler_reward: travelerReward,
    };
    let res = await axios.post(
      'https://camp-coding.tech/ship_shop/user/home/insert_shipment.php',
      data_to_send,
    );
    if (res.data.status == 'success') {
      setShipmentId(res.data.message);
    } else {
      alert(res.data.message || 'something went wrong!');
    }
    setLoadingAddShipment(false);
    // flatListRef?.current?.scrollToIndex({
    //   index: 1,
    //   animated: true,
    // });
  }

  async function _checkAddItem() {
    let allow = true;
    if (addItemObj.link == '') {
      allow = false;
      setErrorAddLink(true);
    }

    if (addItemObj.name == '') {
      allow = false;
      setErrorAddName(true);
    }
    if (addItemObj.price == '') {
      allow = false;
      setErrorAddPrice(true);
    }
    if (addItemObj.weight == '') {
      allow = false;
      setErrorAddWeight(true);
    }
    if (!addItemCategoryVal) {
      allow = false;
      setErrorAddCategory(true);
    }

    if (addItemObj.photos.length == 0) {
      allow = false;
      setErrorAddPhotos(true);
    }

    if (allow) {
      setShipmentItems([
        ...shipmentItems,
        {...addItemObj, category: addItemCategoryVal},
      ]);

      setVisableAddModal(false);
      setAddItemObj({
        link: '',
        name: '',
        qty: 1,
        price: '',
        weight: '',
        itemId: '',
        photos: [],
        category: [],
      });
      setAddItemCategoryVal(null);
      setAddItemCategoryOpen(false);
    }
  }

  async function _postShipment() {
    for (let ship of shipmentItems) {
      setLoadingFinalPush(true);
      let shipData = {
        item_name: ship?.name,
        item_link: ship?.link,
        item_quantity: ship?.qty,
        price: ship?.price,
        weight: ship?.weight,
        category: ship?.category,
        shipment_id: shipmentId,
      };
      await axios
        .post(
          'https://camp-coding.tech/ship_shop/user/home/add_items_to_shipment.php',
          shipData,
        )
        .then(async res => {
          if (res.data.status == 'success') {
            for (let innerImage of ship.photos) {
              setLoadingFinalPush(true);

              RNFetchBlob.fetch(
                'POST',
                'https://camp-coding.tech/ship_shop/user/home/item_img_uploader.php',
                {
                  Authorization: 'Bearer access-token',
                  otherHeader: 'foo',
                  'Content-Type': 'octet-stream',
                },
                [
                  {
                    name: 'item_id',

                    data: String(res.data.message),
                  },
                  {
                    name: 'image',
                    filename: 'avatar.png',
                    type: 'image/png',
                    data: String(innerImage['data']),
                  },
                ],
              ).finally(() => {
                setLoadingFinalPush(false);
              });
            }
            utils.toastAlert('success', 'Your Shipment has been done✅');
            navigation.goBack();
          }
          setLoadingFinalPush(false);
        })
        .finally(() => {
          setLoadingFinalPush(false);
        });
    }

    // closeAllData();
  }
  function renderHeader() {
    return (
      <View style={{...styles.headerContainer, ...styles.shadowS}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              ...styles.headerCircle,
            }}>
            {currentIndex > 0 ? (
              <Ionicons
                name="checkmark"
                size={RFValue(20)}
                color={COLORS.black}
              />
            ) : (
              <Text style={{...FONTS.h3}}>1</Text>
            )}
          </View>

          <Text
            style={{
              ...FONTS.h3,
              fontWeight: currentIndex > 0 ? '500' : 'bold',
            }}>
            {'  '}Add Details
          </Text>
        </View>
        <View
          style={{
            width: RFValue(50),
            marginHorizontal: RFValue(8),
            height: 1.5,
            backgroundColor: currentIndex > 0 ? COLORS.primary : COLORS.gray,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              ...styles.headerCircle,
              backgroundColor: currentIndex > 0 ? COLORS.primary : COLORS.gray,
            }}>
            <Text style={{...FONTS.h3}}>2</Text>
          </View>

          <Text
            style={{
              ...FONTS.h3,
              fontWeight: currentIndex <= 0 ? '500' : 'bold',
            }}>
            {'  '}Review
          </Text>
        </View>
      </View>
    );
  }

  function renderFooter() {
    return (
      <View style={styles.FooterContainer}>
        <TouchableOpacity
          onPress={() => {
            if (currentIndex > 0) {
              flatListRef?.current?.scrollToIndex({
                index: 0,
                animated: true,
              });
            } else {
              navigation.goBack();
            }
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <FontAwesome
            name="angle-left"
            size={RFValue(24)}
            color={COLORS.dark60}
          />
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.dark60,
              marginLeft: 8,
            }}>
            {currentIndex > 0 ? 'BACK' : 'CANCEL'}
          </Text>
        </TouchableOpacity>
        {shipmentId == '' ? (
          <TouchableOpacity
            disabled={loadingAddShipment}
            onPress={() => {
              _checkScreenInputs();
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {loadingAddShipment ? (
              <ActivityIndicator size={RFValue(25)} color={COLORS.white} />
            ) : (
              <>
                <Text
                  style={{
                    ...FONTS.h3,
                    color: COLORS.black,
                    marginRight: 8,
                  }}>
                  ADD SHIPMENT
                </Text>
                <FontAwesome
                  name="angle-right"
                  size={RFValue(24)}
                  color={COLORS.black}
                />
              </>
            )}
          </TouchableOpacity>
        ) : (
          currentIndex >= 0 && (
            <TouchableOpacity
              onPress={() => {
                _checkScreenInputs();
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.black,
                  marginRight: 8,
                }}>
                NEXT
              </Text>
              <FontAwesome
                name="angle-right"
                size={RFValue(24)}
                color={COLORS.black}
              />
            </TouchableOpacity>
          )
        )}
      </View>
    );
  }

  function screenOne() {
    return (
      <View
        style={{
          marginHorizontal: SIZES.radius,
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={{
              ...FONTS.h2,
              fontWeight: 'bold',
            }}>
            {/* Details */}
          </Text>
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: SIZES.radius,
              padding: SIZES.base,
            }}>
            <Animatabe.View ref={shakeRef}>
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
            </Animatabe.View>
          </View>

          {/* Date */}

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            minimumDate={new Date()}
            onConfirm={date => {
              setErrorDate(false);
              setDateValue(date);
              setDatePickerVisibility(false);
            }}
            onCancel={() => {
              setDatePickerVisibility(false);
            }}
          />
          <TouchableOpacity
            onPress={() => {
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
              {dateValue ? moment(dateValue).format('LL') : 'Before date'}
            </Text>
          </TouchableOpacity>

          {errorDate && (
            <Text style={{...FONTS.h3, color: COLORS.red}}>
              The field mustn't be empty
            </Text>
          )}

          <TextInput
            value={shipmentName}
            onChangeText={val => {
              setShipmentName(val);
              setErrorShipmentName(false);
            }}
            placeholder="Shipment name"
            style={{
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.white,
              fontWeight: '900',
              padding: SIZES.base,
              height: RFValue(45),
            }}
          />

          {errorShipmentName && (
            <Text style={{...FONTS.h3, color: COLORS.red}}>Required</Text>
          )}

          <TextInput
            value={travelerReward}
            keyboardType="number-pad"
            onChangeText={val => {
              setTravelerReward(val);
              setErrorTravelerReward(false);
            }}
            placeholder="traveler Reward"
            style={{
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.white,
              fontWeight: '900',
              padding: SIZES.base,
              height: RFValue(45),
              marginVertical: RFValue(15),
            }}
          />

          {errorTravelerReward && (
            <Text style={{...FONTS.h3, color: COLORS.red}}>Required</Text>
          )}

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

          {shipmentId && (
            <>
              <Text
                style={{
                  ...FONTS.h3,
                  fontWeight: '800',
                }}>
                Shopping items
              </Text>
              {errorisEmptyItems && (
                <Text style={{...FONTS.h3, color: COLORS.red}}>
                  Add one itm at least
                </Text>
              )}

              {shipmentItems.length > 0 &&
                shipmentItems.map((item, index) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: COLORS.dark60,
                      height: RFValue(80),
                      borderRadius: SIZES.radius,
                      overflow: 'hidden',
                      marginVertical: RFValue(4),
                      // ...styles.shadowS,
                    }}>
                    <View
                      style={{
                        flex: 1,
                      }}>
                      <FastImage
                        source={{uri: item.photos[0].path}}
                        style={{
                          height: RFValue(80),
                          width: '100%',
                        }}
                        resizeMode="stretch"
                      />
                    </View>
                    <View
                      style={{
                        flex: 3,
                        // alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: RFValue(4),
                        // padding: SIZES.padding,
                        // backgroundColor: 'red',
                      }}>
                      <Text
                        style={{
                          ...FONTS.h3,
                          color: COLORS.white,
                          fontWeight: 'bold',
                        }}>
                        {item.name}
                      </Text>

                      <Text
                        style={{
                          ...FONTS.h3,
                          color: COLORS.white,
                        }}>
                        {item.weight}KG X {item.qty}
                      </Text>
                    </View>
                  </View>
                ))}
              <TouchableOpacity
                onPress={() => {
                  setVisableAddModal(true);
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
                <Text
                  style={{
                    ...FONTS.h3,
                    color: COLORS.black,
                  }}>
                  ADD NEW ITEM
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View>
    );
  }

  function ScreenTwo() {
    return (
      <View
        style={{
          marginHorizontal: SIZES.radius,
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              backgroundColor: COLORS.white,
              ...styles.shadowS,
              borderWidth: 1,
              borderColor: COLORS.gray,
              padding: SIZES.padding,
              // paddingHorizontal: SIZES.padding * 2,
              borderRadius: SIZES.radius,
            }}>
            <ScreenTwoRows
              label={'Total Items'}
              val={shipmentItems.reduce(
                (accumulator, currentValue) => accumulator + currentValue.qty,
                0,
              )}
            />
            <ScreenTwoRows
              label={'Total Weights'}
              val={
                shipmentItems
                  .reduce(
                    (accumulator, currentValue) =>
                      accumulator + Number(currentValue.weight),
                    0,
                  )
                  .toFixed(2) + 'KG'
              }
            />

            <ScreenTwoRows
              label={"Traveler's Reward"}
              val={'$ ' + travelerReward.trim()}
              isP
            />
          </View>

          <TouchableOpacity
            disabled={loadingFinalPush}
            onPress={() => {
              _postShipment();
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
            {loadingFinalPush ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.black,
                }}>
                POST SHIPMENT
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {renderHeader()}
      <Animated.FlatList
        data={[{}, {}]}
        ref={flatListRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        scrollEventThrottle={16}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => `page-${index}`}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {
            useNativeDriver: false,
          },
        )}
        contentContainerStyle={{
          marginTop: SIZES.padding,
          // marginHorizontal: SIZES.padding,
        }}
        onViewableItemsChanged={onViewChangeRef.current}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                width: SIZES.width,
              }}>
              {index == 0 ? screenOne() : ScreenTwo()}
            </View>
          );
        }}
      />
      {renderFooter()}
      {/* Add Modal */}
      <Modal
        visible={visableAddModal}
        onRequestClose={() => {
          setVisableAddModal(false);
          setAddItemObj({
            link: '',
            name: '',
            qty: 1,
            price: '',
            weight: '',
            itemId: '',
            photos: [],
            category: '',
          });
          setAddItemCategoryVal(null);
          setAddItemCategoryOpen(false);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.lightGrey60,
          }}>
          <View
            style={{
              backgroundColor: COLORS.dark60,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: SIZES.radius,
              // ...styles.shadowS,
            }}>
            <Text
              style={{
                flex: 1,
                ...FONTS.h3,
                color: COLORS.white,
                fontWeight: 'bold',
              }}>
              ADD SHOPPING ITEM
            </Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              padding: SIZES.radius,
            }}>
            <Text
              style={{
                ...FONTS.h3,
                fontWeight: 'bold',
                marginBottom: RFValue(15),
              }}>
              Item details
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.white,
                // paddingVertical: RFValue(4),
                paddingHorizontal: RFValue(8),

                // ...styles.shadowS,
              }}>
              <Ionicons name="link" size={RFValue(24)} color={COLORS.black} />
              <TextInput
                value={addItemObj?.link}
                onChangeText={val => {
                  setAddItemObj({...addItemObj, link: val});
                  setErrorAddLink(false);
                }}
                placeholder={'Item Link'}
                style={{
                  // backgroundColor: 'red',
                  flex: 1,
                }}
              />
            </View>
            {errorAddLink && (
              <Text style={{...FONTS.h3, color: COLORS.red}}>Required</Text>
            )}

            <TextInput
              value={addItemObj?.name}
              onChangeText={val => {
                setAddItemObj({...addItemObj, name: val});
                setErrorAddName(false);
              }}
              placeholder="Item name"
              style={{
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.white,
                fontWeight: '900',
                padding: SIZES.base,
                height: RFValue(45),
                marginVertical: RFValue(20),
              }}
            />

            {errorAddName && (
              <Text style={{...FONTS.h3, color: COLORS.red}}>Required</Text>
            )}

            {/* qty */}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{...FONTS.h3, flex: 1}}>Item Quentity</Text>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: RFValue(100),
                  borderWidth: 1,
                  borderColor: COLORS.gray,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: SIZES.base,
                  flex: 1,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    if (addItemObj.qty > 1) {
                      setAddItemObj({...addItemObj, qty: --addItemObj.qty});
                    }
                  }}
                  style={{
                    backgroundColor: COLORS.primary,
                    width: RFValue(30),
                    height: RFValue(30),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: RFValue(30 / 2),
                  }}>
                  <MaterialCommunityIcons
                    name="minus"
                    size={RFValue(20)}
                    color={COLORS.white}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    marginHorizontal: RFValue(30),
                  }}>
                  <Text
                    style={{
                      ...FONTS.h3,
                    }}>
                    {addItemObj?.qty}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setAddItemObj({...addItemObj, qty: ++addItemObj.qty});
                  }}
                  style={{
                    backgroundColor: COLORS.primary,
                    width: RFValue(30),
                    height: RFValue(30),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: RFValue(30 / 2),
                  }}>
                  <MaterialCommunityIcons
                    name="plus"
                    size={RFValue(20)}
                    color={COLORS.white}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* Price */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.white,
                // paddingVertical: RFValue(4),
                paddingHorizontal: RFValue(8),
                marginVertical: SIZES.radius,

                // ...styles.shadowS,
              }}>
              <FontAwesome name="usd" size={RFValue(24)} color={COLORS.black} />
              <TextInput
                keyboardType="number-pad"
                value={addItemObj?.price}
                onChangeText={val => {
                  setAddItemObj({...addItemObj, price: val});
                  setErrorAddPrice(false);
                }}
                placeholder={'Single Item Price'}
                style={{
                  // backgroundColor: 'red',
                  flex: 1,
                }}
              />
              <Text>
                Total({(addItemObj?.qty * addItemObj.price).toFixed(2) || 0})
              </Text>
            </View>

            {errorAddPrice && (
              <Text style={{...FONTS.h3, color: COLORS.red}}>Required</Text>
            )}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.white,
                // paddingVertical: RFValue(4),
                paddingHorizontal: RFValue(8),
                marginVertical: SIZES.radius,

                // ...styles.shadowS,
              }}>
              <MaterialCommunityIcons
                name="weight"
                size={RFValue(24)}
                color={COLORS.black}
              />
              <TextInput
                keyboardType="number-pad"
                value={addItemObj?.weight}
                onChangeText={val => {
                  setAddItemObj({...addItemObj, weight: val});
                  setErrorAddWeight(false);
                }}
                placeholder={'Single Item Weight'}
                style={{
                  // backgroundColor: 'red',
                  flex: 1,
                }}
              />
              <Text>
                Total({(addItemObj?.qty * addItemObj.weight).toFixed(2) || 0})
              </Text>
            </View>
            {errorAddWeight && (
              <Text style={{...FONTS.h3, color: COLORS.red}}>Required</Text>
            )}

            <Text style={{...FONTS.h3, marginBottom: RFValue(10)}}>
              Category
            </Text>
            <DropDownPicker
              // hideSelectedItemIcon={true}
              modalTitle="Choose Category"
              searchPlaceholder={'Search...'}
              dropDownDirection="TOP"
              bottomOffset={100}
              modalProps={{
                animationType: 'slide',
              }}
              listMode="MODAL"
              // searchable={true}
              // theme="DARK"
              mode="BADGE"
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
              open={addItemCategoryOpen}
              value={addItemCategoryVal}
              items={categories}
              setOpen={e => {
                setAddItemCategoryOpen(e);
              }}
              setValue={e => {
                setAddItemCategoryVal(e);
                setErrorAddCategory(false);
              }}
              setItems={e => {
                setCategories(e);
              }}
              placeholder={'Choose Category'}
            />
            {errorAddCategory && (
              <Text style={{...FONTS.h3, color: COLORS.red}}>
                Please Select Category
              </Text>
            )}
            <Text style={{...FONTS.h3, marginVertical: RFValue(15)}}>
              Item Photos
            </Text>
            {errorAddPhotos && (
              <Text style={{...FONTS.h3, color: COLORS.red}}>
                Please Add one Photo at Least
              </Text>
            )}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {addItemObj?.photos.map((item, index) => {
                return (
                  <View
                    style={{
                      width: RFValue(90),
                      height: RFValue(90),
                      borderRadius: RFValue(8),
                      marginRight: RFValue(8),
                    }}>
                    <FastImage
                      source={{uri: item?.path}}
                      style={{
                        width: RFValue(90),
                        height: RFValue(90),
                        borderRadius: RFValue(8),
                      }}
                      resizeMode="stretch"
                    />
                    <TouchableOpacity
                      onPress={() => {
                        let allData = [...addItemObj.photos];
                        allData.splice(index, 1);
                        setAddItemObj({...addItemObj, photos: allData});
                      }}
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                      }}>
                      <MaterialIcons
                        name="cancel"
                        size={RFValue(24)}
                        color={COLORS.red}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
              <TouchableOpacity
                onPress={() => {
                  ImageCropPicker.openPicker({
                    multiple: true,
                    includeBase64: true,
                  }).then(images => {
                    setAddItemObj({
                      ...addItemObj,
                      photos: [...addItemObj.photos, ...images],
                    });
                    setErrorAddPhotos(false);
                  });
                }}
                style={{
                  width: RFValue(90),
                  height: RFValue(90),
                  borderRadius: RFValue(8),

                  borderWidth: 2,
                  borderColor: COLORS.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <MaterialIcons
                  name="camera-alt"
                  size={RFValue(20)}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity
              onPress={() => {
                _checkAddItem();
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
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.black,
                }}>
                ADD ITEM
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light60,
  },
  headerContainer: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.radius,
  },
  headerCircle: {
    width: RFValue(25),
    height: RFValue(25),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: RFValue(25 / 2),
  },
  FooterContainer: {
    backgroundColor: COLORS.primary,
    padding: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  shadowS: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
export default AddShipment;
