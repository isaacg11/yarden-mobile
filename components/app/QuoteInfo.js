import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import formatPhoneNumber from '../../helpers/formatPhoneNumber';
import Paragraph from '../../components/UI/Paragraph';
import units from '../styles/units';
import fonts from '../styles/fonts';
import colors from '../styles/colors';
import Status from '../UI/Status';

class QuoteInfo extends Component {
  render() {
    const {quote, user} = this.props;

    return (
      // quote info start
      <View>
        <View style={{marginTop: units.unit5}}>
          <Paragraph
            style={{
              fontSize: fonts.h3,
              textTransform: 'capitalize',
              marginBottom: units.unit2,
              color: colors.purpleD75,
            }}>
            {quote.title}
          </Paragraph>
          <Status status={quote.status} />

          <Text style={{...fonts.label, marginTop: units.unit5}}>
            Description
          </Text>
          <Text>{quote.description}</Text>
          {quote.status !== 'bid requested' && (
            <View>
              <Text style={{...fonts.label, marginTop: units.unit5}}>
                Estimated Start Date
              </Text>
              <Text>
                {moment(quote.estimated_start_dt).format('MM/DD/YYYY')}
              </Text>
            </View>
          )}
          <Paragraph style={{...fonts.label, marginTop: units.unit5}}>
            Customer/Address
          </Paragraph>

          {/* name */}
          <Text style={{textTransform: 'capitalize'}}>
            {user.first_name} {user.last_name}
          </Text>

          {/* address line 1 */}
          <Text style={{textTransform: 'capitalize'}}>{user.address}</Text>

          {/* address line 2 */}

          {user.unit && (
            <Text style={{textTransform: 'capitalize'}}>#{user.unit}</Text>
          )}
          <View style={{display: 'flex', flexDirection: 'row'}}>
            {/* City */}
            <Text style={{textTransform: 'capitalize'}}>{user.city}, </Text>

            {/* State */}
            <Text style={{textTransform: 'uppercase'}}>{user.state} </Text>

            {/* zip */}
            <Text>{user.zip_code}</Text>
          </View>

          <Text style={{...fonts.label, marginTop: units.unit5}}>Email</Text>
          <Text>{user.email}</Text>
          <Text>{formatPhoneNumber(user.phone_number)}</Text>
        </View>
      </View>
      // quote info end
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

QuoteInfo = connect(mapStateToProps, null)(QuoteInfo);

export default QuoteInfo;

module.exports = QuoteInfo;
