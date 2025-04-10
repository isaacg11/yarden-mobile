// libraries
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';

// UI components
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Header from '../components/UI/Header';
import Collapse from '../components/UI/Collapse';
import Materials from '../components/app/Materials';
import Labor from '../components/app/Labor';
import Delivery from '../components/app/Delivery';
import ToolRentals from '../components/app/ToolRentals';
import Disposal from '../components/app/Disposal';
import QuoteSummary from '../components/app/QuoteSummary';
import QuoteInfo from '../components/app/QuoteInfo';
import Button from '../components/UI/Button';
import Link from '../components/UI/Link';

// types
import types from '../vars/types';

// styles
import units from '../components/styles/units';
import fonts from '../components/styles/fonts';

class QuoteDetails extends Component {
  state = {};

  proceedToCheckout() {
    const quote = this.props.route.params;

    // if quote is for installation or revive {...}
    if (quote.type === types.INSTALLATION || quote.type === types.REVIVE) {
      // navigate to garden screen
      this.props.navigation.navigate('Selection Type', quote);
    } else {
      // navigate to checkout screen
      this.props.navigation.navigate('Checkout', quote);
    }
  }

  requestChanges() {
    // navigate to request change page
    this.props.navigation.navigate('Request Quote Change', {
      quote: this.props.route.params,
    });
  }

  render() {
    const quote = this.props.route.params;
    const { isLoading } = this.state;
    
    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
        }}>
        <ScrollView style={{ padding: units.unit4 + units.unit3 }}>
          {/* loading indicator */}
          <LoadingIndicator loading={isLoading} />

          <Header
            type="h4"
            style={{ ...fonts.header, marginBottom: units.unit4 }}>
            Quote Details
          </Header>

          <View>
            {/* quote info */}
            <View>
              <Collapse
                title="Quote Info"
                content={<QuoteInfo quote={quote} />}
              />
            </View>

            {quote.line_items && (
              // quote summary
              <View>
                <Collapse
                  title="Cost Summary"
                  content={<QuoteSummary quote={quote} />}
                />
              </View>
            )}

            {quote.line_items && (
              <View>
                {/* materials */}
                <View
                  style={{
                    display: !quote.line_items.materials ? 'none' : null,
                  }}>
                  <Collapse
                    title="Materials"
                    content={
                      <Materials materials={quote.line_items.materials} />
                    }
                  />
                </View>

                {/* labor */}
                <View
                  style={{
                    display: !quote.line_items.labor ? 'none' : null,
                  }}>
                  <Collapse
                    title="Labor"
                    content={<Labor labor={quote.line_items.labor} />}
                  />
                </View>

                {/* delivery */}
                <View
                  style={{
                    display: !quote.line_items.delivery ? 'none' : null,
                  }}>
                  <Collapse
                    title="Delivery"
                    content={<Delivery delivery={quote.line_items.delivery} />}
                  />
                </View>

                {/* tool rentals */}
                <View
                  style={{
                    display: !quote.line_items.rentals ? 'none' : null,
                  }}>
                  <Collapse
                    title="Tool Rentals"
                    content={<ToolRentals rentals={quote.line_items.rentals} />}
                  />
                </View>

                {/* disposal */}
                <View
                  style={{
                    display: !quote.line_items.disposal ? 'none' : null,
                  }}>
                  <Collapse
                    title="Disposal"
                    content={<Disposal disposal={quote.line_items.disposal} />}
                  />
                </View>
              </View>
            )}

            {/* navigation buttons */}
            {quote.status === 'pending approval' && (
              <View
                style={{
                  marginBottom: units.unit5,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View>
                  <Link
                    text="Request Changes"
                    onPress={() => this.requestChanges()}
                  />
                </View>
                <View style={{ marginBottom: units.unit3 }}>
                  <Button
                    text="Next"
                    onPress={() => this.proceedToCheckout()}
                  />
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

QuoteDetails = connect(mapStateToProps, null)(QuoteDetails);

export default QuoteDetails;

module.exports = QuoteDetails;
