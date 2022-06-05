
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SafeAreaView, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Header from '../components/UI/Header';
import { alert } from '../components/UI/SystemAlert';
import { sendEmail } from '../actions/emails/index';
import { getUsers } from '../actions/users/index';
import { APP_URL } from '../helpers/getUrl';
import units from '../components/styles/units';

class PasswordReset extends Component {

    state = {}

    async reset() {
        // render loading indicator
        await this.setState({ isLoading: true });

        // get users with matching email
        await this.props.getUsers(`email=${this.state.email}`);

        // if no matching users, render error
        if (this.props.users.length < 1) alert('Account does not exist');

        // set current user
        const user = this.props.users.find((u) => u.email === this.state.email);

        if (user) {
            // format email
            const resetConfirmation = {
                email: user.email,
                subject: `Yarden - Password Reset`,
                label: 'Password Reset',
                body: (
                    '<p>Hello <b>' + user.first_name + '</b>,</p>' +
                    '<p>To reset your password, please click the link below.</p>' +
                    `<a href="${APP_URL}/reset-password?userId=${user._id}&device=mobile">RESET PASSWORD</a>`
                )
            }

            // send reset confirmation email
            await this.props.sendEmail(resetConfirmation);

            // alert user to check email
            alert(`A password reset link has been sent to ${user.email}`, 'Almost done!');
        }

        // hide loading indicator
        this.setState({ isLoading: false });
    }

    render() {

        const {
            email,
            isLoading
        } = this.state;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>

                <KeyboardAwareScrollView>
                    <View style={{ padding: units.unit3 + units.unit4 }}>
                        {/* loading indicator start */}
                        <LoadingIndicator
                            loading={isLoading}
                        />
                        {/* loading indicator end */}

                        {/* password reset start */}
                        <Header type="h4" style={{ marginBottom: units.unit5 }}>Password Reset</Header>
                        <View>
                            <View>
                                <Input
                                    label="Email"
                                    onChange={(value) => this.setState({ email: value })}
                                    value={email}
                                    placeholder="Email"
                                />
                            </View>
                            <View>
                                <Button
                                    text="Continue"
                                    onPress={() => this.reset()}
                                    variant="primary"
                                    disabled={!email}
                                />
                            </View>
                        </View>
                        {/* password reset end */}

                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        users: state.users,
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        sendEmail,
        getUsers
    }, dispatch)
}

PasswordReset = connect(mapStateToProps, mapDispatchToProps)(PasswordReset);

export default PasswordReset;

module.exports = PasswordReset;