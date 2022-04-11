
import React, { Component } from 'react';
import { View } from 'react-native';
import Table from '../UI/Table';

class Materials extends Component {

    render() {

        const { materials }  = this.props;

        return (
            <View>
                <Table 
                    data={materials} 
                    excludedColumns={['name']}
                />
            </View>
        )
    }
}

module.exports = Materials;