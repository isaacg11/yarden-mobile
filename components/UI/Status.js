import React, {Component} from 'react';
import {View, Text} from 'react-native';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import units from '../styles/units';

class Status extends Component {
  getlinkStyles(status) {
    // render badgeStyles styled based on color
    switch (status) {
      case 'bid requested':
        return this.badgeStyles.requested;
      case 'pending approval':
        return this.badgeStyles.pending;
      case 'approved':
        return this.badgeStyles.complete;
      default:
        return this.badgeStyles.requested;
    }
  }

  badgeStyles = {
    requested: {
      backgroundColor: colors.indigoC10,
      color: colors.indigo0,
    },
    pending: {
      backgroundColor: colors.greenC10,
      color: colors.greenB,
    },
    complete: {
      backgroundColor: colors.greenB,
      color: colors.white,
    },
  };

  render() {
    const {status, styles} = this.props;
    const linkStyles = this.getlinkStyles(status);

    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <View
          style={{
            ...linkStyles,
            paddingHorizontal: units.unit3,
            borderRadius: units.unit3,
          }}>
          <Text
            style={{
              ...fonts.small,
              ...styles,
              ...{color: linkStyles.color},
              textTransform: 'capitalize',
            }}>
            {status}
          </Text>
        </View>
      </View>
    );
  }
}

module.exports = Status;
