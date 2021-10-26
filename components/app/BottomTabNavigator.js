import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Orders from '../../screens/Orders';
import Quotes from '../../screens/Quotes';
import Garden from '../../screens/Garden';
import Messenger from '../../screens/Messenger';

const Tab = createBottomTabNavigator();

Ionicons.loadFont().then();

class BottomTabNavigator extends Component {

    renderIcon(route) {
        switch (route) {
            case 'Orders':
                return <Ionicons name={'reader-outline'} size={30} />
            case 'Quotes':
                return <Ionicons name={'layers-outline'} size={30} />
            case 'Garden':
                return <Ionicons name={'leaf-outline'} size={30} />
            case 'Messages':
                return <Ionicons name={'file-tray-outline'} size={30} />
            default:
                return <Ionicons name={'ios-information-circle'} size={30} />
        }
    }

    render() {
        return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        const icon = this.renderIcon(route.name);
                        return icon;
                    },
                    headerShown: false
                })}
            >
                <Tab.Screen name="Orders" component={Orders} />
                <Tab.Screen name="Quotes" component={Quotes} />
                <Tab.Screen name="Garden" component={Garden} />
                <Tab.Screen name="Messages" component={Messenger} />
            </Tab.Navigator>
        )
    }
}

module.exports = BottomTabNavigator;