
import React, { Component } from 'react';
import { View } from 'react-native';
import Table from '../UI/Table';
import units from '../../components/styles/units';

class Materials extends Component {

    render() {

        const { materials }  = this.props;

        return (
            <View style={{ backgroundColor: '#fff', padding: units.unit5, borderRadius: 5 }}>
                <Table data={materials} />
            </View>
        )
    }
}

module.exports = Materials;