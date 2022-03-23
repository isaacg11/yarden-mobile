
import React, { Component } from 'react';
import { View } from 'react-native';
import IconBadge from 'react-native-icon-badge';
import Paragraph from './Paragraph';

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
                        <Paragraph style={{ color: '#FFFFFF',  }}>{count}</Paragraph>
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