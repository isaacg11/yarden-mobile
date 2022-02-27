import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import formatPhoneNumber from '../../helpers/formatPhoneNumber';

class QuoteInfo extends Component {

    render() {

        const { 
            quote,
            user
        } = this.props;

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
                        {user.first_name} {user.last_name}{"\n"}
                        {user.address}{(user.unit) ? ` #${user.unit}` : ''}, {user.city} {user.state} {user.zip_code}{"\n"}
                        {user.email}{"\n"}
                        {formatPhoneNumber(user.phone_number)}
                    </Text>
                </View>
            </View>
            // quote info end
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}


QuoteInfo = connect(mapStateToProps, null)(QuoteInfo);

export default QuoteInfo;

module.exports = QuoteInfo;