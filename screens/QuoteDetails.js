
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
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
import units from '../components/styles/units';

class QuoteDetails extends Component {

    state = {}

    proceedToCheckout() {
        // format quote
        const quote = this.props.route.params;

        // if installation or revive {...}
        if (quote.type === 'installation' || quote.type === 'revive') {

            // if no garden info {...}
            if (!this.props.user.garden_info) {

                // navigate to garden screen
                return this.props.navigation.navigate('Garden', quote);
            }
        }

        // navigate to checkout screen
        this.props.navigation.navigate('Checkout', quote);

    }

    requestChanges() {
        // navigate to request change page
        this.props.navigation.navigate('Request Quote Change', { quote: this.props.route.params });
    }

    render() {

        const quote = this.props.route.params;
        const { isLoading } = this.state;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <ScrollView>

                    {/* loading indicator */}
                    <LoadingIndicator
                        loading={isLoading}
                    />

                    <Header type="h4" style={{ textAlign: 'center', marginTop: units.unit6 }}>Quote Details</Header>
                    <View style={{ padding: units.unit5 }}>

                        {(quote.line_items) && (
                            // quote summary
                            <View style={{ marginTop: units.unit5 }}>
                                <Collapse
                                    title="Quote Summary"
                                    open={true}
                                    content={
                                        <QuoteSummary
                                            quote={quote}
                                        />
                                    }
                                />
                            </View>
                        )}

                        {/* quote info */}
                        <View style={{ marginTop: units.unit5 }}>
                            <Collapse
                                title="Quote Info"
                                open={!quote.line_items}
                                content={
                                    <QuoteInfo
                                        quote={quote}
                                    />
                                }
                            />
                        </View>

                        {(quote.line_items) && (
                            <View>
                                {/* materials */}
                                <View style={{ marginTop: units.unit5, display: (!quote.line_items.materials) ? 'none' : null }}>
                                    <Collapse
                                        title="Materials"
                                        content={
                                            <Materials
                                                materials={quote.line_items.materials}
                                            />
                                        }
                                    />
                                </View>

                                {/* labor */}
                                <View style={{ marginTop: units.unit5, display: (!quote.line_items.labor) ? 'none' : null }}>
                                    <Collapse
                                        title="Labor"
                                        content={
                                            <Labor
                                                labor={quote.line_items.labor}
                                            />
                                        }
                                    />
                                </View>

                                {/* delivery */}
                                <View style={{ marginTop: units.unit5, display: (!quote.line_items.delivery) ? 'none' : null }}>
                                    <Collapse
                                        title="Delivery"
                                        content={
                                            <Delivery
                                                delivery={quote.line_items.delivery}
                                            />
                                        }
                                    />
                                </View>

                                {/* tool rentals */}
                                <View style={{ marginTop: units.unit5, display: (!quote.line_items.rentals) ? 'none' : null }}>
                                    <Collapse
                                        title="Tool Rentals"
                                        content={
                                            <ToolRentals
                                                rentals={quote.line_items.rentals}
                                            />
                                        }
                                    />
                                </View>

                                {/* disposal */}
                                <View style={{ marginTop: units.unit5, display: (!quote.line_items.disposal) ? 'none' : null }}>
                                    <Collapse
                                        title="Disposal"
                                        content={
                                            <Disposal
                                                disposal={quote.line_items.disposal}
                                            />
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* navigation buttons */}
                        {(quote.status === 'pending approval') && (
                            <View>
                                <View>
                                    <Button
                                        text="Proceed to checkout"
                                        onPress={() => this.proceedToCheckout()}
                                        variant="primary"
                                    />
                                </View>
                                <View>
                                    <Button
                                        text="Request Changes"
                                        onPress={() => this.requestChanges()}
                                        variant="secondary"
                                    />
                                </View>
                            </View>
                        )}

                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}


QuoteDetails = connect(mapStateToProps, null)(QuoteDetails);

export default QuoteDetails;

module.exports = QuoteDetails;