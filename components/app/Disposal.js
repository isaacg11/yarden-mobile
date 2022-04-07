import React, { Component } from 'react';
import { View } from 'react-native';
import Table from '../UI/Table';
import units from '../../components/styles/units';

class Disposal extends Component {

    render() {

        const { disposal }  = this.props;

        return (
            <View style={{ backgroundColor: '#fff', padding: units.unit5, borderRadius: 5 }}>
                <Table data={[disposal]} />
            </View>
        )
    }
}

module.exports = Disposal;