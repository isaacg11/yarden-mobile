
import React, { Component } from 'react';
import { Text, SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Collapse from '../components/UI/Collapse';
import Materials from '../components/app/Materials';
import Labor from '../components/app/Labor';
import Delivery from '../components/app/Delivery';
import ToolRentals from '../components/app/ToolRentals';
import Disposal from '../components/app/Disposal';
import QuoteSummary from '../components/app/QuoteSummary';
import QuoteInfo from '../components/app/QuoteInfo';
import Button from '../components/UI/Button';

class QuoteDetails extends Component {

    state = {}

    proceedToCheckout() {
        // format quote
        const quote = this.props.route.params;

        // if installation or revive {...}
        if(quote.type === 'installation' || quote.type === 'revive') {

            // if no garden info {...}
            if(!this.props.user.garden_info) {

                // navigate to garden screen
                return this.props.navigation.navigate('Garden', quote);
            }
        }

        // navigate to checkout screen
        this.props.navigation.navigate('Checkout', quote);

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

                    <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25, marginBottom: 12 }}>Quote Details</Text>
                    <View style={{ padding: 12 }}>

                        {/* quote summary */}
                        <View style={{ marginTop: 12 }}>
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

                        {/* quote info */}
                        <View style={{ marginTop: 12 }}>
                            <Collapse
                                title="Quote Info"
                                content={
                                    <QuoteInfo
                                        quote={quote}
                                    />
                                }
                            />
                        </View>

                        {/* materials */}
                        <View style={{ marginTop: 12, display: (!quote.line_items.materials) ? 'none' : null }}>
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
                        <View style={{ marginTop: 12, display: (!quote.line_items.labor) ? 'none' : null }}>
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
                        <View style={{ marginTop: 12, display: (!quote.line_items.delivery) ? 'none' : null }}>
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
                        <View style={{ marginTop: 12, display: (!quote.line_items.rentals) ? 'none' : null }}>
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
                        <View style={{ marginTop: 12, display: (!quote.line_items.disposal) ? 'none' : null }}>
                            <Collapse
                                title="Disposal"
                                content={
                                    <Disposal
                                        disposal={quote.line_items.disposal}
                                    />
                                }
                            />
                        </View>

                        {/* approval buttons */}
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
                                        onPress={() => this.cancel()}
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