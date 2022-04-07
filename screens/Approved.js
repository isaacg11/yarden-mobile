
import React, { Component } from 'react';
import { SafeAreaView, Button, View } from 'react-native';
import Header from '../components/UI/Header';
import Paragraph from '../components/UI/Paragraph';
import units from '../components/styles/units';

class Approved extends Component {

    render() {
        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <Header type="h4" style={{ textAlign: 'center', marginTop: units.unit6 }}>Success!</Header>
                <View style={{ padding: units.unit5 }}>
                    <Paragraph style={{ textAlign: 'center', marginTop: units.unit5 }}>
                        Your quote has been approved, great job. Click the button below to go to your account.
                    </Paragraph>
                    <Paragraph style={{ marginTop: units.unit6, textAlign: 'center', fontWeight: 'bold' }}>What happens next?</Paragraph>
                    <Paragraph style={{ marginTop: units.unit5}}>1. Your project materials will be purchased and shipped.</Paragraph>
                    <Paragraph style={{ marginTop: units.unit5}}>2. The service time/date is scheduled. A confirmation message will be sent to you.</Paragraph>
                    <Paragraph style={{ marginTop: units.unit5}}>3. On the date of service, Yarden will send a team member out to complete your service.</Paragraph>
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

module.exports = Approved;