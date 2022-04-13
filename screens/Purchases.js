
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { SafeAreaView, ScrollView, View } from 'react-native';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Paragraph from '../components/UI/Paragraph';
import Header from '../components/UI/Header';
import Button from '../components/UI/Button';
import Paginate from '../components/UI/Paginate';
import Card from '../components/UI/Card';
import { getPurchases } from '../actions/purchases/index';
import calculateQuote from '../helpers/calculateQuote';
import vars from '../vars/index';
import units from '../components/styles/units';

class Purchase extends Component {

    state = {
        page: 1,
        limit: 5
    }

    componentDidMount() {
        // show loading indicator
        this.setState({ isLoading: true });

        // set purchases
        this.setPurchases();

        // hide loading indicator
        this.setState({ isLoading: false });
    }

    paginate(direction) {

        // show loading indicator
        this.setState({ isLoading: true });

        // set intitial page
        let page = 1;

        // if direction is forward, increase page by 1
        if (direction === 'forward') page = (this.state.page + 1);

        // if direction is back, decrease page by 1
        if (direction === 'back') page = (this.state.page - 1);

        // set new page
        this.setState({ page: page }, async () => {

            // set purchases
            this.setPurchases();

            // hide loading indicator
            this.setState({ isLoading: false });
        });
    }

    setPurchases() {
        // set quote query
        const query = `customer=${this.props.user._id}&page=${this.state.page}&limit=${this.state.limit}`;

        // get customer purchases
        this.props.getPurchases(query);
    }

    render() {

        const {
            purchases
        } = this.props;

        const {
            page,
            limit,
            isLoading
        } = this.state;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <ScrollView>

                    <View style={{ padding: units.unit3 + units.unit4 }}>

                        {/* loading indicator */}
                        <LoadingIndicator
                            loading={isLoading}
                        />

                        <Header type="h4" style={{ marginBottom: units.unit5 }}>Purchases</Header>
                        <View>

                            {/* purchases */}
                            {purchases.list && purchases.list.map((purchase, index) => {
                                const calculatedQuote = calculateQuote(purchase.order.bid.line_items);
                                const total = (calculatedQuote.materialsTotal + calculatedQuote.laborTotal + calculatedQuote.deliveryTotal + calculatedQuote.rentalTotal + calculatedQuote.disposalTotal);
                                const tax = (calculatedQuote.materialsTotal * vars.tax.ca);
                                const processingFee = (total + tax) * vars.fees.payment_processing;
                                const purchaseTotal = total + tax + processingFee;

                                return (
                                    <Card key={index} style={{ marginBottom: units.unit4 }}>
                                        <View style={{ marginBottom: units.unit5 }}>
                                            <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Order Placed</Paragraph>
                                            <Paragraph>{moment(purchase.dt_created).format('MM/DD/YYYY')}</Paragraph>
                                            <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Description</Paragraph>
                                            <Paragraph>{purchase.order.description}</Paragraph>
                                            <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Total</Paragraph>
                                            <Paragraph>${(purchaseTotal).toFixed(2)}</Paragraph>
                                        </View>
                                        <View>
                                            <Button
                                                small
                                                text="View Details"
                                                variant="btn2"
                                                onPress={() => {
                                                    this.props.navigation.navigate('Quote Details', purchase.order.bid)
                                                }}
                                            />
                                        </View>
                                    </Card>
                                )
                            })}

                            {/* pagination */}
                            {(purchases.list && (purchases.total > limit)) && (
                                <View style={{ marginBottom: units.unit5 }}>
                                    <Paginate
                                        page={page}
                                        limit={limit}
                                        total={purchases.total}
                                        onPaginate={(direction) => this.paginate(direction)}
                                    />
                                </View>
                            )}

                            {/* no purchases UI */}
                            {(purchases.list && purchases.list.length < 1) && (
                                <View style={{ marginBottom: units.unit5 }}>
                                    <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5, textAlign: 'center' }}>No purchases found</Paragraph>
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        purchases: state.purchases,
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getPurchases
    }, dispatch)
}


Purchase = connect(mapStateToProps, mapDispatchToProps)(Purchase);

export default Purchase;

module.exports = Purchase;