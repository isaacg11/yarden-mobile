import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Divider from '../../components/UI/Divider';
import calculateQuoteCost from '../../helpers/calculateQuote';
import delimit from '../../helpers/delimit';
import vars from '../../vars/index';

class QuoteSummary extends Component {

    render() {

        const { quote } = this.props;
        const q = calculateQuoteCost(quote.line_items);
        
        return (
            <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                <View style={{ display: (quote.line_items.materials) ? 'flex' : 'none', flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text>Materials</Text>
                    <Text>${delimit(q.materialsTotal.toFixed(2))}</Text>
                </View>
                <View style={{ display: (!quote.line_items.labor && !quote.line_items.delivery && !quote.line_items.rentals && !quote.line_items.disposal) ? 'none' : 'flex', flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text>
                        {(q.laborTotal > 0) && 'Labor'}
                        {(q.deliveryTotal > 0) && ', Delivery'}
                        {(q.rentalTotal > 0) && ', Tool Rentals'}
                        {(q.disposalTotal > 0) && ', Disposal'}
                    </Text>
                    <Text>${delimit((q.laborTotal + q.deliveryTotal + q.rentalTotal + q.disposalTotal).toFixed(2))}</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text>Processing Fee</Text>
                    <Text>${delimit((((q.materialsTotal + q.laborTotal + q.deliveryTotal + q.rentalTotal + q.disposalTotal) + (q.materialsTotal * vars.tax.ca)) * vars.fees.payment_processing).toFixed(2))}</Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <Text>Taxes</Text>
                    <Text>${delimit(((q.materialsTotal) * vars.tax.ca).toFixed(2))}</Text>
                </View>
                <Divider />
                <View style={{ display: (quote.line_items.materials) ? 'flex' : 'none', flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12}}>
                    <Text>Quote Total</Text>
                    <Text>${delimit(((q.materialsTotal + (q.materialsTotal * vars.tax.ca) + (q.laborTotal + q.deliveryTotal + q.rentalTotal + q.disposalTotal)) + ((((q.materialsTotal + q.laborTotal + q.deliveryTotal + q.rentalTotal + q.disposalTotal) + (q.materialsTotal * vars.tax.ca)) * vars.fees.payment_processing))).toFixed(2))}</Text>
                </View>
            </View>
        )
    }
}

module.exports = QuoteSummary;