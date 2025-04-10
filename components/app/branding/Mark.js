import React, {Component} from 'react';
import {Image} from 'react-native';

class Mark extends Component {
  render() {
    return (
      <Image
        style={{width: this.props.size, height: this.props.size}}
        source={{
          uri: 'https://yarden-garden.s3.us-west-1.amazonaws.com/mobile/yarden_mark_bg-01.png',
        }}
      />
    );
  }
}

module.exports = Mark;
