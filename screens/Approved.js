
import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/UI/Header';
import Paragraph from '../components/UI/Paragraph';
import Button from '../components/UI/Button';
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class Approved extends Component {

    render() {
        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <View style={{ padding: units.unit3 + units.unit4 }}>
                    <Header type="h4" style={{ marginBottom: units.unit5 }}>Success!</Header>
                    <View>
                        <View>
                            <Paragraph style={{ textAlign: 'center', marginTop: units.unit3 }}>
                                Your quote has been approved, great job!
                            </Paragraph>
                            <Paragraph style={{ marginTop: units.unit4, textAlign: 'center', fontWeight: 'bold' }}>What happens next?</Paragraph>
                            <Paragraph style={{ marginTop: units.unit5 }}>1. Your project materials will be purchased and shipped.</Paragraph>
                            <Paragraph style={{ marginTop: units.unit5 }}>2. The service time/date is scheduled. A confirmation message will be sent to you.</Paragraph>
                            <Paragraph style={{ marginTop: units.unit5 }}>3. On the date of service, Yarden will send a team member out to complete your service.</Paragraph>
                        </View>
                        <View style={{ marginTop: units.unit4 }}>
                            <Button
                                alignIconRight
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

module.exports = Approved;