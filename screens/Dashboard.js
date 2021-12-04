
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text } from 'react-native';
import { createDrawerNavigator } from "@react-navigation/drawer";
import Mark from '../components/app/branding/Mark';
import BottomTabNavigator from '../components/app/BottomTabNavigator';
import Referrals from '../screens/Referrals';
import Settings from '../screens/Settings';
import Logout from '../screens/Logout';
import Subscription from '../screens/Subscription';

const Drawer = createDrawerNavigator();

class Dashboard extends Component {

    render() {

        // display config
        const displayNone = () => { return <Text></Text> };

        // set header logo
        const logo = <Mark />;

        return (
            <Drawer.Navigator>
                <Drawer.Screen
                    name="Home"
                    component={BottomTabNavigator}
                    options={{
                        headerTitle: () => logo
                    }}
                />
                <Drawer.Screen
                    name="Referrals"
                    component={Referrals}
                    options={{
                        headerTitle: () => logo
                    }}
                />
                <Drawer.Screen
                    name="Subscription"
                    component={Subscription}
                    options={{
                        headerTitle: () => logo
                    }}
                />
                <Drawer.Screen
                    name="Settings"
                    component={Settings}
                    options={{
                        headerTitle: () => logo
                    }}
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