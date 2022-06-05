
import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Card from '../components/UI/Card';
import { alert } from '../components/UI/SystemAlert';
import Header from '../components/UI/Header';
import formatPhoneNumber from '../helpers/formatPhoneNumber';
import { updateUser } from '../actions/user/index';
import units from '../components/styles/units';
import fonts from '../components/styles/fonts';
import colors from '../components/styles/colors';

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

                <KeyboardAwareScrollView>
                    <View style={{ padding: units.unit3 + units.unit4 }}>

                        {/* change date form start */}
                        <Header type="h4" style={{ marginBottom: units.unit5 }}>Change Settings</Header>
                        <View>
                            <Card style={{ marginBottom: units.unit4 }}>
                                <View>
                                    <Input
                                        label="First Name"
                                        onChange={(value) => this.setState({ firstName: value })}
                                        value={firstName}
                                        placeholder="First Name"
                                    />
                                </View>
                                <View>
                                    <Input
                                        label="Last Name"
                                        onChange={(value) => this.setState({ lastName: value })}
                                        value={lastName}
                                        placeholder="Last Name"
                                    />
                                </View>
                                <View>
                                    <Input
                                        label="Email"
                                        onChange={(value) => this.setState({ email: value })}
                                        value={email}
                                        placeholder="Email"
                                    />
                                </View>
                                <View>
                                    <Input
                                        label="Phone Number"
                                        onChange={(value) => this.setState({ phoneNumber: value })}
                                        value={formatPhoneNumber(phoneNumber)}
                                        placeholder="Phone Number"
                                    />
                                </View>
                            </Card>
                            <View>
                                <Button
                                    text="Save Changes"
                                    onPress={() => this.save()}
                                    icon={
                                        <Ionicons name="save" size={fonts.h4} color={colors.purpleB} />
                                    }
                                />
                            </View>
                        </View>
                        {/* change date form end */}

                    </View>
                </KeyboardAwareScrollView>
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