import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Orders from '../../screens/Orders';
import Quotes from '../../screens/Quotes';
import Messenger from '../../screens/Messenger';
import { logout } from '../../actions/auth/index';
const Tab = createBottomTabNavigator();

Ionicons.loadFont().then();

class BottomTabNavigator extends Component {

    componentDidMount() {
        if(this.props.route.params && this.props.route.params.action) {
            switch(this.props.route.params.action) {
                case 'log out':
                    return this.logout();
                default:
                    return () => {}
            }
        }
    }

    async logout() {
        // logout
        await this.props.logout();

        // redirect to login
        this.props.navigation.navigate('Login');
    }

    renderIcon(route) {
        switch (route) {
            case 'Orders':
                return <Ionicons name={'reader-outline'} size={30} />
            case 'Quotes':
                return <Ionicons name={'layers-outline'} size={30}/>
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
                <Tab.Screen name="Messages" component={Messenger} />
            </Tab.Navigator>
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
        logout
    }, dispatch)
}

BottomTabNavigator = connect(mapStateToProps, mapDispatchToProps)(BottomTabNavigator);

export default BottomTabNavigator;

module.exports = BottomTabNavigator;