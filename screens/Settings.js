
import React, { Component } from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import { connect } from 'react-redux';
import Button from '../components/UI/Button';
import Divider from '../components/UI/Divider';
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
                <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25, marginBottom: 25 }}>Settings</Text>
                <View style={{ padding: 12 }}>
                    <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                        <View style={{ marginBottom: 12 }}>
                            <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Name</Text>
                            <Text>{user.first_name} {user.last_name}</Text>
                            <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Email</Text>
                            <Text>{user.email}</Text>
                            <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Phone Number</Text>
                            <Text>{formatPhoneNumber(user.phone_number)}</Text>
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