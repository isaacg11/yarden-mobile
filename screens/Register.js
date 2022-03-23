
import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { alert } from '../components/UI/SystemAlert';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Header from '../components/UI/Header';
import formatPhoneNumber from '../helpers/formatPhoneNumber';
import { getUsers } from '../actions/users/index';

class Register extends Component {

    state = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    }

    async next() {
        // render loading indicator
        await this.setState({ isLoading: true });

        // if password fields do not match, render error
        if (this.state.password !== this.state.confirmPassword) return this.throwWarning('Password fields must match');

        // if password does not meet validation requirements, render error
        if (this.state.password.length < 6) return this.throwWarning('Password must contain at least 6 characters');

        // get users with matching email
        await this.props.getUsers(`email=${this.state.email}`);

        // if matching users, render error
        if (this.props.users.length > 0) return this.throwWarning('Account already exists');

        // navigate to schedule screen
        await this.props.navigation.navigate('Schedule', this.state);

        // hide loading indicator
        this.setState({ isLoading: false });
    }

    throwWarning(message) {

        // render warning message
        alert(message);

        // hide loading indicator
        this.setState({ isLoading: false });
    }

    render() {

        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            confirmPassword,
            isLoading
        } = this.state;

        const {
            navigation
        } = this.props;

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

                {/* registration form start */}
                <Header type="h4" style={{ textAlign: 'center', marginTop: 25 }}>New Account</Header>
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
                        <Input
                            password
                            onChange={(value) => this.setState({ password: value })}
                            value={password}
                            placeholder="Password"
                        />
                    </View>
                    <View>
                        <Input
                            password
                            onChange={(value) => this.setState({ confirmPassword: value })}
                            value={confirmPassword}
                            placeholder="Confirm Password"
                        />
                    </View>
                    <View>
                        <Button
                            text="Next"
                            variant="primary"
                            onPress={() => this.next()}
                            disabled={!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword}
                        />
                    </View>
                    <View>
                        <Button
                            text="Already have an account? Log in"
                            onPress={() => navigation.navigate('Login')}
                            variant="secondary"
                        />
                    </View>
                </View>
                {/* registration form end */}

            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        users: state.users
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getUsers
    }, dispatch)
}

Register = connect(mapStateToProps, mapDispatchToProps)(Register);

export default Register;

module.exports = Register;