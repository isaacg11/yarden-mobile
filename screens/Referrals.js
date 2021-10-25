
import React, { Component } from 'react';
import { Text, SafeAreaView } from 'react-native';

class Referrals extends Component {

    render() {

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25 }}>Referrals</Text>
            </SafeAreaView>
        )
    }
}

module.exports = Referrals;