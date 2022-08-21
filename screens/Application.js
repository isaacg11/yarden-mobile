
import React, { Component } from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CheckBox from '@react-native-community/checkbox';
import moment from 'moment-timezone';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { alert } from '../components/UI/SystemAlert';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Header from '../components/UI/Header';
import { getGeolocation, getCounty, getServiceArea } from '../actions/location/index';
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class Application extends Component {

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
        await this.props.navigation.navigate('Submit', results);

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
            ageVerification,
            citizenshipVerification,
            isLoading
        } = this.state;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <KeyboardAwareScrollView>
                    <View style={{ padding: units.unit3 + units.unit4 }}>

                        {/* loading indicator start */}
                        <LoadingIndicator
                            loading={isLoading}
                        />
                        {/* loading indicator end */}

                        {/* application form start */}
                        <Header type="h4" style={{ marginBottom: units.unit5 }}>Gardener Application</Header>
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
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <CheckBox
                                    value={ageVerification}
                                    onValueChange={() => this.setState({ ageVerification: !ageVerification })}
                                    boxType="square"
                                    tintColor={colors.purpleB}
                                    onTintColor={colors.green0}
                                    onCheckColor={colors.green0}
                                    onFillColor={colors.purpleB}
                                />
                                <Text style={{ marginLeft: units.unit4 }}>I am at least 18 years old or older</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: units.unit4 }}>
                                <CheckBox
                                    value={citizenshipVerification}
                                    onValueChange={() => this.setState({ citizenshipVerification: !citizenshipVerification })}
                                    boxType="square"
                                    tintColor={colors.purpleB}
                                    onTintColor={colors.green0}
                                    onCheckColor={colors.green0}
                                    onFillColor={colors.purpleB}
                                />
                                <Text style={{ marginLeft: units.unit4 }}>I am a U.S citizen</Text>
                            </View>
                            <View style={{ marginTop: units.unit4 }}>
                                <Button
                                    alignIconRight
                                    text="Next"
                                    onPress={() => this.next()}
                                    variant="primary"
                                    disabled={!address || !city || !state || !zipCode || !ageVerification || !citizenshipVerification}
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
                        {/* application form end */}

                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
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

Application = connect(null, mapDispatchToProps)(Application);

export default Application;

module.exports = Application;