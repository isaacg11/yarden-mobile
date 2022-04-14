import React, {Component} from 'react';
import {View, Text} from 'react-native';
import moment from 'moment';
import Divider from '../../components/UI/Divider';
import Paragraph from '../../components/UI/Paragraph';
import calculateQuoteCost from '../../helpers/calculateQuote';
import delimit from '../../helpers/delimit';
import vars from '../../vars/index';
import units from '../../components/styles/units';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import Label from '../UI/Label';
import Card from '../UI/Card';

class PaymentSchedule extends Component {
  state = {};

  componentDidMount() {
    // if multiple quotes {...}
    if (this.props.quotes) {
      let materialsTotal = 0;
      let laborTotal = 0;
      let rentalTotal = 0;
      let deliveryTotal = 0;
      let disposalTotal = 0;

      this.props.quotes.forEach(quote => {
        const q = calculateQuoteCost(quote.line_items);
        materialsTotal += q.materialsTotal;
        laborTotal += q.laborTotal;
        rentalTotal += q.rentalTotal;
        deliveryTotal += q.deliveryTotal;
        disposalTotal += q.disposalTotal;
      });

      this.setState({
        materialsTotal,
        laborTotal,
        rentalTotal,
        deliveryTotal,
        disposalTotal,
      });
    } else {
      // if single quote {...}
      const {quote} = this.props;
      const q = calculateQuoteCost(quote.line_items);
      this.setState({
        materialsTotal: q.materialsTotal,
        laborTotal: q.laborTotal,
        rentalTotal: q.rentalTotal,
        deliveryTotal: q.deliveryTotal,
        disposalTotal: q.disposalTotal,
      });
    }
  }

  render() {
    const {
      materialsTotal,
      laborTotal,
      rentalTotal,
      deliveryTotal,
      disposalTotal,
    } = this.state;

    return (
      <View>
        <View>
          <Card>
            <Label>Payment #1 (Due at checkout)</Label>
            <Text style={{color: colors.greenD75, lineHeight: fonts.h3}}>
              Upon checking out, your card will be charged{' '}
              <Text style={{fontWeight: 'bold'}}>
                today ({moment().format('MM/DD/YYYY')})
              </Text>{' '}
              for the first payment.
            </Text>
            <Paragraph>
              {materialsTotal > 0 && `- Materials${'\n'}`}
              {deliveryTotal > 0 && `- Delivery${'\n'}`}
              {rentalTotal > 0 && `- Rentals${'\n'}`}
              {disposalTotal > 0 && `- Disposal${'\n'}`}
            </Paragraph>
            <Divider style={{marginVertical: units.unit3}} />
            <View
              style={{
                marginBottom: units.unit5,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text>TOTAL:</Text>
              <Text>
                $
                {delimit(
                  (
                    materialsTotal +
                    deliveryTotal +
                    rentalTotal +
                    disposalTotal +
                    materialsTotal * vars.tax.ca +
                    (materialsTotal +
                      deliveryTotal +
                      rentalTotal +
                      disposalTotal +
                      materialsTotal * vars.tax.ca) *
                      vars.fees.payment_processing
                  ).toFixed(2),
                )}
              </Text>
            </View>
            <Paragraph style={{marginTop: units.unit5}}>
              Once the work is completed, your card will be charged for the
              second payment.
            </Paragraph>
            <Paragraph style={{fontWeight: 'bold', marginTop: units.unit5}}>
              Payment #2
            </Paragraph>
            <Paragraph>{laborTotal > 0 && `- Labor${'\n'}`}</Paragraph>
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: '100%',
              }}>
              <Text>TOTAL:</Text>
              <Text>
                $
                {delimit(
                  (
                    laborTotal +
                    laborTotal * vars.fees.payment_processing
                  ).toFixed(2),
                )}
              </Text>
            </View>
          </Card>
        </View>
      </View>
    );
  }
}

module.exports = PaymentSchedule;
