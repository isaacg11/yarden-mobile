import React, { Component } from 'react';
import Table from '../UI/Table';
import Card from '../UI/Card';

class Labor extends Component {

    render() {

        const { labor }  = this.props;

        return (
            <Card>
                <Table data={[labor]} />
            </Card>
        )
    }
}

module.exports = Labor;