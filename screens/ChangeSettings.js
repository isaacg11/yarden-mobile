
import React, { Component } from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import { alert } from '../components/UI/SystemAlert';
import formatPhoneNumber from '../helpers/formatPhoneNumber';
import { updateUser } from '../actions/user/index';

class ChangeSettings extends Component {

    state = {}

    componentDidMount() {
        this.setState({
            firstName: this.props.route.params.firstName,
            lastName: this.props.route.params.lastName,
            email: this.props.route.params.email,
            phoneNumber: this.props.route.params.phoneNumber
        })
    }

    async save() {
        // render loading indicator
        await this.setState({ isLoading: true });

        // format new date
        const newUser = {
            userFirstName: this.state.firstName,
            userLastName: this.state.lastName,
            userEmail: this.state.email,
            userPhoneNumber: this.state.phoneNumber
        };

        // update user with new settings
        await this.props.updateUser(null, newUser);

        // hide loading indicator
        await this.setState({ isLoading: false });

        // render success alert
        alert('Your settings have been updated', 'Success!', () => this.props.navigation.navigate('Settings'));
    }

    render() {

        const {
            firstName,
            lastName,
            email,
            phoneNumber = '',
            isLoading
        } = this.state;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                {/* loading indicator start */}
                <LoadingIndicator
                    loading={isLoading}
                />
                {/* loading indicator end */}

                {/* change date form start */}
                <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25 }}>Change Settings</Text>
                <View style={{ padding: 12 }}>
                    <View>
                        <Input
                            onChange={(value) => this.setState({ firstName: value })}
                            value={firstName}
                            placeholder="First Name"
                        />
                    </View>
                    <View>
                        <Input
                            onChange={(value) => this.setState({ lastName: value })}
                            value={lastName}
                            placeholder="Last Name"
                        />
                    </View>
                    <View>
                        <Input
                            onChange={(value) => this.setState({ email: value })}
                            value={email}
                            placeholder="Email"
                        />
                    </View>
                    <View>
                        <Input
                            onChange={(value) => this.setState({ phoneNumber: value })}
                            value={formatPhoneNumber(phoneNumber)}
                            placeholder="Phone Number"
                        />
                    </View>
                    <View>
                        <Button
                            text="Save Changes"
                            onPress={() => this.save()}
                            variant="primary"
                        />
                    </View>
                </View>
                {/* change date form end */}

            </SafeAreaView>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateUser
    }, dispatch)
}

ChangeSettings = connect(null, mapDispatchToProps)(ChangeSettings);

export default ChangeSettings;

module.exports = ChangeSettings;