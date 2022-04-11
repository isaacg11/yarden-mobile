import React, {Component} from 'react';
import {SafeAreaView, View, ScrollView, Text} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Dropdown from '../components/UI/Dropdown';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Paragraph from '../components/UI/Paragraph';
import Button from '../components/UI/Button';
import Divider from '../components/UI/Divider';
import Paginate from '../components/UI/Paginate';
import Header from '../components/UI/Header';
import {getQuotes} from '../actions/quotes/index';
import {setFilters} from '../actions/filters/index';
import units from '../components/styles/units';
import fonts from '../components/styles/fonts';
import colors from '../components/styles/colors';
import card from '../components/styles/card';

class Quotes extends Component {
  state = {
    status: 'pending approval',
    page: 1,
    limit: 5,
  };

  async setStatus(status) {
    // show loading indicator
    this.setState({
      isLoading: true,
      status: status,
    });

    // set new status
    this.props.setFilters({quotes: status});

    // set quote query
    const query = `status=${status}&page=${this.state.page}&limit=${this.state.limit}`;

    // get pending quotes
    await this.props.getQuotes(query);

    // hide loading indicator
    this.setState({isLoading: false});
  }

  paginate(direction) {
    // show loading indicator
    this.setState({isLoading: true});

    // set intitial page
    let page = 1;

    // if direction is forward, increase page by 1
    if (direction === 'forward') page = this.state.page + 1;

    // if direction is back, decrease page by 1
    if (direction === 'back') page = this.state.page - 1;

    // set new page
    this.setState({page: page}, async () => {
      // set status
      await this.setStatus(this.state.status);

      // hide loading indicator
      this.setState({isLoading: false});
    });
  }

  render() {
    const {status = 'pending approval', isLoading, page, limit} = this.state;

    const {quotes, filters} = this.props;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'space-between',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          paddingTop: units.unit5,
          paddingHorizontal: units.unit4 + units.unit3,
        }}>
        {/* loading indicator */}
        <LoadingIndicator loading={isLoading} />

        <ScrollView style={{overflow: 'visible'}}>
          <Header
            type="h4"
            style={{
              ...fonts.header,
              marginBottom: units.unit5,
            }}>
            Quotes{' '}
            {quotes.list && quotes.list.length > 0 ? `(${quotes.total})` : ''}
          </Header>
          <View>
            {/* status filter */}
            <View>
              <Dropdown
                label="Filter"
                value={filters.quotes}
                onChange={value => this.setStatus(value)}
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
                  },
                ]}
              />
            </View>

            {/* quotes start */}
            {quotes.list &&
              quotes.list.map((quote, index) => (
                <View
                  key={index}
                  style={{
                    ...card,
                    padding: units.unit4,
                    marginTop: units.unit4,
                  }}>
                  <View>
                    <View
                      style={{
                        marginBottom: units.unit4,
                        display: 'flex',
                        justifyContent: 'center',
                      }}>
                      {/* <Paragraph style={{...fonts.label}}>Title</Paragraph> */}
                      <Text
                        style={{
                          fontSize: fonts.h3,
                          fontWeight: 'bold',
                          color: colors.greenE75,
                          textTransform: 'capitalize',
                        }}>
                        {quote.title}
                      </Text>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                        }}>
                        <View
                          style={{
                            backgroundColor: colors.greenC10,
                            paddingHorizontal: units.unit3,
                            borderRadius: units.unit3,
                          }}>
                          <Text
                            style={{
                              ...fonts.small,
                              textTransform: 'capitalize',
                            }}>
                            {quote.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {/* <View> */}
                    {/* <Paragraph style={{...fonts.label}}>
                        Description
                      </Paragraph> */}
                    {/* <Text style={{...fonts.paragraph}}>
                        {quote.description}
                      </Text> */}
                    {/* </View> */}
                  </View>
                  {/* <Divider /> */}
                  <View
                    style={{
                      width: '100%',
                    }}>
                    <Button
                      text="View Details"
                      onPress={() =>
                        this.props.navigation.navigate('Quote Details', quote)
                      }
                      variant="btn2"
                      small
                    />
                  </View>
                </View>
              ))}

            {/* pagination */}
            {quotes.list && quotes.total > limit && (
              <View>
                <Paginate
                  page={page}
                  limit={limit}
                  total={quotes.total}
                  onPaginate={direction => this.paginate(direction)}
                />
              </View>
            )}

            {quotes.list && quotes.list.length < 1 && (
              <View style={{marginBottom: units.unit5}}>
                <Paragraph
                  style={{
                    fontWeight: 'bold',
                    marginTop: units.unit5,
                    textAlign: 'center',
                  }}>
                  No quotes found
                </Paragraph>
              </View>
            )}
            {/* quotes end */}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    quotes: state.quotes,
    filters: state.filters,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getQuotes,
      setFilters,
    },
    dispatch,
  );
}

Quotes = connect(mapStateToProps, mapDispatchToProps)(Quotes);

export default Quotes;

module.exports = Quotes;
