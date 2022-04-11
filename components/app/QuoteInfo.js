import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import formatPhoneNumber from '../../helpers/formatPhoneNumber';
import Paragraph from '../../components/UI/Paragraph';
import Card from '../../components/UI/Card';
import units from '../../components/styles/units';

class QuoteInfo extends Component {

    render() {

        const { 
            quote,
            user
        } = this.props;

        return (
            // quote info start
            <Card>
                <View style={{ marginBottom: units.unit5 }}>
                    <Paragraph style={{ fontWeight: 'bold' }}>Title</Paragraph>
                    <Paragraph>{quote.title}</Paragraph>
                    <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Description</Paragraph>
                    <Paragraph>{quote.description}</Paragraph>
                    <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Status</Paragraph>
                    <Paragraph>{quote.status}</Paragraph>
                    {(quote.status !== 'bid requested') && (
                        <View>
                            <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Estimated Start Date</Paragraph>
                            <Paragraph>{moment(quote.estimated_start_dt).format('MM/DD/YYYY')}</Paragraph>
                        </View>
                    )}
                    <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Customer</Paragraph>
                    <Paragraph>
                        {user.first_name} {user.last_name}{"\n"}
                        {user.address}{(user.unit) ? ` #${user.unit}` : ''}, {user.city} {user.state} {user.zip_code}{"\n"}
                        {user.email}{"\n"}
                        {formatPhoneNumber(user.phone_number)}
                    </Paragraph>
                </View>
            </Card>
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