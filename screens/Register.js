import React, { Component } from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProfileImage from '../components/app/ProfileImage';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { alert } from '../components/UI/SystemAlert';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Header from '../components/UI/Header';
import Link from '../components/UI/Link';
import formatPhoneNumber from '../helpers/formatPhoneNumber';
import { getUsers } from '../actions/users/index';
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class Register extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  };

  async next() {
    // render loading indicator
    await this.setState({ isLoading: true });

    if (this.props.route.params.accountType === 'customer') {
      
      // if password fields do not match, render error
      if (this.state.password !== this.state.confirmPassword)
        return this.throwWarning('Password fields must match');

      // if password does not meet validation requirements, render error
      if (this.state.password.length < 6)
        return this.throwWarning('Password must contain at least 6 characters');
    }

    // if phone number does not meet validation requirements, render error
    if (this.state.phoneNumber.length < 10)
      return this.throwWarning('Phone number must have 10 digits');

    // get users with matching email
    await this.props.getUsers(`email=${this.state.email}`);

    // if matching users, render error
    if (this.props.users.length > 0)
      return this.throwWarning('Account already exists');

    // set redirect based on account type
    const redirect = (this.props.route.params.accountType === 'customer') ? 'Schedule' : 'Application';

    // navigate to schedule screen
    await this.props.navigation.navigate(redirect, this.state);

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
      isLoading,
    } = this.state;

    const { navigation } = this.props;

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

            {/* loading indicator start */}
            <LoadingIndicator loading={isLoading} />
            {/* loading indicator end */}

            {/* registration form start */}
            <Header type="h4" style={{ marginBottom: units.unit5 }}>
              New Account
            </Header>
            <View>
              {(this.props.route.params.accountType === 'gardener') && (
                <View style={{ marginBottom: units.unit4 }}>
                  <ProfileImage onSelect={(img) => this.setState({ profileImage: img })} />
                </View>
              )}
              <View>
                <Input
                  label="First Name"
                  onChange={value => this.setState({ firstName: value })}
                  value={firstName}
                  placeholder="First Name"
                />
              </View>
              <View>
                <Input
                  label="Last Name"
                  onChange={value => this.setState({ lastName: value })}
                  value={lastName}
                  placeholder="Last Name"
                />
              </View>
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
                  type="numeric"
                  label="Phone Number"
                  onChange={value => this.setState({ phoneNumber: value })}
                  value={formatPhoneNumber(phoneNumber)}
                  placeholder="Phone Number"
                />
              </View>
              {(this.props.route.params.accountType === 'customer') && (
                <View>
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
                    <Input
                      password
                      label="Confirm Password"
                      onChange={value => this.setState({ confirmPassword: value })}
                      value={confirmPassword}
                      placeholder="Confirm Password"
                    />
                  </View>
                </View>
              )}
              <View>
                <Button
                  alignIconRight
                  text="Next"
                  variant="primary"
                  onPress={() => this.next()}
                  disabled={
                    !firstName ||
                    !lastName ||
                    !email ||
                    !phoneNumber ||
                    (
                      this.props.route.params.accountType === 'customer' && (
                        !password ||
                        !confirmPassword
                      )
                    )

                  }
                  icon={
                    <Ionicons
                      name="arrow-forward-outline"
                      size={units.unit4}
                      color={colors.purpleB}
                    />
                  }
                />
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: units.unit4,
                  alignItems: 'center',
                }}>
                <Text style={{ color: colors.greenD75 }}>
                  Already have an account?{' '}
                </Text>
                <Link
                  text="Log In"
                  onPress={() => navigation.navigate('Login')}
                />
              </View>
            </View>
          </View>
          {/* registration form end */}

        </KeyboardAwareScrollView>
      </SafeAreaView>

    );
  }
}

function mapStateToProps(state) {
  return {
    users: state.users,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getUsers,
    },
    dispatch,
  );
}

Register = connect(mapStateToProps, mapDispatchToProps)(Register);

export default Register;

module.exports = Register;
