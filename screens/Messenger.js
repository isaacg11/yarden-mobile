
import React, { Component } from 'react';
import { Text, SafeAreaView } from 'react-native';

class Messenger extends Component {

    render() {

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25 }}>Messenger</Text>
            </SafeAreaView>
        )
    }
}

module.exports = Messenger;