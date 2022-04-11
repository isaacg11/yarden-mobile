import React, { Component } from 'react';
import Table from '../UI/Table';
import Card from '../UI/Card';

class Disposal extends Component {

    render() {

        const { disposal }  = this.props;

        return (
            <Card>
                <Table data={[disposal]} />
            </Card>
        )
    }
}

module.exports = Disposal;