import React, { Component } from 'react';
import { View } from 'react-native';
import colors from '../styles/colors';

class ProgressIndicator extends Component {

    render() {

        const { progress = 0 } = this.props;

        return (
            <View 
                style={{
                    width: '100%', 
                    backgroundColor: colors.purple4, 
                    height: 10,
                    borderRadius: 5
                }}>
                <View 
                    style={{
                        width: `${progress}%`,
                        backgroundColor: colors.purpleB,
                        height: 10,
                        borderTopLeftRadius: 5,
                        borderBottomLeftRadius: 5,
                        borderTopRightRadius: (progress < 100) ? 0 : 5,
                        borderBottomRightRadius: (progress < 100) ? 0 : 5
                    }}>
                </View>
            </View>
        );
    }
}

module.exports = ProgressIndicator;
