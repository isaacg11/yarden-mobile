// libraries
import React, { Component } from 'react';
import { Text, View } from 'react-native';

// config
import config from '../../config/index';

// UI components
import Label from '../UI/Label';

// styles
import fonts from '../styles/fonts';

class PlantAvailability extends Component {
  render() {
    return (
      <View>
        <Label>Plant Availability</Label>
        <Text
          style={{
            ...fonts.small,
          }}>
          Please note that some plants will only grow in specific climates or
          seasons. If you do not see something you want on the list it will
          probably be available next season or does grow in your region. If you
          have any questions, please reach out to Yarden support at{' '}
          {config.email}.
        </Text>
      </View>
    );
  }
}

module.exports = PlantAvailability;
