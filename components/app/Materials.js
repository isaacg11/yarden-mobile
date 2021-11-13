
import React, { Component } from 'react';
import { View } from 'react-native';
import Table from '../UI/Table';

class Materials extends Component {

    render() {

        const { materials }  = this.props;

        return (
            <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                <Table data={materials} />
            </View>
        )
    }
}

module.exports = Materials;