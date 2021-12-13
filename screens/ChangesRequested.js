
import React, { Component } from 'react';
import { Text, SafeAreaView, Button, View } from 'react-native';

class ChangesRequested extends Component {

    render() {

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25 }}>Changes Requested!</Text>
                <View style={{ padding: 12 }}>
                    <Text style={{ textAlign: 'center', marginTop: 12 }}>
                        Your requested changes have been sent to your Yarden contractor.
                    </Text>
                    <Text style={{ marginTop: 25, textAlign: 'center', fontWeight: 'bold' }}>What happens next?</Text>
                    <Text style={{ marginTop: 12}}>1. Your contractor will review the changes.</Text>
                    <Text style={{ marginTop: 12}}>2. After that, your contractor will contact you to let you know if they can accomodate your request.</Text>
                    <Text style={{ marginTop: 12}}>3. Depending on the requested changes, additional payments may be required.</Text>
                    <View style={{ marginTop: 25 }}>
                        <Button
                            title="Continue to dashboard"
                            onPress={() => this.props.navigation.navigate('Dashboard')}
                        />
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

module.exports = ChangesRequested;