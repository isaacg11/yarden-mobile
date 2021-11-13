import React, { Component } from 'react';
import { View } from 'react-native';
import Table from '../UI/Table';

class Delivery extends Component {

    render() {

        const { delivery }  = this.props;

        return (
            <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                <Table data={[delivery]} />
            </View>
        )
    }
}

module.exports = Delivery;