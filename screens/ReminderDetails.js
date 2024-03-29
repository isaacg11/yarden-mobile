// libraries
import React, {Component} from 'react';
import {SafeAreaView, View, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import {alert} from '../components/UI/SystemAlert';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Header from '../components/UI/Header';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import ReminderInfo from '../components/app/ReminderInfo';

// actions
import {getOrders, updateOrder} from '../actions/orders/index';
import {getChangeOrders} from '../actions/changeOrders/index';
import {getBeds} from '../actions/beds/index';
import {getDrafts} from '../actions/drafts/index';
import {getReports} from '../actions/reports/index';
import {getReportType} from '../actions/reportTypes/index';
import {getQuestions} from '../actions/questions/index';
import {getAnswers} from '../actions/answers/index';
import {getReminders, updateReminder} from '../actions/reminders/index';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class ReminderDetails extends Component {
  state = {
    isLoading: false,
  };

  async setStatus(id, status) {
    const {filters, pagination} = this.props;

    // show loading indicator
    this.setState({isLoading: true});

    // update reminder as complete
    await this.props.updateReminder(id, {status});

    // set order query
    const query = `status=${filters.reminders}&page=${
      pagination.reminders
    }&limit=${5}`;

    // get reminders
    await this.props.getReminders(query);

    // hide loading indicator
    this.setState({isLoading: false});

    // redirect user to reminders screen
    this.props.navigation.navigate('Reminders');
  }

  cancel(id) {
    alert(
      'Once this action is taken, it cannot be undone',
      'Are you sure?',
      async () => {
        this.setStatus(id, 'cancelled');
      },
      true,
    );
  }

  render() {
    const {isLoading} = this.state;
    const reminder = this.props.route.params;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
        }}>
        <ScrollView>
          <View style={{padding: units.unit3 + units.unit4}}>
            {/* loading indicator () */}
            <LoadingIndicator loading={isLoading} />

            {/* header */}
            <Header type="h4" style={{marginBottom: units.unit5}}>
              Reminder Details
            </Header>

            <View>
              {/* reminder info */}
              <Card>
                <ReminderInfo reminder={reminder} />
              </Card>

              {/* buttons */}
              {reminder.status === 'pending' && (
                <View style={{marginTop: units.unit4}}>
                  <Button
                    text="Mark Complete"
                    icon={
                      <Ionicons
                        name="checkmark-outline"
                        size={units.unit4}
                        color={colors.purpleB}
                      />
                    }
                    onPress={() => this.setStatus(reminder._id, 'complete')}
                  />
                  <Button
                    variant="btn2"
                    text="Delete"
                    style={{
                      marginTop: units.unit4,
                    }}
                    onPress={() => this.cancel(reminder._id)}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    beds: state.beds,
    questions: state.questions,
    reports: state.reports,
    filters: state.filters,
    pagination: state.pagination,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOrders,
      updateOrder,
      getChangeOrders,
      getBeds,
      getDrafts,
      getReportType,
      getQuestions,
      getReports,
      getAnswers,
      updateReminder,
      getReminders,
    },
    dispatch,
  );
}

ReminderDetails = connect(mapStateToProps, mapDispatchToProps)(ReminderDetails);

export default ReminderDetails;

module.exports = ReminderDetails;
