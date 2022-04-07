import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Divider from '../../components/UI/Divider';
import Paragraph from '../../components/UI/Paragraph';
import calculateQuoteCost from '../../helpers/calculateQuote';
import delimit from '../../helpers/delimit';
import vars from '../../vars/index';
import units from '../../components/styles/units';

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
            <View style={{ backgroundColor: '#fff', padding: units.unit5, borderRadius: 5 }}>
                {quotes.map((quote, index) => {
                    const q = calculateQuoteCost(quote.line_items);
                    
                    return (
                        <View key={index}>
                            <View style={{ marginBottom: units.unit5, marginTop: units.unit5 }}>
                                <Paragraph style={{ fontWeight: 'bold', color: '#737373' }}>{quote.description}</Paragraph>
                            </View>
                            <View style={{ paddingLeft: units.unit5 }}>
                                <View style={{ display: (quote.line_items.materials) ? 'flex' : 'none', flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Paragraph>Materials</Paragraph>
                                    <Paragraph>${delimit(q.materialsTotal.toFixed(2))}</Paragraph>
                                </View>
                                <View style={{ display: (quote.line_items.labor) ? 'flex' : 'none', flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Paragraph>Labor</Paragraph>
                                    <Paragraph>${delimit(q.laborTotal.toFixed(2))}</Paragraph>
                                </View>
                                <View style={{ display: (quote.line_items.delivery) ? 'flex' : 'none', flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Paragraph>Delivery</Paragraph>
                                    <Paragraph>${delimit(q.deliveryTotal.toFixed(2))}</Paragraph>
                                </View>
                                <View style={{ display: (quote.line_items.rentals) ? 'flex' : 'none', flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Paragraph>Tool Rentals</Paragraph>
                                    <Paragraph>${delimit(q.rentalTotal.toFixed(2))}</Paragraph>
                                </View>
                                <View style={{ display: (quote.line_items.disposal) ? 'flex' : 'none', flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Paragraph>Disposal</Paragraph>
                                    <Paragraph>${delimit(q.disposalTotal.toFixed(2))}</Paragraph>
                                </View>
                            </View>
                        </View>
                    )
                })}
                <View style={{ marginBottom: units.unit5, marginTop: units.unit5 }}>
                    <Paragraph style={{ fontWeight: 'bold', color: '#737373' }}>Taxes and Fees</Paragraph>
                </View>
                <View style={{ paddingLeft: units.unit5 }}>
                    <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Paragraph>Processing Fee</Paragraph>
                        <Paragraph>${delimit((((materialsTotal + laborTotal + deliveryTotal + rentalTotal + disposalTotal) + (materialsTotal * vars.tax.ca)) * vars.fees.payment_processing).toFixed(2))}</Paragraph>
                    </View>
                    <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: units.unit5 }}>
                        <Paragraph>Taxes</Paragraph>
                        <Paragraph>${delimit(((materialsTotal) * vars.tax.ca).toFixed(2))}</Paragraph>
                    </View>
                </View>
                <View>
                    <Divider />
                </View>
                <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: units.unit5 }}>
                    <Paragraph>TOTAL</Paragraph>
                    <Paragraph>${delimit(((materialsTotal + (materialsTotal * vars.tax.ca) + (laborTotal + deliveryTotal + rentalTotal + disposalTotal)) + ((((materialsTotal + laborTotal + deliveryTotal + rentalTotal + disposalTotal) + (materialsTotal * vars.tax.ca)) * vars.fees.payment_processing))).toFixed(2))}</Paragraph>
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