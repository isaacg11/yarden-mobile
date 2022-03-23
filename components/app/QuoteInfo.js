import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import formatPhoneNumber from '../../helpers/formatPhoneNumber';
import Paragraph from '../../components/UI/Paragraph';

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
                    <Paragraph style={{ fontWeight: 'bold' }}>Title</Paragraph>
                    <Paragraph>{quote.title}</Paragraph>
                    <Paragraph style={{ fontWeight: 'bold', marginTop: 12 }}>Description</Paragraph>
                    <Paragraph>{quote.description}</Paragraph>
                    <Paragraph style={{ fontWeight: 'bold', marginTop: 12 }}>Status</Paragraph>
                    <Paragraph>{quote.status}</Paragraph>
                    {(quote.status !== 'bid requested') && (
                        <View>
                            <Paragraph style={{ fontWeight: 'bold', marginTop: 12 }}>Estimated Start Date</Paragraph>
                            <Paragraph>{moment(quote.estimated_start_dt).format('MM/DD/YYYY')}</Paragraph>
                        </View>
                    )}
                    <Paragraph style={{ fontWeight: 'bold', marginTop: 12 }}>Customer</Paragraph>
                    <Paragraph>
                        {user.first_name} {user.last_name}{"\n"}
                        {user.address}{(user.unit) ? ` #${user.unit}` : ''}, {user.city} {user.state} {user.zip_code}{"\n"}
                        {user.email}{"\n"}
                        {formatPhoneNumber(user.phone_number)}
                    </Paragraph>
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