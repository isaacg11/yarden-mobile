
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Paragraph from '../components/UI/Paragraph';
import Collapse from '../components/UI/Collapse';
import Materials from '../components/app/Materials';
import Labor from '../components/app/Labor';
import Delivery from '../components/app/Delivery';
import PurchaseSummary from '../components/app/PurchaseSummary';
import Button from '../components/UI/Button';
import combineMaterials from '../helpers/combineMaterials';
import formatMaterials from '../helpers/formatMaterials';
import vars from '../vars';

class PurchaseDetails extends Component {

    state = {
        purchase: {
            line_items: {
                materials: []
            }
        }
    }

    async componentDidMount() {

        // show loading indicator
        this.setState({ isLoading: true });

        // set initial purchase materials
        let quoteMaterials = [];

        // set initial purchase labor
        let laborQty = 0;

        // set initial quote description
        let quoteDescription = '';

        let delivery = false;

        const quotes = JSON.parse(this.props.route.params.quotes);

        // iterate through quotes
        quotes.forEach(async (purchase, index) => {

            // add purchase line items
            quoteMaterials.push(purchase.line_items.materials);

            // add purchase labor
            laborQty += purchase.line_items.labor.qty;

            // if delivery fee is found, only add one to entire purchase
            if(purchase.line_items.delivery) {
                delivery = purchase.line_items.delivery;
            }

            // add to purchase decscription
            const semiColon = (index === quotes.length - 1) ? '' : '; '
            quoteDescription += `${purchase.description}${semiColon}`;

            // if last iteration of loop
            if (index === (quotes.length - 1)) {

                // combine all purchase materials
                const combinedMaterials = await combineMaterials(quoteMaterials);

                // set formatted materials
                const formattedMaterials = await formatMaterials(combinedMaterials);

                // update UI
                this.setState({
                    purchase: {
                        title: 'Product Purchase',
                        description: quoteDescription,
                        line_items: {
                            materials: formattedMaterials,
                            labor: {
                                name: vars.labor.description,
                                price: vars.labor.rate,
                                qty: parseFloat(laborQty.toFixed(2))
                            },
                            delivery: delivery
                        }
                    },
                    isLoading: false
                })
            }
        })
    }

    continue() {

        // check to see if there are any garden products
        const isGarden = this.props.items.find((item) => item.product.type.name === 'garden');

        // set quotes
        const quotes = JSON.parse(this.props.route.params.quotes);

        // set params
        const params = {
            ...this.state.purchase,
            ...{ quotes },
            ...{ isPurchase: true }
        }

        // set route
        const route = (isGarden) ? 'Plants' : 'Checkout';

        // navigate to checkout
        this.props.navigation.navigate(route, params);
    }

    render() {

        const {
            isLoading,
            purchase
        } = this.state;

        const {
            quotes
        } = this.props.route.params;

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

                    <Paragraph style={{ fontSize: 25, textAlign: 'center', marginTop: 25, marginBottom: 12 }}>Purchase Details</Paragraph>
                    <View style={{ padding: 12 }}>

                        {/* purchase summary */}
                        <View style={{ marginTop: 12 }}>
                            <Collapse
                                title="Purchase Summary"
                                open={true}
                                content={
                                    <PurchaseSummary
                                        quotes={JSON.parse(quotes)}
                                    />
                                }
                            />
                        </View>

                        {/* materials */}
                        <View style={{ marginTop: 12, display: (purchase.line_items.materials.length < 1) ? 'none' : null }}>
                            <Collapse
                                title="Materials"
                                content={
                                    <Materials
                                        materials={purchase.line_items.materials}
                                    />
                                }
                            />
                        </View>

                        {/* labor */}
                        <View style={{ marginTop: 12, display: (!purchase.line_items.labor) ? 'none' : null }}>
                            <Collapse
                                title="Labor"
                                content={
                                    <Labor
                                        labor={purchase.line_items.labor}
                                    />
                                }
                            />
                        </View>

                        {/* delivery */}
                        <View style={{ marginTop: 12, display: (!purchase.line_items.delivery) ? 'none' : null }}>
                            <Collapse
                                title="Delivery"
                                content={
                                    <Delivery
                                        delivery={purchase.line_items.delivery}
                                    />
                                }
                            />
                        </View>

                        {/* navigation buttons */}
                        <View>
                            <View>
                                <Button
                                    text="Continue"
                                    onPress={() => this.continue()}
                                    variant="primary"
                                />
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        items: state.items
    }
}


PurchaseDetails = connect(mapStateToProps, null)(PurchaseDetails);

export default PurchaseDetails;

module.exports = PurchaseDetails;