
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import IconBadge from 'react-native-icon-badge';

class Badge extends Component {

    render() {
        const {
            icon,
            count
        } = this.props;

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                <IconBadge
                    MainElement={icon}
                    BadgeElement={
                        <Text style={{ color: '#FFFFFF',  }}>{count}</Text>
                    }
                    IconBadgeStyle={
                        {
                            width: 20,
                            height: 20,
                            backgroundColor: '#ff9900'
                        }
                    }
                />
            </View>
        )
    }
}

module.exports = Badge;