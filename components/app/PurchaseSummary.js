import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import Divider from '../../components/UI/Divider';
import calculateQuoteCost from '../../helpers/calculateQuote';
import delimit from '../../helpers/delimit';
import vars from '../../vars/index';

class PurchaseSummary extends Component {

    state = {}

    componentDidMount() {
        let materialsTotal = 0;
        let laborTotal = 0;
        let rentalTotal = 0;
        let deliveryTotal = 0;
        let disposalTotal = 0;

        this.props.quotes.forEach((quote) => {
            const q = calculateQuoteCost(quote.line_items);
            materialsTotal += q.materialsTotal;
            laborTotal += q.laborTotal;
            rentalTotal += q.rentalTotal;
            deliveryTotal += q.deliveryTotal;
            disposalTotal += q.disposalTotal;
        })

        this.setState({
            materialsTotal,
            laborTotal,
            rentalTotal,
            deliveryTotal,
            disposalTotal
        })
    }

    render() {
        const { quotes } = this.props;

        const {
            materialsTotal,
            laborTotal,
            rentalTotal,
            deliveryTotal,
            disposalTotal
        } = this.state;

        return (
            <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                {quotes.map((quote, index) => {
                    const q = calculateQuoteCost(quote.line_items);
                    
                    return (
                        <View key={index}>
                            <View style={{ marginBottom: 12, marginTop: 12 }}>
                                <Text style={{ fontWeight: 'bold', color: '#737373' }}>{quote.description}</Text>
                            </View>
                            <View style={{ paddingLeft: 12 }}>
                                <View style={{ display: (quote.line_items.materials) ? 'flex' : 'none', flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text>Materials</Text>
                                    <Text>${delimit(q.materialsTotal.toFixed(2))}</Text>
                                </View>
                                <View style={{ display: (quote.line_items.labor) ? 'flex' : 'none', flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text>Labor</Text>
                                    <Text>${delimit(q.laborTotal.toFixed(2))}</Text>
                                </View>
                                <View style={{ display: (quote.line_items.delivery) ? 'flex' : 'none', flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text>Delivery</Text>
                                    <Text>${delimit(q.deliveryTotal.toFixed(2))}</Text>
                                </View>
                                <View style={{ display: (quote.line_items.rentals) ? 'flex' : 'none', flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text>Tool Rentals</Text>
                                    <Text>${delimit(q.rentalTotal.toFixed(2))}</Text>
                                </View>
                                <View style={{ display: (quote.line_items.disposal) ? 'flex' : 'none', flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text>Disposal</Text>
                                    <Text>${delimit(q.disposalTotal.toFixed(2))}</Text>
                                </View>
                            </View>
                        </View>
                    )
                })}
                <View style={{ marginBottom: 12, marginTop: 12 }}>
                    <Text style={{ fontWeight: 'bold', color: '#737373' }}>Taxes and Fees</Text>
                </View>
                <View style={{ paddingLeft: 12 }}>
                    <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>Processing Fee</Text>
                        <Text>${delimit((((materialsTotal + laborTotal + deliveryTotal + rentalTotal + disposalTotal) + (materialsTotal * vars.tax.ca)) * vars.fees.payment_processing).toFixed(2))}</Text>
                    </View>
                    <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Text>Taxes</Text>
                        <Text>${delimit(((materialsTotal) * vars.tax.ca).toFixed(2))}</Text>
                    </View>
                </View>
                <View>
                    <Divider />
                </View>
                <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                    <Text>TOTAL</Text>
                    <Text>${delimit(((materialsTotal + (materialsTotal * vars.tax.ca) + (laborTotal + deliveryTotal + rentalTotal + disposalTotal)) + ((((materialsTotal + laborTotal + deliveryTotal + rentalTotal + disposalTotal) + (materialsTotal * vars.tax.ca)) * vars.fees.payment_processing))).toFixed(2))}</Text>
                </View>
            </View>
        )

    }
}

function mapStateToProps(state) {
    return {
        items: state.items
    }
}


PurchaseSummary = connect(mapStateToProps, null)(PurchaseSummary);

export default PurchaseSummary;

module.exports = PurchaseSummary;