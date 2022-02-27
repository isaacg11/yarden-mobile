
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import moment from 'moment';
import Divider from '../../components/UI/Divider';
import calculateQuoteCost from '../../helpers/calculateQuote';
import delimit from '../../helpers/delimit';
import vars from '../../vars/index';

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
            <View style={{ padding: 12 }}>
                <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                    <View style={{ marginBottom: 12 }}>
                        <Text>Upon checking out, your card will be charged today ({moment().format('MM/DD/YYYY')}) for the first payment.</Text>
                        <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Payment #1</Text>
                        <Text>
                            {(materialsTotal > 0) && `- Materials${"\n"}`}
                            {(deliveryTotal > 0) && `- Delivery${"\n"}`}
                            {(rentalTotal > 0) && `- Rentals${"\n"}`}
                            {(disposalTotal > 0) && `- Disposal${"\n"}`}
                        </Text>
                        <Text style={{ marginBottom: 12 }}>TOTAL: ${delimit(((materialsTotal + deliveryTotal + rentalTotal + disposalTotal) + (materialsTotal * vars.tax.ca) + (((materialsTotal + deliveryTotal + rentalTotal + disposalTotal) + (materialsTotal * vars.tax.ca)) * vars.fees.payment_processing)).toFixed(2))}</Text>
                        <Divider />
                        <Text style={{ marginTop: 12 }}>Once the work is completed, your card will be charged for the second payment.</Text>
                        <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Payment #2</Text>
                        <Text>
                            {(laborTotal > 0) && `- Labor${"\n"}`}
                        </Text>
                        <Text>TOTAL: ${delimit((laborTotal + (laborTotal * vars.fees.payment_processing)).toFixed(2))}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

module.exports = PaymentSchedule;