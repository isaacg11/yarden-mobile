import React, { Component } from 'react';
import { View } from 'react-native';
import Table from '../UI/Table';

class ToolRentals extends Component {

    render() {

        const { rentals }  = this.props;

        return (
            <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                <Table data={[rentals]} />
            </View>
        )
    }
}

module.exports = ToolRentals;