
import React, { Component } from 'react';
import Table from '../UI/Table';
import Card from '../UI/Card';

class Materials extends Component {

    render() {

        const { materials }  = this.props;

        return (
            <Card>
                <Table 
                    data={materials} 
                    excludedColumns={['name']}
                />
            </Card>
        )
    }
}

module.exports = Materials;