
import React, { Component } from 'react';
import { Text, SafeAreaView, Button } from 'react-native';

class Welcome extends Component {

    render() {

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25 }}>Welcome to Yarden!</Text>
                <Button
                    title="Continue to dashboard"
                    onPress={() => this.props.navigation.navigate('Dashboard')}
                />

            </SafeAreaView>
        )
    }
}

module.exports = Welcome;