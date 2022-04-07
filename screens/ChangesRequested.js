
import React, { Component } from 'react';
import { SafeAreaView, Button, View } from 'react-native';
import Header from '../components/UI/Header';
import Paragraph from '../components/UI/Paragraph';
import units from '../components/styles/units';

class ChangesRequested extends Component {

    render() {

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <Header type="h4" style={{ textAlign: 'center', marginTop: units.unit6 }}>Changes Requested!</Header>
                <View style={{ padding: units.unit5 }}>
                    <Paragraph style={{ textAlign: 'center', marginTop: units.unit5 }}>
                        Your requested changes have been sent to your Yarden contractor.
                    </Paragraph>
                    <Paragraph style={{ marginTop: units.unit6, textAlign: 'center', fontWeight: 'bold' }}>What happens next?</Paragraph>
                    <Paragraph style={{ marginTop: units.unit5}}>1. Your contractor will review the changes.</Paragraph>
                    <Paragraph style={{ marginTop: units.unit5}}>2. After that, your contractor will contact you to let you know if they can accomodate your request.</Paragraph>
                    <Paragraph style={{ marginTop: units.unit5}}>3. Depending on the requested changes, additional payments may be required.</Paragraph>
                    <View style={{ marginTop: units.unit6 }}>
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