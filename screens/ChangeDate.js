
import React, { Component } from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import Dropdown from '../components/UI/Dropdown';
import DateSelect from '../components/UI/DateSelect';
import Button from '../components/UI/Button';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import { alert } from '../components/UI/SystemAlert';
import { updateOrder, getOrders } from '../actions/orders/index';

class ChangeDate extends Component {

    state = {}

    async save() {
        // render loading indicator
        await this.setState({ isLoading: true });

        // format new date
        const newDate = {
            date: this.state.date,
            time: this.state.time
        };

        // update order with new date
        await this.props.updateOrder(this.props.route.params.orderId, newDate);

        // get pending orders
        await this.props.getOrders(`status=pending&start=none&end=${new Date(moment().add(1, 'year'))}`);

        // hide loading indicator
        await this.setState({ isLoading: false });

        // render success alert
        alert('Your order date has been changed', 'Success!', () => this.props.navigation.navigate('Orders'));
    }

    throwWarning(message) {

        // render warning message
        alert(message);

        // hide loading indicator
        this.setState({ isLoading: false });
    }

    render() {

        const {
            date,
            time,
            isLoading
        } = this.state;

        const minDate = moment().add(3, 'days');

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                {/* loading indicator start */}
                <LoadingIndicator 
                    loading={isLoading}
                />
                {/* loading indicator end */}

                {/* change date form start */}
                <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25 }}>Change Date</Text>
                <View style={{ padding: 12 }}>
                    <View>
                        <DateSelect
                            mode="date"
                            value={date}
                            date={new Date()}
                            placeholder="Appointment Date"
                            minDate={new Date(minDate)}
                            onConfirm={(value) => {
                                this.setState({
                                    date: moment(value).format('MM/DD/YYYY')
                                });
                            }}
                        />
                    </View>
                    <View>
                        <Dropdown
                            onChange={(value) => this.setState({ time: value })}
                            options={[
                                {
                                    label: '9:00 AM',
                                    value: '09'
                                },
                                {
                                    label: '10:00 AM',
                                    value: '10'
                                },
                                {
                                    label: '11:00 AM',
                                    value: '11'
                                },
                                {
                                    label: '12:00 PM',
                                    value: '12'
                                },
                                {
                                    label: '1:00 PM',
                                    value: '13'
                                },
                                {
                                    label: '2:00 PM',
                                    value: '14'
                                },
                                {
                                    label: '3:00 PM',
                                    value: '15'
                                },
                                {
                                    label: '4:00 PM',
                                    value: '16'
                                },
                                {
                                    label: '5:00 PM',
                                    value: '17'
                                },
                            ]}
                            placeholder="Time"
                        />
                    </View>
                    <View>
                        <Button
                            text="Save Changes"
                            onPress={() => this.save()}
                            variant="primary"
                            disabled={!date || !time}
                        />
                    </View>
                </View>
                {/* change date form end */}

            </SafeAreaView>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateOrder,
        getOrders
    }, dispatch)
}

ChangeDate = connect(null, mapDispatchToProps)(ChangeDate);

export default ChangeDate;

module.exports = ChangeDate;