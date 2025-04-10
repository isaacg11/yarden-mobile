
import React, { Component } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/UI/Header';
import Button from '../components/UI/Button';
import Paragraph from '../components/UI/Paragraph';
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class Welcome extends Component {

    render() {

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <View style={{ padding: units.unit3 + units.unit4 }}>
                    <Header type="h4" style={{ marginBottom: units.unit5 }}>Welcome to Yarden!</Header>
                    <View>
                        <Paragraph style={{marginBottom: units.unit3}}>Great job!</Paragraph>
                        <Text>Your appointment has been scheduled. A gardener will meet with you at the scheduled time / date to discuss your garden options.</Text>
                    </View>
                    <View style={{marginTop: units.unit3}}>
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

            </SafeAreaView>
        )
    }
}

module.exports = Welcome;