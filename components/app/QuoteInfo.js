import React, { Component } from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';
import formatPhoneNumber from '../../helpers/formatPhoneNumber';

class QuoteInfo extends Component {

    render() {

        const { quote } = this.props;

        return (
            // quote info start
            <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontWeight: 'bold' }}>Title</Text>
                    <Text>{quote.title}</Text>
                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Description</Text>
                    <Text>{quote.description}</Text>
                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Status</Text>
                    <Text>{quote.status}</Text>
                    {(quote.status !== 'bid requested') && (
                        <View>
                            <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Estimated Start Date</Text>
                            <Text>{moment(quote.estimated_start_dt).format('MM/DD/YYYY')}</Text>
                        </View>
                    )}
                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Customer</Text>
                    <Text>
                        {quote.customer.first_name} {quote.customer.last_name}{"\n"}
                        {quote.customer.address}{(quote.customer.unit) ? ` #${quote.customer.unit}` : ''}, {quote.customer.city} {quote.customer.state} {quote.customer.zip_code}{"\n"}
                        {quote.customer.email}{"\n"}
                        {formatPhoneNumber(quote.customer.phone_number)}
                    </Text>
                </View>
            </View>
            // quote info end
        )
    }
}

module.exports = QuoteInfo;