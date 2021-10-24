
import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout } from '../actions/auth/index';

class Dashboard extends Component {

    async logout() {
        // logout
        await this.props.logout();

        // redirect to login
        this.props.navigation.navigate('Login');
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Dashboard Screen</Text>
                <Button
                    title="Logout"
                    onPress={() => this.logout()}
                />
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        logout
    }, dispatch)
}

Dashboard = connect(mapStateToProps, mapDispatchToProps)(Dashboard);

export default Dashboard;

module.exports = Dashboard;