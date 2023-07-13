// libraries
import React, { Component } from 'react';
import { View, Modal } from 'react-native';

// styles
import units from '../styles/units';
import colors from '../styles/colors';

class Dialog extends Component {

    render() {
        const {
            isOpen,
            content
        } = this.props;

        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={isOpen}>
                <View style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    paddingHorizontal: units.unit5
                }}>
                    <View style={{
                        backgroundColor: colors.white,
                        padding: units.unit5,
                        borderRadius: units.unit4
                    }}>
                        {content}
                    </View>
                </View>
            </Modal>
        )
    }
}

module.exports = Dialog;