
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import moment from 'moment';
import Divider from '../../components/UI/Divider';
import calculateQuoteCost from '../../helpers/calculateQuote';
import delimit from '../../helpers/delimit';
import vars from '../../vars/index';

class PaymentSchedule extends Component {

    render() {

        const { quote } = this.props;
        const q = calculateQuoteCost(quote.line_items);

        return (
            <View style={{ padding: 12 }}>
                <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                    <View style={{ marginBottom: 12 }}>
                        <Text>Upon checking out, your card will be charged today ({moment().format('MM/DD/YYYY')}) for the first payment.</Text>
                        <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Payment #1</Text>
                        <Text>
                            {(q.materialsTotal > 0) && `- Materials${"\n"}`}
                            {(q.deliveryTotal > 0) && `- Delivery${"\n"}`}
                            {(q.rentalTotal > 0) && `- Rentals${"\n"}`}
                            {(q.disposalTotal > 0) && `- Disposal${"\n"}`}
                        </Text>
                        <Text style={{marginBottom: 12}}>TOTAL: ${delimit(((q.materialsTotal + q.deliveryTotal + q.rentalTotal + q.disposalTotal) + (q.materialsTotal * vars.tax.ca) + (((q.materialsTotal + q.deliveryTotal + q.rentalTotal + q.disposalTotal) + (q.materialsTotal * vars.tax.ca)) * vars.fees.payment_processing)).toFixed(2))}</Text>
                        <Divider />
                        <Text style={{ marginTop: 12 }}>Once the work is completed, your card will be charged for the second payment.</Text>
                        <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Payment #2</Text>
                        <Text>
                            {(q.laborTotal > 0) && `- Labor${"\n"}`}
                        </Text>
                        <Text>TOTAL: ${delimit((q.laborTotal + (q.laborTotal * vars.fees.payment_processing)).toFixed(2))}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

module.exports = PaymentSchedule;