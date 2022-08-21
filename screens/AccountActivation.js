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
import { getApplication } from '../actions/applications/index';
import { createUser } from '../actions/user/index';
import units from '../components/styles/units';

class AccountActivation extends Component {

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

    // get application
    const application = await getApplication(this.props.route.params.applicationId);

    // format new user data
    let newUser = {
      user: {
        type: application.role,
        first_name: application.first_name,
        last_name: application.last_name,
        email: application.email,
        phone_number: application.phone_number,
        address: application.address,
        city: application.city,
        state: application.state,
        zip_code: application.zip_code,
        county: application.county,
        geolocation: application.geolocation,
        profile_image: application.profile_image
      },
      password: this.state.password
    }

    // if unit, add to user data
    if (application.unit) newUser.user.unit = application.unit;

    // create new user
    await this.props.createUser(newUser);

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

            {/* password confirm */}
            <Header type="h4" style={{ marginBottom: units.unit4 }}>
              Activate Account
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
      getApplication,
      createUser
    },
    dispatch,
  );
}

AccountActivation = connect(mapStateToProps, mapDispatchToProps)(AccountActivation);

export default AccountActivation;

module.exports = AccountActivation;
