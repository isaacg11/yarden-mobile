import React, { Component } from 'react';
import { View } from 'react-native';
import Table from '../UI/Table';
import Card from '../UI/Card';
import units from '../../components/styles/units';

class ToolRentals extends Component {

    render() {

        const { rentals }  = this.props;

        return (
            <Card>
                <Table data={[rentals]} />
            </Card>
        )
    }
}

module.exports = ToolRentals;