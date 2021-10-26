
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text } from 'react-native';
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabNavigator from '../components/app/BottomTabNavigator';
import Referrals from '../screens/Referrals';
import Settings from '../screens/Settings';
import Logout from '../screens/Logout';

const Drawer = createDrawerNavigator();

class Dashboard extends Component {

    render() {

        // display config
        const displayNone = () => { return <Text></Text> };

        return (
            <Drawer.Navigator>
                <Drawer.Screen 
                    name="Home" 
                    component={BottomTabNavigator} 
                />
                <Drawer.Screen 
                    name="Referrals" 
                    component={Referrals} 
                />
                <Drawer.Screen 
                    name="Settings" 
                    component={Settings} 
                />
                <Drawer.Screen 
                    name="Log Out" 
                    component={Logout} 
                    options={{
                        headerLeft: displayNone,
                        header: displayNone
                }} />
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