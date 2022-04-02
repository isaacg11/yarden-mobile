
import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import { connect } from 'react-redux';
import Button from '../components/UI/Button';
import Divider from '../components/UI/Divider';
import Paragraph from '../components/UI/Paragraph';
import formatPhoneNumber from '../helpers/formatPhoneNumber';

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
                <Paragraph style={{ fontSize: 25, textAlign: 'center', marginTop: 25, marginBottom: 25 }}>Settings</Paragraph>
                <View style={{ padding: 12 }}>
                    <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                        <View style={{ marginBottom: 12 }}>
                            <Paragraph style={{ fontWeight: 'bold', marginTop: 12 }}>Name</Paragraph>
                            <Paragraph>{user.first_name} {user.last_name}</Paragraph>
                            <Paragraph style={{ fontWeight: 'bold', marginTop: 12 }}>Email</Paragraph>
                            <Paragraph>{user.email}</Paragraph>
                            <Paragraph style={{ fontWeight: 'bold', marginTop: 12 }}>Phone Number</Paragraph>
                            <Paragraph>{formatPhoneNumber(user.phone_number)}</Paragraph>
                        </View>
                        <Divider />
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
                    </View>
                </View>
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