import React, { Component } from 'react';
import Table from '../UI/Table';
import Card from '../UI/Card';

class Delivery extends Component {

    render() {

        const { delivery }  = this.props;

        return (
            <Card>
                <Table data={[delivery]} />
            </Card>
        )
    }
}

module.exports = Delivery;