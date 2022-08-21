
import React, { Component } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import Button from '../components/UI/Button';
import Header from '../components/UI/Header';
import Paragraph from '../components/UI/Paragraph';
import units from '../components/styles/units';

class AccountPending extends Component {

    render() {

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <View style={{ padding: units.unit3 + units.unit4 }}>
                    <Header type="h4" style={{ marginBottom: units.unit5 }}>Application Received!</Header>
                    <View>
                        <Paragraph style={{marginBottom: units.unit3}}>Great job!</Paragraph>
                        <Text>Thanks for applying, we will contact you within 5 business days for a preliminary phone interview!</Text>
                    </View>
                    <View style={{marginTop: units.unit3}}>
                        <Button
                            text="Done"
                            onPress={() => this.props.navigation.navigate('Login')}
                        />
                    </View>
                </View>

            </SafeAreaView>
        )
    }
}

module.exports = AccountPending;