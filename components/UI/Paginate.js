import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import units from '../styles/units';
import fonts from '../styles/fonts';
import colors from '../styles/colors';
import Paragraph from './Paragraph';

class Paginate extends Component {
  state = {};

  render() {
    const {page, limit, total, onPaginate} = this.props;

    return (
      <View
        style={{
          padding: units.unit4,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => onPaginate('back')}>
            <Ionicons
              name="arrow-back"
              size={fonts.h3}
              color={page > 1 ? colors.purpleB : colors.greenD25}
            />
          </TouchableOpacity>
          <Paragraph style={{fontWeight: 'bold', color: colors.greenD25}}>
            {page} / {Math.ceil(total / limit)}
          </Paragraph>
          <TouchableOpacity onPress={() => onPaginate('forward')}>
            <Ionicons
              name="arrow-forward"
              size={fonts.h3}
              color={
                page === Math.ceil(total / limit)
                  ? colors.greenD25
                  : colors.purpleB
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

module.exports = Paginate;
