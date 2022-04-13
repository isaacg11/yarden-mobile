import React, {Component} from 'react';
import {Text} from 'react-native';
import fonts from '../styles/fonts';

class Label extends Component {
  render() {

    const { style } = this.props;

    return <Text style={{...fonts.label, ...style}}>{this.props.children}</Text>;
  }
}

module.exports = Label;
