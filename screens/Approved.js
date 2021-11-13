
import React, { Component } from 'react';
import { Text, SafeAreaView, Button, View } from 'react-native';

class Approved extends Component {

    render() {

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25 }}>Success!</Text>
                <View style={{ padding: 12 }}>
                    <Text style={{ textAlign: 'center', marginTop: 12 }}>
                        Your quote has been approved, great job. Click the button below to go to your account.
                    </Text>
                    <Text style={{ marginTop: 25, textAlign: 'center', fontWeight: 'bold' }}>What happens next?</Text>
                    <Text style={{ marginTop: 12}}>1. Your project materials will be purchased and shipped.</Text>
                    <Text style={{ marginTop: 12}}>2. The service time/date is scheduled. A confirmation message will be sent to you.</Text>
                    <Text style={{ marginTop: 12}}>3. On the date of service, Yarden will send a team member out to complete your service.</Text>
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

module.exports = Approved;