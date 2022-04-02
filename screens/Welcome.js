
import React, { Component } from 'react';
import { SafeAreaView, Button } from 'react-native';
import Header from '../components/UI/Header';

class Welcome extends Component {

    render() {

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <Header type="h4" style={{ textAlign: 'center', marginTop: 25 }}>Welcome to Yarden!</Header>
                <Button
                    title="Continue to dashboard"
                    onPress={() => this.props.navigation.navigate('Dashboard')}
                />

            </SafeAreaView>
        )
    }
}

module.exports = Welcome;