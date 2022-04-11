import React, { Component } from 'react';
import { View, Text } from 'react-native';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import units from '../styles/units';

class Status extends Component {
    getlinkStyles(status) {
        // render badgeStyles styled based on color
        switch (status) {
            case 'bid requested':
                return this.badgeStyles.requested;
            case 'pending approval':
                return this.badgeStyles.pending;
            case 'approved':
                return this.badgeStyles.complete;
            default:
                return this.badgeStyles.requested;
        }
    }

    badgeStyles = {
        requested: {
            backgroundColor: 'red'
        },
        pending: {
            backgroundColor: colors.greenC10
        },
        complete: {
            backgroundColor: 'green'
        },
    };

    render() {
        const { status } = this.props;
        const linkStyles = this.getlinkStyles(status);

        return (
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                }}>
                <View
                    style={{
                        ...linkStyles,
                        paddingHorizontal: units.unit3,
                        borderRadius: units.unit3,
                    }}>
                    <Text
                        style={{
                            ...fonts.small,
                            textTransform: 'capitalize',
                        }}>
                        {status}
                    </Text>
                </View>
            </View>
        );
    }
}

module.exports = Status;
