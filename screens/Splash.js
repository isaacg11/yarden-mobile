
// libraries
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// UI components
import { View, Dimensions } from 'react-native';
import Mark from '../components/app/branding/Mark';

// helpers
import moment from 'moment';
import getAuthToken from '../helpers/getAuthToken';
import getAuthTokenExp from '../helpers/getAuthTokenExp';
import removeAuthToken from '../helpers/removeAuthToken';

// actions
import { authenticate } from '../actions/auth/index';

// styles
import units from '../components/styles/units';

class Splash extends Component {

    async componentDidMount() {

        // look for auth token
        const authToken = await getAuthToken();

        // if auth token {...}
        if (authToken) {

            // check auth token expiration date
            const authTokenExp = await getAuthTokenExp();

            // get difference in days
            const diff = moment(authTokenExp).diff(new Date(), 'days');

            // if expired {...}
            if (diff === 0) {

                // remove auth token
                removeAuthToken();
            } else {
                // authenticate user
                await this.props.authenticate();

                // if user authenticated, redirect to dashboard
                if (this.props.user) {
                    return this.props.navigation.navigate('Dashboard');
                } else {
                    // redirect to login
                    this.props.navigation.navigate('Login');
                }
            }
        } else {
            // redirect to login
            this.props.navigation.navigate('Login');
        }
    }

    render() {

        return (
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: Dimensions.get('window').height - units.unit7 }}>
                <Mark size={units.unit7} />
            </View>
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
        authenticate
    }, dispatch)
}

Splash = connect(mapStateToProps, mapDispatchToProps)(Splash);

export default Splash;

module.exports = Splash;