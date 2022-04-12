import React, {Component} from 'react';
import {Text} from 'react-native';
import fonts from '../styles/fonts';

class Label extends Component {
  render() {
    return <Text style={{...fonts.label}}>{this.props.children}</Text>;
  }
}

module.exports = Label;
