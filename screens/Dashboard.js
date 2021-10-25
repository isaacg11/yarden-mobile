
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabNavigator from '../components/app/BottomTabNavigator';
import Referrals from '../screens/Referrals';
import Settings from '../screens/Settings';

const Drawer = createDrawerNavigator();

class Dashboard extends Component {

    render() {
        return (
            <Drawer.Navigator>
                <Drawer.Screen name="Home" component={BottomTabNavigator} />
                <Drawer.Screen name="Referrals" component={Referrals} />
                <Drawer.Screen name="Settings" component={Settings} />
                <Drawer.Screen name="Log Out" component={BottomTabNavigator} initialParams={{ action: 'log out' }} />
            </Drawer.Navigator>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

Dashboard = connect(mapStateToProps, null)(Dashboard);

export default Dashboard;

module.exports = Dashboard;