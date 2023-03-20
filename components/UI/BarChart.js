// libraries
import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// UI components
import Label from '../UI/Label';

// helpers
import calculateHighestValue from '../../helpers/calculateHighestValue';
import calculatePercentage from '../../helpers/calculatePercentage';

// colors
import colors from '../styles/colors';
import units from '../styles/units';

class BarChart extends Component {

    state = {}

    getBarStyles(bar) {
        const data = this.props.data;
        const windowWidth = Dimensions.get('window').width;
        const width = (windowWidth / data.length);

        let styles = {
            width: width - units.unit3,
            height: '100%'
        }

        // calculate width
        if (data.length === 2) {
            styles.width = width - (units.unit4 + units.unit3);
        } else if (data.length === 4) {
            styles.width = width - (units.unit4);
        } else if (data.length === 12) {
            styles.width = width - (units.unit2 + units.unit1);
        } else if (data.length === 24) {
            styles.width = width - units.unit2;
        } else if (data.length === 56) {
            styles.width = width - units.unit0 - 0.5;
        }

        // calculate height
        const highestValue = calculateHighestValue(this.props.data, 'value');
        styles.height =  (bar.value > 0) ? `${calculatePercentage(highestValue, bar.value)}%` : 0;

        return styles;
    }

    render() {
        const { data, showValues } = this.props;
        const chartContainerStyles = {
            display: 'flex',
            flexDirection: 'row',
            height: units.unit7 + units.unit5,
            justifyContent: 'space-between',
            alignItems: 'flex-end'
        }

        return (

            // chart
            <View style={chartContainerStyles}>

                {/* bars */}
                {data.map((d, index) => {
                    const barStyles = this.getBarStyles(d);
                    return (
                        <View key={index} >
                            {/* label */}
                            {showValues && (
                                <Label style={{textAlign: 'center'}}>{d.value}</Label>
                            )}

                            {/* bar */}
                            <LinearGradient 
                                colors={[colors.green075, colors.green025]} 
                                style={barStyles}>
                            </LinearGradient>
                        </View>
                    )
                })}
            </View>
        );
    }
}

module.exports = BarChart;
