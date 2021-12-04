
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

class Notification extends Component {

    render() {

        const {
            text
        } = this.props;

        return (
            <View style={{ backgroundColor: '#ff9900', padding: 12, borderRadius: 5 }}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="alert-circle-outline" size={30} style={{ flex: 1 }} />
                    <Text style={{ fontWeight: 'bold', flex: 6 }}>{text}</Text>
                </View>
            </View>
        )
    }
}

module.exports = Notification;