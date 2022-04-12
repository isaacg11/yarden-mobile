
import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/UI/Header';
import Paragraph from '../components/UI/Paragraph';
import Button from '../components/UI/Button';
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class ChangesRequested extends Component {

    render() {

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <View style={{ padding: units.unit3 + units.unit4 }}>
                    <Header type="h4" style={{ marginBottom: units.unit5 }}>Changes Requested!</Header>
                    <View>
                        <Paragraph style={{ textAlign: 'center', marginTop: units.unit3 }}>
                            Your requested changes have been sent to your Yarden contractor.
                        </Paragraph>
                        <Paragraph style={{ marginTop: units.unit4, textAlign: 'center', fontWeight: 'bold' }}>What happens next?</Paragraph>
                        <Paragraph style={{ marginTop: units.unit5 }}>1. Your contractor will review the changes.</Paragraph>
                        <Paragraph style={{ marginTop: units.unit5 }}>2. After that, your contractor will contact you to let you know if they can accomodate your request.</Paragraph>
                        <Paragraph style={{ marginTop: units.unit5 }}>3. Depending on the requested changes, additional payments may be required.</Paragraph>
                        <View style={{ marginTop: units.unit4 }}>
                            <Button
                                text="Continue to dashboard"
                                onPress={() => this.props.navigation.navigate('Dashboard')}
                                icon={(
                                    <Ionicons
                                        name="arrow-forward-outline"
                                        size={units.unit4}
                                        color={colors.purpleB}
                                    />
                                )}
                            />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

module.exports = ChangesRequested;