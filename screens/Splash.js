
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import moment from 'moment';
import getAuthToken from '../helpers/getAuthToken';
import getAuthTokenExp from '../helpers/getAuthTokenExp';
import removeAuthToken from '../helpers/removeAuthToken';
import { authenticate } from '../actions/auth/index';

class Splash extends Component {

    async componentDidMount() {
        // look for auth token
        const authToken = await getAuthToken();
    
        // if auth token {...}
        if(authToken) {

            // check auth token expiration date
            const authTokenExp = await getAuthTokenExp();

            const diff = moment(authTokenExp).diff(new Date(), 'days');

            // if expired {...}
            if(diff >= 28) {
                // remove auth token
                await removeAuthToken();
            } else {
                // authenticate user
                await this.props.authenticate();
                            
                // if user authenticated, redirect to dashboard
                if(this.props.user) return this.props.navigation.navigate('Dashboard');
            }
        } 

        // redirect to login
        this.props.navigation.navigate('Login');
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Splash Screen</Text>
            </View>
        )
    }
}

function mapStateToProps(state){
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