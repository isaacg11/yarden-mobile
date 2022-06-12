import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Header from '../components/UI/Header';
import { alert } from '../components/UI/SystemAlert';
import { resetPassword } from '../actions/auth/index';
import units from '../components/styles/units';

class PasswordConfirm extends Component {
  state = {};

  async confirm() {
    // render loading indicator
    await this.setState({ isLoading: true });

    // if passwords do not match, render error
    if (this.state.password !== this.state.confirmPassword)
      return throwWarning('Password fields must match');

    // if password does not meet validation requirements, render error
    if (this.state.password.length < 6)
      return this.throwWarning('Password must contain at least 6 characters');

    // reset password
    await this.props.resetPassword(this.props.route.params.userId, {
      userPassword: this.state.password,
    });

    // redirect to dashboard
    this.props.navigation.navigate('Dashboard');

    // hide loading indicator
    await this.setState({ isLoading: false });
  }

  throwWarning(message) {
    // render warning message
    alert(message);

    // hide loading indicator
    this.setState({ isLoading: false });
  }

  render() {
    const { password, confirmPassword, isLoading } = this.state;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
          justifyContent: 'center',
        }}>

        <KeyboardAwareScrollView>
          <View style={{ padding: units.unit3 + units.unit4 }}>
            {/* loading indicator start */}
            <LoadingIndicator loading={isLoading} />
            {/* loading indicator end */}

            {/* password confirm start */}
            <Header type="h4" style={{ marginBottom: units.unit4 }}>
              Confirm Password
            </Header>
            <View>
              <View>
                <Input
                  label="New Password"
                  password
                  onChange={value => this.setState({ password: value })}
                  value={password}
                  placeholder="New Password"
                />
              </View>
              <View>
                <Input
                  label="Confirm Password"
                  password
                  onChange={value => this.setState({ confirmPassword: value })}
                  value={confirmPassword}
                  placeholder="Confirm Password"
                />
              </View>
              <View>
                <Button
                  text="Continue"
                  onPress={() => this.confirm()}
                  variant="primary"
                  disabled={!password || !confirmPassword}
                />
              </View>
            </View>
            {/* password confirm start */}
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
      resetPassword,
    },
    dispatch,
  );
}

PasswordConfirm = connect(mapStateToProps, mapDispatchToProps)(PasswordConfirm);

export default PasswordConfirm;

module.exports = PasswordConfirm;
