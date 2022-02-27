
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { Text, SafeAreaView, ScrollView, View } from 'react-native';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Button from '../components/UI/Button';
import Paginate from '../components/UI/Paginate';
import Divider from '../components/UI/Divider';
import { getPurchases } from '../actions/purchases/index';
import calculateQuote from '../helpers/calculateQuote';
import vars from '../vars/index';

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
                {/* loading indicator */}
                <LoadingIndicator
                    loading={isLoading}
                />

                <ScrollView>
                    <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25, marginBottom: 25 }}>Purchases</Text>
                    <View style={{ padding: 12 }}>

                        {/* purchases */}
                        {purchases.list && purchases.list.map((purchase, index) => {
                            const calculatedQuote = calculateQuote(purchase.order.bid.line_items);
                            const total = (calculatedQuote.materialsTotal + calculatedQuote.laborTotal + calculatedQuote.deliveryTotal + calculatedQuote.rentalTotal + calculatedQuote.disposalTotal);
                            const tax = (calculatedQuote.materialsTotal * vars.tax.ca);
                            const processingFee = (total + tax) * vars.fees.payment_processing;
                            const purchaseTotal = total + tax + processingFee;

                            return (
                                <View key={index} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5, marginBottom: 12 }}>
                                <View style={{ marginBottom: 12 }}>
                                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Order Placed</Text>
                                    <Text>{moment(purchase.dt_created).format('MM/DD/YYYY')}</Text>
                                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Description</Text>
                                    <Text>{purchase.order.description}</Text>
                                    <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Total</Text>
                                    <Text>${(purchaseTotal).toFixed(2)}</Text>
                                </View>
                                <Divider />
                                <View>
                                    <Button
                                        text="View Details"
                                        onPress={() => {
                                            this.props.navigation.navigate('Quote Details', purchase.order.bid)
                                        }}
                                        variant="secondary"
                                    />
                                </View>
                            </View>
                            )
                        })}

                        {/* pagination */}
                        {(purchases.list && (purchases.total > limit)) && (
                            <View style={{ marginBottom: 12 }}>
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
                            <View style={{ marginBottom: 12 }}>
                                <Text style={{ fontWeight: 'bold', marginTop: 12, textAlign: 'center' }}>No purchases found</Text>
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