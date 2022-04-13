import React, { Component } from 'react';
import { View } from 'react-native';
import Table from '../UI/Table';

class Delivery extends Component {

    render() {

        const { delivery }  = this.props;

        return (
            <View>
                <Table data={[delivery]} />
            </View>
        )
    }
}

module.exports = Delivery;