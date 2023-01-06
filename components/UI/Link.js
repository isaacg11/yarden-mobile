import React, { Component } from 'react';
import { Linking, TouchableOpacity, Text, View } from 'react-native';
import fonts from '../styles/fonts';
import units from '../styles/units';

class Link extends Component {
  getlinkStyles(color) {
    // render linkStyles styled based on color
    switch (color) {
      case 'link':
        return fonts.link.purple;
      default:
        return fonts.link.purple;
    }
  }

  render() {
    const {
      text,
      color,
      url,
      icon,
      alignIconRight,
      style = {}
    } = this.props;

    const linkStyles = this.getlinkStyles(color);

    return (
      <TouchableOpacity
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        onPress={() => {
          // if a callback prop is passed in, run the function
          if (this.props.onPress) return this.props.onPress();

          // if a url is passed in, open to a new web page
          Linking.openURL(url);
        }}>
        {icon && !alignIconRight && (
          <View style={{ marginRight: units.unit3 }}>{icon}</View>
        )}
        <Text style={{ ...linkStyles, ...style }}>{text}</Text>
        {icon && alignIconRight && (
          <View style={{ marginLeft: units.unit3 }}>{icon}</View>
        )}
      </TouchableOpacity>
    );
  }
}

module.exports = Link;
