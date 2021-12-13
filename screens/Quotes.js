
import React, { Component } from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropdown from '../components/UI/Dropdown';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Button from '../components/UI/Button';
import Divider from '../components/UI/Divider';
import Paginate from '../components/UI/Paginate';
import { getQuotes } from '../actions/quotes/index';

class Quotes extends Component {

    state = {
        status: 'pending approval',
        page: 1,
        limit: 5
    }

    async setStatus(status) {
        // show loading indicator
        await this.setState({ isLoading: true, status: status });

        // set quote query
        const query = `status=${status}&page=${this.state.page}&limit=${this.state.limit}`;

        // get pending quotes
        await this.props.getQuotes(query);

        // hide loading indicator
        await this.setState({ isLoading: false });
    }

    paginate(direction) {

        // show loading indicator
        this.setState({isLoading: true});

        // set intitial page
        let page = 1;

        // if direction is forward, increase page by 1
        if (direction === 'forward') page = (this.state.page + 1);

        // if direction is back, decrease page by 1
        if (direction === 'back') page = (this.state.page - 1);

        // set new page
        this.setState({ page: page }, async () => {

            // set status
            await this.setStatus(this.state.status);

            // hide loading indicator
            this.setState({isLoading: false});
        });
    }

    render() {

        const {
            status = 'pending approval',
            isLoading,
            page,
            limit
        } = this.state;

        const {
            quotes
        } = this.props

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                {/* loading indicator */}
                <LoadingIndicator
                    loading={isLoading}
                />

                <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25, marginBottom: 25 }}>Quotes {(quotes.list && quotes.list.length > 0) ? `(${quotes.list.length})` : ''}</Text>
                <View style={{ padding: 12 }}>

                    {/* status filter */}
                    <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5, marginBottom: 12 }}>
                        <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Filter</Text>
                        <Dropdown
                            value={status}
                            onChange={(value) => this.setStatus(value)}
                            options={[
                                {
                                    label: 'Quote Requested',
                                    value: 'bid requested',
                                },
                                {
                                    label: 'Pending Approval',
                                    value: 'pending approval',
                                },
                                {
                                    label: 'Approved',
                                    value: 'approved',
                                }
                            ]}
                        />
                    </View>

                    {/* quotes start */}
                    {quotes.list && quotes.list.map((quote, index) => (
                        <View key={index} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5, marginBottom: 12 }}>
                            <View style={{ marginBottom: 12 }}>
                                <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Title</Text>
                                <Text>{quote.title}</Text>
                                <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Description</Text>
                                <Text>{quote.description}</Text>
                            </View>
                            <Divider />
                            <View>
                                <Button
                                    text="View Details"
                                    onPress={() => this.props.navigation.navigate('Quote Details', quote)}
                                    variant="secondary"
                                />
                            </View>
                        </View>
                    ))}

                    {/* pagination */}
                    {(quotes.list && (quotes.total > limit)) && (
                        <View style={{ marginBottom: 12 }}>
                            <Paginate
                                page={page}
                                limit={limit}
                                total={quotes.total}
                                onPaginate={(direction) => this.paginate(direction)}
                            />
                        </View>
                    )}

                    {(quotes.list && quotes.list.length < 1) && (
                        <View style={{ marginBottom: 12 }}>
                            <Text style={{ fontWeight: 'bold', marginTop: 12, textAlign: 'center' }}>No quotes found</Text>
                        </View>
                    )}
                    {/* quotes end */}
                </View>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        quotes: state.quotes
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getQuotes
    }, dispatch)
}

Quotes = connect(mapStateToProps, mapDispatchToProps)(Quotes);

export default Quotes;

module.exports = Quotes;