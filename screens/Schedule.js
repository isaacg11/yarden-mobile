
import React, { Component } from 'react';
import { View, SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import moment from 'moment-timezone';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Dropdown from '../components/UI/Dropdown';
import DateSelect from '../components/UI/DateSelect';
import { alert } from '../components/UI/SystemAlert';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Header from '../components/UI/Header';
import { getGeolocation, getCounty, getServiceArea } from '../actions/location/index';
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class Schedule extends Component {

    state = {
        address: '',
        unit: '',
        city: '',
        state: 'ca',
        zipCode: '',
        time: ''
    }

    async next() {
        // render loading indicator
        await this.setState({ isLoading: true });

        // get geolocation 
        const geo = await this.props.getGeolocation(`address=${this.state.address.trim()}&city=${this.state.city.trim()}&state=${this.state.state}`);

        // if error, render error message
        if (geo.data.error) return this.throwWarning('Invalid address, please try again');

        // format geolocation
        const geolocation = {
            lat: geo.data[0].lat,
            lon: geo.data[0].lon,
            boundingbox: geo.data[0].boundingbox
        };

        // get county 
        const cty = await this.props.getCounty(`address=${this.state.address.trim()}&city=${this.state.city.trim()}&state=${this.state.state}`);
        if (!JSON.parse(cty.data).County) return this.throwWarning('Invalid address, please try again');
        const county = JSON.parse(cty.data).County;

        // get service area
        const serviceArea = await this.props.getServiceArea(`name=${county}`);
        if (serviceArea.data.length < 1) return this.throwWarning('Out of service area');

        // combine results from previous and current routes
        const results = {
            ...this.props.route.params,
            ...this.state,
            ...{ geolocation: geolocation },
            ...{ county: county },
            ...{ date: moment(this.state.date).format('MM/DD/YYYY') }
        }

        // navigate to next screen
        await this.props.navigation.navigate('Confirm', results);

        // hide loading indicator
        this.setState({ isLoading: false });
    }

    throwWarning(message) {

        // render warning message
        alert(message);

        // hide loading indicator
        this.setState({ isLoading: false });
    }

    render() {

        const {
            address,
            unit,
            city,
            state,
            zipCode,
            date,
            time = '09',
            isLoading
        } = this.state;

        const minDate = moment().add(3, 'days');

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={{
                    flex: 1,
                    width: "100%",
                }}>
                    <View style={{ padding: units.unit3 + units.unit4 }}>

                        {/* loading indicator start */}
                        <LoadingIndicator
                            loading={isLoading}
                        />
                        {/* loading indicator end */}

                        {/* schedule form start */}
                        <Header type="h4" style={{ marginBottom: units.unit5 }}>Schedule Appointment</Header>
                        <View>
                            <View>
                                <Input
                                    label="Street Address"
                                    onChange={(value) => this.setState({ address: value })}
                                    value={address}
                                    placeholder="Street Address"
                                />
                            </View>
                            <View>
                                <Input
                                    label="Unit (Optional)"
                                    onChange={(value) => this.setState({ unit: value })}
                                    value={unit}
                                    placeholder="Unit (Optional)"
                                />
                            </View>
                            <View>
                                <Input
                                    label="City"
                                    onChange={(value) => this.setState({ city: value })}
                                    value={city}
                                    placeholder="City"
                                />
                            </View>
                            <View>
                                <Input
                                    label="Zip Code"
                                    type="numeric"
                                    onChange={(value) => this.setState({ zipCode: value })}
                                    value={zipCode}
                                    placeholder="Zip Code"
                                />
                            </View>
                            <View style={{ marginBottom: units.unit4 }}>
                                <DateSelect
                                    mode="date"
                                    value={date}
                                    date={new Date()}
                                    placeholder="Appointment Date"
                                    minDate={new Date(minDate)}
                                    onConfirm={(value) => {
                                        this.setState({
                                            date: value
                                        });
                                    }}
                                    appearance="dropdown"
                                />
                            </View>
                            <View>
                                <Dropdown
                                    label="Time"
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
                            <View style={{ marginTop: units.unit4 }}>
                                <Button
                                    alignIconRight
                                    text="Next"
                                    onPress={() => this.next()}
                                    variant="primary"
                                    disabled={!address || !city || !state || !zipCode || !date || !time}
                                    icon={(
                                        <Ionicons
                                            name="arrow-forward-outline"
                                            size={units.unit4}
                                            color={colors.purpleB}
                                        />
                                    )}
                                />
                            </View>
                        </View>
                        {/* schedule form end */}

                    </View>

                </SafeAreaView>
            </TouchableWithoutFeedback>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getGeolocation,
        getCounty,
        getServiceArea
    }, dispatch)
}

Schedule = connect(null, mapDispatchToProps)(Schedule);

export default Schedule;

module.exports = Schedule;