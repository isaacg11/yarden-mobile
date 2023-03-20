// libraries
import React, { Component } from 'react';
import { View, Modal, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

// types
import types from '../../vars/types';

// styles
import units from '../styles/units';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

const menuItemContainerStyles = {
    padding: units.unit5,
    width: '100%'
}

const menuItemTextStyles = {
    textAlign: 'center',
    fontSize: fonts.h3
}

class NavMenu extends Component {

    state = {};

    render() {
        const {
            user,
            isOpen = false,
            close
        } = this.props;

        return (
            <Modal
                animationType="slide"
                presentationStyle="fullScreen"
                visible={isOpen}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', paddingTop: units.unit7 }}>
                    <View style={{ width: '100%' }}>

                        {/* menu items */}
                        <TouchableOpacity
                            onPress={() => close('Dashboard')}
                            style={menuItemContainerStyles}>
                            <Text style={menuItemTextStyles}>Home</Text>
                        </TouchableOpacity>
                        {(user.type === types.CUSTOMER) && (
                            <View>
                                <TouchableOpacity
                                    onPress={() => close('Referrals')}
                                    style={menuItemContainerStyles}>
                                    <Text style={menuItemTextStyles}>Referrals</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => close('Subscription')}
                                    style={menuItemContainerStyles}>
                                    <Text style={menuItemTextStyles}>Subscription</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        <TouchableOpacity
                            onPress={() => close('Settings')}
                            style={menuItemContainerStyles}>
                            <Text style={menuItemTextStyles}>Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => close('Log Out')}
                            style={menuItemContainerStyles}>
                            <Text style={menuItemTextStyles}>Log Out</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => close('Dashboard')}
                            style={menuItemContainerStyles}>
                            <Text style={menuItemTextStyles}>
                                <Ionicons
                                    name="close-outline"
                                    size={fonts.h1}
                                    color={colors.purpleB}
                                />
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
    };
}

NavMenu = connect(mapStateToProps, null)(NavMenu);

export default NavMenu;

module.exports = NavMenu;
