import React, { Component } from 'react';
import { View } from 'react-native';
import Table from '../UI/Table';

class Disposal extends Component {

    render() {

        const { disposal }  = this.props;

        return (
            <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                <Table data={[disposal]} />
            </View>
        )
    }
}

module.exports = Disposal;