
import React, { Component } from 'react';
import { View } from 'react-native';
import moment from 'moment';
import Divider from '../../components/UI/Divider';
import Paragraph from '../../components/UI/Paragraph';
import calculateQuoteCost from '../../helpers/calculateQuote';
import delimit from '../../helpers/delimit';
import vars from '../../vars/index';
import units from '../../components/styles/units';

class PaymentSchedule extends Component {

    state = {}

    componentDidMount() {

        // if multiple quotes {...}
        if (this.props.quotes) {
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
        } else { // if single quote {...}
            const { quote } = this.props;
            const q = calculateQuoteCost(quote.line_items);
            this.setState({
                materialsTotal: q.materialsTotal,
                laborTotal: q.laborTotal,
                rentalTotal: q.rentalTotal,
                deliveryTotal: q.deliveryTotal,
                disposalTotal: q.disposalTotal
            })
        }
    }

    render() {

        const {
            materialsTotal,
            laborTotal,
            rentalTotal,
            deliveryTotal,
            disposalTotal
        } = this.state;

        return (
            <View style={{ padding: units.unit5 }}>
                <View>
                    <View style={{ marginBottom: units.unit5 }}>
                        <Paragraph>Upon checking out, your card will be charged today ({moment().format('MM/DD/YYYY')}) for the first payment.</Paragraph>
                        <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Payment #1</Paragraph>
                        <Paragraph>
                            {(materialsTotal > 0) && `- Materials${"\n"}`}
                            {(deliveryTotal > 0) && `- Delivery${"\n"}`}
                            {(rentalTotal > 0) && `- Rentals${"\n"}`}
                            {(disposalTotal > 0) && `- Disposal${"\n"}`}
                        </Paragraph>
                        <Paragraph style={{ marginBottom: units.unit5 }}>TOTAL: ${delimit(((materialsTotal + deliveryTotal + rentalTotal + disposalTotal) + (materialsTotal * vars.tax.ca) + (((materialsTotal + deliveryTotal + rentalTotal + disposalTotal) + (materialsTotal * vars.tax.ca)) * vars.fees.payment_processing)).toFixed(2))}</Paragraph>
                        <Divider />
                        <Paragraph style={{ marginTop: units.unit5 }}>Once the work is completed, your card will be charged for the second payment.</Paragraph>
                        <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Payment #2</Paragraph>
                        <Paragraph>
                            {(laborTotal > 0) && `- Labor${"\n"}`}
                        </Paragraph>
                        <Paragraph>TOTAL: ${delimit((laborTotal + (laborTotal * vars.fees.payment_processing)).toFixed(2))}</Paragraph>
                    </View>
                </View>
            </View>
        )
    }
}

module.exports = PaymentSchedule;