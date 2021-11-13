
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Link from '../UI/Link';

class Table extends Component {

    renderColumns(row) {
        let columns = [];
        for (const column in row) {
            if (column === 'url') {
                columns.push({ url: row[column] });
            } else {
                const text = (column === 'price') ? `$${row[column].toFixed(2)}` : row[column];
                columns.push({ text: text });
            }
        }

        return columns.map((column, index) => {

            // // if link {...}
            if (column.url) {
                // render link
                return (
                    <View style={{ flex: 1, alignSelf: 'stretch', padding: 5 }} key={index}>
                        <Text numberOfLines={3}>
                            <Link url={column.url} text={column.url} />
                        </Text>
                    </View>
                )
            } else {
                // render text
                return (
                    <View style={{ flex: 1, alignSelf: 'stretch', padding: 5 }} key={index}>
                        <Text numberOfLines={3}>
                            {column.text}
                        </Text>
                    </View>
                )
            }
        })
    }

    renderRow(row, index) {
        return (
            <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', borderBottomColor: '#ddd', borderBottomWidth: 1, paddingTop: 12, paddingBottom: 12 }} key={index}>
                {this.renderColumns(row)}
            </View>
        );
    }

    renderHeaders(row) {
        let columns = [];
        for (const column in row) {
            columns.push({ header: column });
        }

        return columns.map((column, index) => {
            return (
                <View style={{ flex: 1, alignSelf: 'stretch', padding: 5 }} key={index}>
                    <Text numberOfLines={3} style={{ fontWeight: 'bold' }}>
                        {column.header}
                    </Text>
                </View>
            )
        })
    }

    render() {
        const { data } = this.props;

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', borderBottomColor: '#ddd', borderBottomWidth: 1, paddingTop: 12, paddingBottom: 12 }}>
                    {this.renderHeaders(data[0])}
                </View>
                {
                    data.map((datum, index) => {
                        return this.renderRow(datum, index);
                    })
                }
            </View>
        );
    }
}

module.exports = Table;