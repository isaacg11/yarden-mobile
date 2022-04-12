import React, {Component} from 'react';
import {View} from 'react-native';
import Divider from '../../components/UI/Divider';
import Paragraph from '../../components/UI/Paragraph';
import Label from '../UI/Label';
import calculateQuoteCost from '../../helpers/calculateQuote';
import delimit from '../../helpers/delimit';
import vars from '../../vars/index';
import units from '../../components/styles/units';
import colors from '../../components/styles/colors';

class QuoteSummary extends Component {
  render() {
    const {quote} = this.props;
    const q = calculateQuoteCost(quote.line_items);

    return (
      <View>
        <View style={{marginTop: units.unit5}}>
          <Paragraph
            style={{color: colors.greenE75, marginBottom: units.unit5}}>
            {quote.description}
          </Paragraph>
        </View>
        <View>
          <Label>Line Items</Label>

          <View
            style={{
              display: quote.line_items.materials ? 'flex' : 'none',
              flex: 1,
              alignSelf: 'stretch',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Paragraph>Materials</Paragraph>
            <Paragraph>${delimit(q.materialsTotal.toFixed(2))}</Paragraph>
          </View>
          <View
            style={{
              display: quote.line_items.labor ? 'flex' : 'none',
              flex: 1,
              alignSelf: 'stretch',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Paragraph>Labor</Paragraph>
            <Paragraph>${delimit(q.laborTotal.toFixed(2))}</Paragraph>
          </View>
          <View
            style={{
              display: quote.line_items.delivery ? 'flex' : 'none',
              flex: 1,
              alignSelf: 'stretch',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Paragraph>Delivery</Paragraph>
            <Paragraph>${delimit(q.deliveryTotal.toFixed(2))}</Paragraph>
          </View>
          <View
            style={{
              display: quote.line_items.rentals ? 'flex' : 'none',
              flex: 1,
              alignSelf: 'stretch',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Paragraph>Tool Rentals</Paragraph>
            <Paragraph>${delimit(q.rentalTotal.toFixed(2))}</Paragraph>
          </View>
          <View
            style={{
              display: quote.line_items.disposal ? 'flex' : 'none',
              flex: 1,
              alignSelf: 'stretch',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Paragraph>Disposal</Paragraph>
            <Paragraph>${delimit(q.disposalTotal.toFixed(2))}</Paragraph>
          </View>
        </View>
        <View style={{marginTop: units.unit5}}>
          <Label>Taxes and Fees</Label>
        </View>
        <View>
          <View
            style={{
              flex: 1,
              alignSelf: 'stretch',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Paragraph>Processing Fee</Paragraph>
            <Paragraph>
              $
              {delimit(
                (
                  (q.materialsTotal +
                    q.laborTotal +
                    q.deliveryTotal +
                    q.rentalTotal +
                    q.disposalTotal +
                    q.materialsTotal * vars.tax.ca) *
                  vars.fees.payment_processing
                ).toFixed(2),
              )}
            </Paragraph>
          </View>
          <View
            style={{
              flex: 1,
              alignSelf: 'stretch',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: units.unit5,
            }}>
            <Paragraph>Taxes</Paragraph>
            <Paragraph>
              ${delimit((q.materialsTotal * vars.tax.ca).toFixed(2))}
            </Paragraph>
          </View>
        </View>
        <View>
          <Divider />
        </View>
        <View
          style={{
            display: quote.line_items.materials ? 'flex' : 'none',
            flex: 1,
            alignSelf: 'stretch',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: units.unit5,
          }}>
          <Paragraph>Quote Total</Paragraph>
          <Paragraph>
            $
            {delimit(
              (
                q.materialsTotal +
                q.materialsTotal * vars.tax.ca +
                (q.laborTotal +
                  q.deliveryTotal +
                  q.rentalTotal +
                  q.disposalTotal) +
                (q.materialsTotal +
                  q.laborTotal +
                  q.deliveryTotal +
                  q.rentalTotal +
                  q.disposalTotal +
                  q.materialsTotal * vars.tax.ca) *
                  vars.fees.payment_processing
              ).toFixed(2),
            )}
          </Paragraph>
        </View>
      </View>
    );
  }
}

module.exports = QuoteSummary;
