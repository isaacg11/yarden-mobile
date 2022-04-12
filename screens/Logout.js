
import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Header from '../components/UI/Header';
import { logout } from '../actions/auth/index';
import units from '../components/styles/units';

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
                <View style={{ padding: units.unit3 + units.unit4 }}>
                    <Header type="h4" style={{ marginTop: units.unit6 }}>Logging Out...</Header>
                </View>
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