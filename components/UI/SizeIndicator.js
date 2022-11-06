import React, { Component } from 'react';
import { View } from 'react-native';
import colors from '../styles/colors';

class SizeIndicator extends Component {

    getInfo(sqrt) {
        let rows = [];
        for (let i = 0; i < sqrt; i++) {
            let columns = [];
            for (let j = 0; j < sqrt; j++) {
                columns.push(1)
            }
            rows.push(columns);
        }

        return rows;
    }

    render() {

        const { size } = this.props;
        const sqrt = Math.sqrt(size);
        const rows = this.getInfo(sqrt);
        const indicatorStyles = {
            height: 3,
            width: 3,
            backgroundColor: colors.greenD25,
            marginRight: 2,
            marginTop: 2,
        }

        return (
            <View>
                {rows.map((row, i) => {
                    return (
                        <View key={i} style={{display: "flex", flexDirection: "row"}}>
                            {row.map((column, index) => (
                                <View key={index} style={indicatorStyles}></View>
                            ))}
                        </View>
                    )
                })}
            </View>
        );
    }
}

module.exports = SizeIndicator;
