
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View, Text, SafeAreaView } from 'react-native';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import { login } from '../actions/auth/index';

class Login extends Component {

    state = {
        email: '',
        password: ''
    }

    async login() {
        // render loading indicator
        await this.setState({ isLoading: true });

        const credentials = {
            email: this.state.email,
            password: this.state.password
        }

        // authenticate user
        await this.props.login(credentials);

        // if user session {...}
        if (this.props.user._id) {

            // redirect to dashboard
            this.props.navigation.navigate('Dashboard');
        }

        // hide loading indicator
        await this.setState({ isLoading: false });
    }

    render() {

        const {
            email,
            password,
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

                {/* login form start */}
                <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25 }}>Sign In</Text>
                <View style={{ padding: 12 }}>
                    <View>
                        <Input
                            onChange={(value) => this.setState({ email: value })}
                            value={email}
                            placeholder="Email"
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
                        <Button
                            text="Continue"
                            onPress={() => this.login()}
                            variant="primary"
                            disabled={!email || !password}
                        />
                    </View>
                    <View style={{ marginTop: 15 }}>
                        <Button
                            text="Create new account"
                            onPress={() => this.props.navigation.navigate('Register')}
                            variant="secondary"
                        />
                    </View>
                    <View>
                        <Button
                            text="Forgot your password?"
                            onPress={() => this.props.navigation.navigate('Password Reset')}
                            variant="secondary"
                        />
                    </View>
                </View>
                {/* login form end */}

            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        login
    }, dispatch)
}

Login = connect(mapStateToProps, mapDispatchToProps)(Login);

export default Login;

module.exports = Login;