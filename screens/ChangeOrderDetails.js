
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import Button from '../components/UI/Button';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Collapse from '../components/UI/Collapse';
import Header from '../components/UI/Header';
import ChangeOrderInfo from '../components/app/ChangeOrderInfo';
import QuoteSummary from '../components/app/QuoteSummary';
import Materials from '../components/app/Materials';
import Labor from '../components/app/Labor';
import Delivery from '../components/app/Delivery';
import ToolRentals from '../components/app/ToolRentals';
import Disposal from '../components/app/Disposal';
import units from '../components/styles/units';

class ChangeOrderDetails extends Component {

    state = {}

    proceedToCheckout() {

        // add isChangeOrder flag so that checkout can process correctly
        const dataWithChangeOrder = {
            ...this.props.route.params,
            ...{ isChangeOrder: true }
        }

        // navigate to checkout
        this.props.navigation.navigate('Checkout', dataWithChangeOrder)
    }

    render() {

        const changeOrder = this.props.route.params;
        const { isLoading } = this.state;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <ScrollView>
                    <View style={{ padding: units.unit3 + units.unit4 }}>
                        {/* loading indicator start */}
                        <LoadingIndicator
                            loading={isLoading}
                        />

                        <Header type="h4" style={{marginBottom: units.unit4}}>Change Order</Header>
                        <View>

                            {(changeOrder.line_items) && (
                                // change order summary
                                <View>
                                    <Collapse
                                        title="Change Order Summary"
                                        open={true}
                                        content={
                                            <QuoteSummary
                                                quote={changeOrder}
                                            />
                                        }
                                    />
                                </View>
                            )}

                            {/* change order info */}
                            <View>
                                <Collapse
                                    title="Change Order Info"
                                    content={
                                        <ChangeOrderInfo
                                            changeOrder={changeOrder}
                                        />
                                    }
                                />
                            </View>

                            {(changeOrder.line_items) && (
                                <View>
                                    {/* materials */}
                                    <View style={{ display: (!changeOrder.line_items.materials) ? 'none' : null }}>
                                        <Collapse
                                            title="Materials"
                                            content={
                                                <Materials
                                                    materials={changeOrder.line_items.materials}
                                                />
                                            }
                                        />
                                    </View>

                                    {/* labor */}
                                    <View style={{ display: (!changeOrder.line_items.labor) ? 'none' : null }}>
                                        <Collapse
                                            title="Labor"
                                            content={
                                                <Labor
                                                    labor={changeOrder.line_items.labor}
                                                />
                                            }
                                        />
                                    </View>

                                    {/* delivery */}
                                    <View style={{ display: (!changeOrder.line_items.delivery) ? 'none' : null }}>
                                        <Collapse
                                            title="Delivery"
                                            content={
                                                <Delivery
                                                    delivery={changeOrder.line_items.delivery}
                                                />
                                            }
                                        />
                                    </View>

                                    {/* tool rentals */}
                                    <View style={{ display: (!changeOrder.line_items.rentals) ? 'none' : null }}>
                                        <Collapse
                                            title="Tool Rentals"
                                            content={
                                                <ToolRentals
                                                    rentals={changeOrder.line_items.rentals}
                                                />
                                            }
                                        />
                                    </View>

                                    {/* disposal */}
                                    <View style={{ display: (!changeOrder.line_items.disposal) ? 'none' : null }}>
                                        <Collapse
                                            title="Disposal"
                                            content={
                                                <Disposal
                                                    disposal={changeOrder.line_items.disposal}
                                                />
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* navigation buttons */}
                            {(changeOrder.status === 'pending approval') && (
                                <View>
                                    <View>
                                        <Button
                                            text="Proceed to checkout"
                                            onPress={() => this.proceedToCheckout()}
                                            variant="primary"
                                        />
                                    </View>
                                </View>
                            )}

                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

module.exports = ChangeOrderDetails;