import React, {Component} from 'react';
import {Linking, TouchableOpacity, Text} from 'react-native';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

class Link extends Component {
  getlinkStyles(color) {
    // render linkStyles styled based on color
    switch (color) {
      case 'link':
        return this.linkStyles.purple;
      case 'purple':
        return this.linkStyles.purple;
      case 'white':
        return this.linkStyles.white;
      case 'green':
        return this.linkStyles.green;
      default:
        return this.linkStyles.purple;
    }
  }

  linkStyles = {
    sizing: {
      fontSize: fonts.h4,
      lineHeight: fonts.h3,
    },
    purple: {
      ...this.sizing,
      color: colors.purpleB,
      fontFamily: fonts.default,
      opacity: this.props.disabled ? 0.5 : 1,
    },
    white: {
      ...this.sizing,
      color: 'white',
      opacity: this.props.disabled ? 0.5 : 1,
    },
    green: {
      ...this.sizing,
      color: colors.green0,
      opacity: this.props.disabled ? 0.5 : 1,
    },
  };

  render() {
    const {text, color, url} = this.props;
    const linkStyles = this.getlinkStyles(color);

    return (
      <TouchableOpacity
        onPress={() => {
          // if a callback prop is passed in, run the function
          if (this.props.onPress) return this.props.onPress();

          // if a url is passed in, open to a new web page
          Linking.openURL(url);
        }}>
        <Text style={{...linkStyles}}>{text}</Text>
      </TouchableOpacity>
    );
  }
}

module.exports = Link;
