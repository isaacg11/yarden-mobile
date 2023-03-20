// libraries
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// UI components
import Dropdown from '../components/UI/Dropdown';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Paragraph from '../components/UI/Paragraph';
import Divider from '../components/UI/Divider';
import Paginate from '../components/UI/Paginate';
import Header from '../components/UI/Header';
import Status from '../components/UI/Status';
import Link from '../components/UI/Link';

// actions
import { getReminders } from '../actions/reminders/index';
import { setFilters } from '../actions/filters/index';
import { setPagination } from '../actions/pagination/index';

// styles
import units from '../components/styles/units';
import fonts from '../components/styles/fonts';
import colors from '../components/styles/colors';

// helpers
import truncate from '../helpers/truncate';

class Reminders extends Component {
  state = {
    status: 'pending',
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
    this.props.setFilters({ reminders: status });

    // set quote query
    const query = `status=${status}&page=${this.state.page}&limit=${this.state.limit}`;

    // get pending reminders
    await this.props.getReminders(query);

    // hide loading indicator
    this.setState({ isLoading: false });
  }

  paginate(direction) {
    // show loading indicator
    this.setState({ isLoading: true });

    // set intitial page
    let page = 1;

    // if direction is forward, increase page by 1
    if (direction === 'forward') page = this.state.page + 1;

    // if direction is back, decrease page by 1
    if (direction === 'back') page = this.state.page - 1;

    // set pagination
    this.props.setPagination({ reminders: page });

    // set new page
    this.setState({ page: page }, async () => {
      
      // set status
      await this.setStatus(this.state.status);

      // hide loading indicator
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { isLoading, page, limit } = this.state;
    const { reminders, filters } = this.props;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'space-between',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          backgroundColor: colors.greenD5,
        }}>
        {/* loading indicator */}
        <LoadingIndicator loading={isLoading} />

        <ScrollView
          style={{ overflow: 'visible', padding: units.unit4 + units.unit3 }}>
          <Header
            type="h4"
            style={{
              marginBottom: units.unit5,
            }}>
            Reminders{' '}
            {reminders.list && reminders.list.length > 0 ? `(${reminders.total})` : ''}
          </Header>
          <View>
            {/* status filter */}
            <View>
              <Dropdown
                label="Filter"
                value={filters.reminders}
                onChange={value => this.setStatus(value)}
                options={[
                  {
                    label: 'Pending',
                    value: 'pending',
                  },
                  {
                    label: 'Complete',
                    value: 'complete',
                  },
                ]}
              />
            </View>

            {/* reminders start */}
            <View style={{ marginTop: units.unit4 }}>
              {reminders.list &&
                reminders.list.map((reminder, index) => (
                  <View key={index}>
                    <View
                      style={{
                        marginVertical: units.unit4,
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View>
                        <View
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                          }}>
                          <Text
                            style={{
                              fontSize: fonts.h3,
                              fontWeight: 'bold',
                              color: colors.greenE75,
                              textTransform: 'capitalize',
                              marginBottom: units.unit1,
                            }}>
                            {truncate(reminder.title, 15)}
                          </Text>
                          <Status status={reminder.status} />
                        </View>
                      </View>
                      <View
                        style={{
                          display: 'flex',
                          alignItems: 'flex-end',
                          flexDirection: 'row',
                        }}>
                        <Link
                          text="View Details"
                          onPress={() =>
                            this.props.navigation.navigate(
                              'Reminder Details',
                              reminder
                            )
                          }
                          variant="btn2"
                          small
                        />
                      </View>
                    </View>
                    <Divider />
                  </View>
                ))}
            </View>

            {/* pagination */}
            {reminders.list && reminders.total > limit && (
              <View>
                <Paginate
                  page={page}
                  limit={limit}
                  total={reminders.total}
                  onPaginate={direction => this.paginate(direction)}
                />
              </View>
            )}

            {reminders.list && reminders.list.length < 1 && (
              <View style={{ marginBottom: units.unit5 }}>
                <Paragraph
                  style={{
                    fontWeight: 'bold',
                    marginTop: units.unit5,
                    textAlign: 'center',
                  }}>
                  No reminders found
                </Paragraph>
              </View>
            )}
            {/* reminders end */}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    filters: state.filters,
    reminders: state.reminders
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getReminders,
      setFilters,
      setPagination
    },
    dispatch,
  );
}

Reminders = connect(mapStateToProps, mapDispatchToProps)(Reminders);

export default Reminders;

module.exports = Reminders;
