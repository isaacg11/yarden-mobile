// libraries
import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';

// styles
import units from './../styles/units';
import colors from './../styles/colors';

const PlantList = ({plants}) => {
  console.log('plants');
  console.log(plants);

  return (
    <View>
      {/* plant category */}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          backgroundColor: colors.white,
          paddingVertical: units.unit3,
        }}>
        <TouchableOpacity>
          <Text>Vegetables</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Herbs</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Fruit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlantList;
