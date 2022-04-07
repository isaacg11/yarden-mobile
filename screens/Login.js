
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View, SafeAreaView } from 'react-native';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Header from '../components/UI/Header';
import { alert } from '../components/UI/SystemAlert';
import { login } from '../actions/auth/index';
import units from '../components/styles/units';

class Login extends Component {

    state = {
        email: '',
        password: ''
    }

    async login() {

        // if user selected too many plants, show error message
        if(!this.state.email || !this.state.password) return alert('Please complete all required fields');

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
    }

    render() {

        const {
            email,
            password,
        } = this.state;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>

                {/* login form start */}
                <Header type="h4" style={{ textAlign: 'center', marginTop: units.unit6 }}>Sign In</Header>
                <View style={{ padding: units.unit5 }}>
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