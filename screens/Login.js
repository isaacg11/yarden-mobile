import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View, SafeAreaView, Image, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Link from '../components/UI/Link';
import { login } from '../actions/auth/index';
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class Login extends Component {
  state = {
    email: '',
    password: '',
  };

  async login() {
    const credentials = {
      email: this.state.email,
      password: this.state.password,
    };

    // authenticate user
    await this.props.login(credentials);

    // if user session {...}
    if (this.props.user._id) {
      // redirect to dashboard
      this.props.navigation.navigate('Dashboard');
    }
  }

  render() {
    const { email, password } = this.state;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}>

        <KeyboardAwareScrollView>
          <View style={{ padding: units.unit3 + units.unit4 }}>
            {/* login form start */}
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Image
                source={{
                  uri: 'https://yarden-garden.s3.us-west-1.amazonaws.com/mobile/yarden_logotype_bw.png',
                }}
                style={{ width: '50%', height: 100 }}
              />
            </View>
            <View>
              <View>
                <Input
                  label="Email"
                  onChange={value => this.setState({ email: value })}
                  value={email}
                  placeholder="Email"
                />
              </View>
              <View>
                <Input
                  password
                  label="Password"
                  onChange={value => this.setState({ password: value })}
                  value={password}
                  placeholder="Password"
                />
              </View>
              <View>
                <Button
                  disabled={!email || !password}
                  text="Continue"
                  onPress={() => this.login()}
                  variant="primary"
                />
              </View>
              <View>
                <Button
                  text="Learn More"
                  variant="btn2"
                  style={{ marginTop: units.unit4 }}
                  onPress={() => this.props.navigation.navigate('Learn More')}
                />
              </View>
              <View
                style={{
                  marginTop: units.unit4,
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <Link
                  text="Forgot your password?"
                  onPress={() => this.props.navigation.navigate('Password Reset')}
                />
              </View>
            </View>
            {/* login form end */}
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              width: '100%',
              alignItems: 'center',
            }}>
            <Text style={{ color: colors.greenD75 }}>Don't have an account? </Text>
            <Link
              text="Sign up"
              onPress={() => this.props.navigation.navigate('Register')}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      login,
    },
    dispatch,
  );
}

Login = connect(mapStateToProps, mapDispatchToProps)(Login);

export default Login;

module.exports = Login;
