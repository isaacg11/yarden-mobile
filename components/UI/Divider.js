
import React, { Component } from 'react';
import { View } from 'react-native';

class Divider extends Component {

    render() {
        return (
            <View style={{height: 1, width: '100%', backgroundColor: '#ddd'}}></View>
        )
    }
}

module.exports = Divider;