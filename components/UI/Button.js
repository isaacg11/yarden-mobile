import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import fonts from '../styles/fonts';
import units from '../styles/units';
import colors from '../styles/colors';
import Paragraph from './Paragraph';

class Button extends Component {
  getButtonStyles(variant) {
    // render buttons styled based on variant
    switch (variant) {
      case 'button':
        return this.btnStyle;
      case 'btn2':
        return this.btn2Style;
      case 'btn3':
        return this.btn3Style;
      case 'btn4':
        return this.btn4Style;
      case 'btn5':
        return this.btn5Style;
      default:
        return this.btnStyle;
    }
  }

  getVariantStyles() {
    let variant = {};
    if (this.props.small) {
      variant.paddingVertical = units.unit3;
      variant.paddingHorizontal = units.unit4;
    }
    if (this.props.large) {
      variant.paddingVertical = units.unit5;
      variant.paddingHorizontal = units.unit6;
    }
    return variant;
  }

  getVariantTextStyles() {
    let variant = {};
    if (this.props.small) {
      variant.fontSize = fonts.h5;
    }
    if (this.props.large) {
      variant.fontSize = fonts.h3;
    }
    return variant;
  }

  btnStyle = {
    button: {
      paddingVertical: 16,
      paddingHorizontal: 32,
      display: 'flex',
      backgroundColor: colors.green0,
      borderRadius: 32,
      borderWidth: 1,
      borderColor: colors.greenB25,
      borderTopColor: colors.green4,
      borderBottomColor: colors.greenB50,
      fontSize: fonts.h5,
      minWidth: units.unit7,

      shadowColor: colors.greenC10,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 1,
      shadowRadius: 8,
    },
    text: {
      color: colors.purpleB,
      fontWeight: 'bold',
      fontFamily: fonts.default,
    },
  };

  btn2Style = {
    button: {
      ...this.btnStyle.button,
      backgroundColor: colors.white75,
      borderColor: colors.green0,
      borderTopColor: colors.green3,
      borderBottomColor: colors.greenA,
    },
    text: {
      ...this.btnStyle.text,
    },
  };

  btn3Style = {
    button: {
      ...this.btn2Style.button,
      borderColor: colors.greenB10,
      borderTopColor: 'white',
      borderBottomColor: colors.greenB25,
    },
    text: {
      ...this.btnStyle.text,
    },
  };

  btn4Style = {
    button: {
      ...this.btn2Style.button,
      backgroundColor: colors.purpleB,
      shadowColor: colors.purpleC25,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 1,
      shadowRadius: 8,
    },
    text: {
      ...this.btnStyle.text,
      color: 'white',
    },
  };

  btn5Style = {
    button: {
      paddingVertical: 16,
      paddingHorizontal: 32,
      display: 'flex',
    },
    text: {
      ...this.btnStyle.text,
      color: colors.purpleB,
    },
  };

  render() {
    const {
      onPress,
      text = 'Submit',
      variant,
      disabled,
      icon,
      alignIconRight,
      style
    } = this.props;

    const buttonStyles = this.getButtonStyles(variant);
    const buttonVariant = this.getVariantStyles();
    const buttonVariantText = this.getVariantTextStyles();
    const disabledStyles = disabled ? { opacity: 0.5 } : {};

    return (
      <TouchableOpacity
        style={{ ...buttonStyles.button, ...buttonVariant, ...disabledStyles, ...style }}
        onPress={value => onPress(value)}
        underlayColor="#fff"
        disabled={disabled}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {icon && !alignIconRight && <View style={{ marginRight: units.unit3 }}>{icon}</View>}
          <Paragraph style={{ ...buttonStyles.text, ...buttonVariantText }}>
            {text}
          </Paragraph>
          {icon && alignIconRight && <View style={{ marginLeft: units.unit3 }}>{icon}</View>}
        </View>
      </TouchableOpacity>
    );
  }
}

module.exports = Button;