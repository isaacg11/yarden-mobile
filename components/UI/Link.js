import React, {Component} from 'react';
import {Linking} from 'react-native';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import Paragraph from './Paragraph';

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
    purple: {
      color: colors.purpleB,
      fontSize: fonts.h4,
      opacity: this.props.disabled ? 0.5 : 1,
      lineHeight: fonts.h3,
    },
    white: {
      color: 'white',
      fontSize: fonts.h4,
      opacity: this.props.disabled ? 0.5 : 1,
      lineHeight: fonts.h3,
    },
    green: {
      color: colors.green0,
      fontSize: fonts.h4,
      opacity: this.props.disabled ? 0.5 : 1,
      lineHeight: fonts.h3,
    },
  };

  render() {
    const {text, color} = this.props;
    const linkStyles = this.getlinkStyles(color);

    return (
      <Paragraph
        style={{...linkStyles}}
        onPress={() => {
          // if a callback prop is passed in, run the function
          if (this.props.onPress) return this.props.onPress();

          // if a url is passed in, open to a new web page
          Linking.openURL(url);
        }}>
        {text}
      </Paragraph>
    );
  }
}

module.exports = Link;
