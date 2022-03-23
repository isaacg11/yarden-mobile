
import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from '../components/UI/Header';
import { logout } from '../actions/auth/index';

class Logout extends Component {

    componentDidMount() {
        setTimeout(() => {
            this.logout();
        }, 2500)
    }

    async logout() {
        // logout
        await this.props.logout();

        // redirect to login
        this.props.navigation.navigate('Login');
    }

    render() {

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <Header type="h4" style={{ textAlign: 'center', marginTop: 25 }}>Logging Out...</Header>
            </SafeAreaView>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        logout
    }, dispatch)
}

Logout = connect(null, mapDispatchToProps)(Logout);

export default Logout;

module.exports = Logout;