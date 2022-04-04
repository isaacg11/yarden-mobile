import React, {Component} from 'react';
import {View} from 'react-native';
import colors from '../styles/colors';

class Divider extends Component {
  render() {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: colors.greenD10,
        }}></View>
    );
  }
}

module.exports = Divider;
