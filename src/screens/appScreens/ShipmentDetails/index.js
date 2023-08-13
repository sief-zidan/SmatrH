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
} from 'react-native';
import {
  COLORS,
  FONTS,
  SIZES,
  images,
  icons,
  dummyData,
} from '../../../constants';
import {RFValue} from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageViewer from 'react-native-image-zoom-viewer';
import LottieView from 'lottie-react-native';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import ShipmentItem from './ShipmentItem';
import {useSelector} from 'react-redux';
import axios from 'axios';
import utils from '../../../utils';
const ShipmentDetails = ({navigation, route}) => {
  const {userData} = useSelector(s => s.UserReducer);
  const [mytrips, setmytrips] = React.useState([]);

  const [shipData, setShipData] = useState({});
  //   Menu

  const [loading, setloading] = useState(false);

  // Image Slide
  const [visibleImageSlider, setVisibleImageSlider] = useState(false);
  const [imageSliderData, setImageSliderData] = useState([]);
  const [imageSliderindex, setImageSliderindex] = useState(0);

  //

  const [shipment_modal, setshipment_modal] = useState(false);
  const [loading_trips, setloading_trips] = useState([]);
  const [loading_request, setloading_request] = useState([false]);

  useEffect(() => {
    setloading(true);
    let x = route.params.ship;
    setShipData(x);
    setTimeout(() => {
      setloading(false);
    }, 1500);
    // console.log(x)
  }, []);

  function getUserName() {
    // let arrName = shipData?.userData?.user_name?.split(' ');
    // let name = '';
    // if (arrName?.length > 1) {
    //   name =
    //     shipData?.userData?.user_name?.split(' ')[0] +
    //     ' ' +
    //     shipData?.userData?.user_name?.split(' ')[1][0];
    // } else {
    //   name = shipData?.userData?.user_name?.split(' ')[0];
    // }

    return shipData?.userData?.user_name;
  }

  function order_request(data, index) {
    let load = loading_request;
    load[index] = true;
    setloading_request(load);

    setloading_request(load);
    let trip_data = data;
    let ship_data = {...shipData};

    let data_send = {
      trip_id: trip_data.trip_id,
      shipment_id: ship_data.shipment_id,
      from_user_id: userData.user_id,
      to_user_id: ship_data.userData.user_id,
      type: 'shipment_request',
    };

    axios
      .post(
        'https://camp-coding.tech/ship_shop/user/home/add_request_trip.php',
        data_send,
      )
      .then(res => {
        // console.log(res.data)
        if (res.data.status == 'success') {
          setshipment_modal(false);
          setTimeout(() => {
            utils.toastAlert('success', 'request send successfly');
          }, 500);
          navigation.gpBack();
        } else {
          utils.toastAlert('error', res.data.message);
        }
        let load = loading_request;
        load[index] = false;
        setloading_request(load);
      });
    // await Auth.setAccount(res.data.message);
  }
  async function get_data_my_trips() {
    setloading_trips(true);

    let data_send = {
      user_id: userData.user_id,
      to_country: shipData.to_country,
      from_country: shipData.from_country,
      // user_id: 1
    };
    axios
      .post(
        'https://camp-coding.tech/ship_shop/user/home/select_my_trips.php',
        data_send,
      )
      .then(res => {
        if (res.data.status == 'success') {
          setmytrips(res.data.message);
          setshipment_modal(true);
        } else {
          utils.toastAlert('error', res.data.message);
        }
      })
      .finally(() => {
        setloading_trips(false);
      });
    // await Auth.setAccount(res.data.message);
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

            // alignItems: 'center',
            // justifyContent: 'center',
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
          {shipData?.shipment_name}
        </Text>
      </View>
    );
  }

  function renderBody() {
    return (
      <View>
        {/* Main info */}
        <View
          style={{
            backgroundColor: COLORS.white,
            paddingBottom: RFValue(5),
          }}>
          <View
            style={{
              paddingHorizontal: SIZES.radius,
            }}>
            {/* countries */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  ...FONTS.h2,
                  fontWeight: 'bold',
                  color: COLORS.dark60,
                }}>
                {shipData?.from_country}
              </Text>
              <Text
                style={{
                  ...FONTS.h2,
                  fontWeight: 'bold',
                  color: COLORS.dark60,
                }}>
                {shipData?.to_country}
              </Text>
            </View>
            {/* logo */}

            <Ionicons
              name="airplane"
              color={COLORS.primary}
              size={RFValue(25)}
              style={{
                alignSelf: 'center',
              }}
            />

            {/* countries codes */}

            {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.dark60,
                }}>
                {shipData?.from_code}
              </Text>
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.dark60,
                }}>
                {shipData?.to_code}
              </Text>
            </View> */}
          </View>
          {/* Devior */}
          <View
            style={{
              height: 2,
              backgroundColor: COLORS.gray2,
              marginHorizontal: SIZES.radius,
              marginVertical: RFValue(10),
            }}
          />
          <View
            style={{
              paddingHorizontal: SIZES.radius,
            }}>
            {/* Expected Date */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Ionicons
                name="ios-calendar"
                color={COLORS.primary}
                size={RFValue(24)}
              />
              <Text style={{...FONTS.h3, color: COLORS.gray2}}>
                {'  '}Expected by{' '}
                <Text style={{fontWeight: 'bold', color: COLORS.darkGray}}>
                  {moment(shipData?.before_date).format('dddd, D MMM YYYY')}
                </Text>
              </Text>
            </View>
            {/* Meet Type */}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons
                name="van-utility"
                color={COLORS.primary}
                size={RFValue(24)}
              />

              <Text style={{...FONTS.h3, color: COLORS.gray2}}>
                {'  '}
                {'meet in person or courier'}
              </Text>
            </View>
            {/* {shipData?.shipment_description && (
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.darkGray,
                }}>
                {shipData?.shipment_description}
              </Text>
            )} */}
          </View>
        </View>
        {/* Person Info */}
        <View
          style={{
            padding: SIZES.radius,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              ...FONTS.h2,
              color: COLORS.gray,
            }}>
            Posted by{' '}
            <Text
              style={{
                fontWeight: 'bold',
                color: COLORS.primary,
              }}>
              {getUserName()}.
            </Text>
          </Text>
        </View>

        <View
          style={{
            marginTop: -15,
            paddingLeft: SIZES.radius,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('https://wa.me/+2' + shipData?.userData?.phone);
            }}>
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.gray,
              }}>
              WhatsApp{' '}
              <Text
                style={{
                  fontWeight: 'bold',
                  color: COLORS.primary,
                }}>
                {shipData?.userData?.phone}.
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={shipData?.items_arr}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => `shipItem-${index}`}
          contentContainerStyle={{
            // marginTop: SIZES.radius,
            paddingHorizontal: SIZES.radius,
            paddingBottom: SIZES.padding,
            flexGrow: 1,
          }}
          renderItem={({item, index}) => {
            return (
              <ShipmentItem
                item={item}
                index={index}
                onPressImage={psIndex => {
                  let sliderData = item.item_images.map(inner => {
                    return {url: inner?.image_url};
                  });
                  setImageSliderData(sliderData);
                  setImageSliderindex(psIndex);
                  setVisibleImageSlider(true);
                }}
                lenItems={
                  shipData?.items_arr?.length > 1 &&
                  `${shipData?.items_arr?.length} Total Items`
                }
              />
            );
          }}
        />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <StatusBar backgroundColor={COLORS.dark60} />
        {renderHeader()}

        {loading ? (
          <>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <LottieView
                source={icons.loading}
                autoPlay
                loop
                style={{height: 180, width: '100%'}}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontFamily: FONTS.fontFamily,
                  fontSize: 16,
                  color: '#000',
                }}>
                Loading ...
              </Text>
            </View>
          </>
        ) : (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                // marginTop: SIZES.radius,
                // paddingHorizontal: SIZES.padding,
                paddingBottom: SIZES.radius,
              }}>
              {renderBody()}
            </ScrollView>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: SIZES.radius,
              }}>
              <View>
                <Text style={{...FONTS.h3}}>Traveler Reward</Text>
                <Text style={{...FONTS.h3, fontWeight: 'bold'}}>
                  $ {shipData?.traveler_reward}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  get_data_my_trips();
                }}
                style={{
                  backgroundColor: COLORS.primary,
                  borderRadius: 100,
                  padding: SIZES.radius,
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
                <Text style={{...FONTS.h4, fontWeight: 'bold'}}>
                  SEND REQUEST
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <Modal
        visible={visibleImageSlider}
        onRequestClose={() => {
          setVisibleImageSlider(false);
          setImageSliderData([]);
          setImageSliderindex(0);
        }}
        transparent={true}>
        <ImageViewer
          imageUrls={imageSliderData}
          index={imageSliderindex}
          enableSwipeDown={true}
          useNativeDriver
          onSwipeDown={() => {
            setVisibleImageSlider(false);
            setImageSliderData([]);
            setImageSliderindex(0);
          }}
          onCancel={() => {
            setVisibleImageSlider(false);
            setImageSliderData([]);
            setImageSliderindex(0);
          }}
        />
      </Modal>

      {/* Trips Modal */}
      <Modal
        visible={shipment_modal}
        // visible={true}

        onRequestClose={() => {
          setshipment_modal(false);
        }}
        transparent={true}
        animationType="slide">
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.darkOverlayColor,
          }}>
          <View
            style={{
              width: '90%',
              padding: 10,

              backgroundColor: '#f6f5f1',

              // elevation: 22,
              borderRadius: 15,
              flex: 1 / 1.1,
              elevation: 5,
            }}>
            <Text
              style={{
                fontFamily: 'Janna LT Bold',
                color: '#9F9FA0',
                fontSize: 25,
                textAlign: 'center',
                ...SIZES.h2,
              }}>
              {'My Trips'}
            </Text>
            <Text
              style={{
                fontFamily: 'Janna LT Bold',
                color: '#9F9FA0',
                fontSize: 15,
                textAlign: 'center',
                marginBottom: 5,
              }}>
              {'(pick up from your trip)'}
            </Text>

            {loading_trips ? (
              <>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <LottieView
                    source={icons.loading}
                    autoPlay
                    loop
                    style={{height: 180, width: '100%'}}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    loading...
                  </Text>
                </View>
              </>
            ) : (
              <>
                {mytrips.length == 0 ? (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <LottieView
                      source={icons.empty}
                      autoPlay
                      loop
                      style={{height: 180, width: '100%'}}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        fontFamily: FONTS.fontFamily,
                        fontSize: 16,
                        color: '#000',
                      }}>
                      No Shipments Yet
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={mytrips}
                    numColumns={1}
                    renderItem={({item, index}) => (
                      <View
                        animation="fadeInRight"
                        key={index}
                        delay={index * 100}
                        useNativeDriver
                        style={{
                          backgroundColor: COLORS.white,
                          marginTop: SIZES.radius - 5,
                          borderRadius: 5,
                          padding: 5,
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          paddingHorizontal: SIZES.radius,
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          alignItems: 'center',
                          justifyContent: 'center',
                          elevation: 5,
                          // minHeight: RFValue(40),
                          borderWidth: 0.1,

                          fontFamily: 'Janna LT Bold',
                          overflow: 'hidden',
                          borderColor: '#9F9FA0',
                          // height: 250,
                          width: '95%',
                          alignSelf: 'center',
                          marginBottom: 5,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            // alignItems: 'center',
                            width: '100%',
                            justifyContent: 'space-between',
                          }}>
                          <View
                            style={{
                              width: '100%',
                              marginBottom: 5,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                marginTop: 10,
                                marginBottom: 5,
                              }}>
                              <Text
                                style={{
                                  fontFamily: 'Janna LT Bold',
                                  color: '#9F9FA0',
                                  fontSize: 15,
                                  textAlign: 'left',
                                }}>
                                {item.to_country}
                              </Text>
                              <FastImage
                                source={icons.plane}
                                style={{
                                  width: 30,
                                  height: 30,
                                  marginRight: SIZES.base,
                                  // alignItems:"flex-end"
                                }}
                                resizeMode="contain"
                              />
                              <Text
                                style={{
                                  fontFamily: 'Janna LT Bold',
                                  color: '#9F9FA0',
                                  fontSize: 15,
                                  textAlign: 'left',
                                }}>
                                {item.from_country}
                              </Text>
                            </View>
                            <View
                              style={{
                                // alignSelf: "flex-start",
                                // marginLeft: 15,
                                width: '100%',
                              }}>
                              <Text
                                style={{
                                  fontFamily: 'Janna LT Bold',
                                  color: '#9F9FA0',
                                  fontSize: 15,
                                  textAlign: 'left',
                                }}>
                                {/* {"before " + item.departure_date} */}
                                {'before ' +
                                  moment(item.departure_date).format(
                                    'dddd, D MMM YYYY',
                                  )}
                              </Text>
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 10,
                                marginBottom: 5,
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Text
                                  style={{
                                    fontFamily: 'Janna LT Bold',
                                    color: '#9F9FA0',
                                    fontSize: 15,
                                    textAlign: 'left',
                                  }}>
                                  {item.consumed_weight + ' KG consumed'}
                                </Text>
                                <FastImage
                                  source={icons.kgc}
                                  style={{
                                    width: 23,
                                    height: 18,
                                    marginRight: SIZES.base,
                                    // alignItems:"flex-end"
                                  }}
                                  resizeMode="contain"
                                />
                              </View>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Text
                                  style={{
                                    fontFamily: 'Janna LT Bold',
                                    color: '#9F9FA0',
                                    fontSize: 15,
                                    textAlign: 'left',
                                  }}>
                                  {item.total_weight + ' KG Avilable'}
                                </Text>
                                <FastImage
                                  source={icons.carton}
                                  style={{
                                    width: 20,
                                    height: 20,
                                    marginRight: SIZES.base,
                                    // alignItems:"flex-end"
                                  }}
                                  resizeMode="contain"
                                />
                              </View>
                            </View>
                          </View>
                        </View>

                        <TouchableOpacity
                          onPress={() => {
                            order_request(item, index);
                          }}
                          style={{
                            backgroundColor: COLORS.bag10Bg,
                            padding: 5,

                            borderRadius: 10,
                            width: '50%',
                            paddingVertical: 5,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                          }}>
                          {loading_request[index] ? (
                            <ActivityIndicator />
                          ) : (
                            <Text
                              style={{
                                fontFamily: 'Janna LT Bold',
                                color: '#fff',
                                fontSize: 15,
                                ...FONTS.h3,
                              }}>
                              {'Select this trip'}
                            </Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                )}
              </>
            )}

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 7,
              }}>
              <TouchableOpacity
                style={{alignItems: 'center', justifyContent: 'center'}}
                onPress={() => {
                  setshipment_modal(false);
                }}>
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,
                    color: '#f00',
                    fontSize: 20,
                  }}>
                  cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
});

export default ShipmentDetails;
