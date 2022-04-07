
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropdown from '../components/UI/Dropdown';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Paragraph from '../components/UI/Paragraph';
import Button from '../components/UI/Button';
import Divider from '../components/UI/Divider';
import Paginate from '../components/UI/Paginate';
import Header from '../components/UI/Header';
import { getQuotes } from '../actions/quotes/index';
import { setFilters } from '../actions/filters/index';
import units from '../components/styles/units';

class Quotes extends Component {

    state = {
        status: 'pending approval',
        page: 1,
        limit: 5
    }

    async setStatus(status) {

        // show loading indicator
        this.setState({
            isLoading: true,
            status: status
        });

        // set new status
        this.props.setFilters({ quotes: status });

        // set quote query
        const query = `status=${status}&page=${this.state.page}&limit=${this.state.limit}`;

        // get pending quotes
        await this.props.getQuotes(query);

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

            // set status
            await this.setStatus(this.state.status);

            // hide loading indicator
            this.setState({ isLoading: false });
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
            quotes,
            filters
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

                <ScrollView>
                    <Header type="h4" style={{ textAlign: 'center', marginTop: units.unit6 }}>
                        Quotes {(quotes.list && quotes.list.length > 0) ? `(${quotes.total})` : ''}
                    </Header>
                    <View style={{ padding: units.unit5 }}>

                        {/* status filter */}
                        <View style={{ backgroundColor: '#fff', padding: units.unit5, borderRadius: 5, marginBottom: units.unit5 }}>
                            <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Filter</Paragraph>
                            <Dropdown
                                value={filters.quotes}
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
                            <View key={index} style={{ backgroundColor: '#fff', padding: units.unit5, borderRadius: 5, marginBottom: units.unit5 }}>
                                <View style={{ marginBottom: units.unit5 }}>
                                    <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Title</Paragraph>
                                    <Paragraph>{quote.title}</Paragraph>
                                    <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Description</Paragraph>
                                    <Paragraph>{quote.description}</Paragraph>
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
                            <View style={{ marginBottom: units.unit5 }}>
                                <Paginate
                                    page={page}
                                    limit={limit}
                                    total={quotes.total}
                                    onPaginate={(direction) => this.paginate(direction)}
                                />
                            </View>
                        )}

                        {(quotes.list && quotes.list.length < 1) && (
                            <View style={{ marginBottom: units.unit5 }}>
                                <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5, textAlign: 'center' }}>No quotes found</Paragraph>
                            </View>
                        )}
                        {/* quotes end */}
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        quotes: state.quotes,
        filters: state.filters
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getQuotes,
        setFilters
    }, dispatch)
}

Quotes = connect(mapStateToProps, mapDispatchToProps)(Quotes);

export default Quotes;

module.exports = Quotes;