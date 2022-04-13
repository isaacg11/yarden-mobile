
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Button from '../components/UI/Button';
import Paragraph from '../components/UI/Paragraph';
import Header from '../components/UI/Header';
import Card from '../components/UI/Card';
import PaymentMethod from '../components/app/PaymentMethod';
import formatPhoneNumber from '../helpers/formatPhoneNumber';
import units from '../components/styles/units';

class Settings extends Component {

    render() {

        const {
            user
        } = this.props;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <ScrollView>
                    <Header type="h4" style={{ marginTop: units.unit6 }}>Settings</Header>
                    <View style={{ padding: units.unit5 }}>
                        <Card style={{ marginBottom: units.unit4 }}>
                            <View style={{ marginBottom: units.unit5 }}>
                                <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Name</Paragraph>
                                <Paragraph>{user.first_name} {user.last_name}</Paragraph>
                                <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Email</Paragraph>
                                <Paragraph>{user.email}</Paragraph>
                                <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Phone Number</Paragraph>
                                <Paragraph>{formatPhoneNumber(user.phone_number)}</Paragraph>
                            </View>
                            <View>
                                <Button
                                    text="Edit"
                                    onPress={() => this.props.navigation.navigate('Change Settings', {
                                        firstName: user.first_name,
                                        lastName: user.last_name,
                                        email: user.email,
                                        phoneNumber: user.phone_number
                                    })}
                                    variant="secondary"
                                />
                            </View>
                        </Card>
                        {user.payment_info && (
                            <Card>
                                <View style={{ paddingLeft: units.unit5, paddingRight: units.unit5, marginTop: units.unit6 }}>
                                    <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit3 }}>Payment Method</Paragraph>
                                </View>
                                <PaymentMethod />
                            </Card>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

Settings = connect(mapStateToProps, null)(Settings);

export default Settings;

module.exports = Settings;