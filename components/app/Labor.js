import React, { Component } from 'react';
import { View } from 'react-native';
import Table from '../UI/Table';

class Labor extends Component {

    render() {

        const { labor }  = this.props;

        return (
            <View>
                <Table data={[labor]} />
            </View>
        )
    }
}

module.exports = Labor;