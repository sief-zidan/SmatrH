import moment from 'moment';
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
// create a component
const TimeDelivery = props => {
  const {sender, item} = props;
  return (
    <View
      style={[
        styles.mainView,
        {
          justifyContent: 'flex-end',
        },
      ]}>
      <Text
        style={{
          fontFamily: 'Poppins-Regular',
          fontSize: 7,
          color: sender ? COLORS.white : COLORS.black,
        }}>
        {moment(item.send_time).format('LLL')}
      </Text>

      <Ionicons
        name={'checkmark-done'}
        style={{
          color: item.seen ? COLORS.black : COLORS.white,
          fontSize: 15,
          marginLeft: 5,
        }}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
});

//make this component available to the app
export default TimeDelivery;
