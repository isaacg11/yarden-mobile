
import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RNQRGenerator from 'rn-qr-generator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../components/UI/Button';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Paragraph from '../components/UI/Paragraph';
import Header from '../components/UI/Header';
import Card from '../components/UI/Card';
import { createUser, updateUser } from '../actions/user/index';
import { createOrder } from '../actions/orders/index';
import { sendEmail } from '../actions/emails/index';
import { sendAlert } from '../actions/alerts/index';
import { APP_URL } from '../helpers/getUrl';
import vars from '../vars/index';
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class Confirm extends Component {

    state = {}

    async finish() {
        // render loading indicator
        await this.setState({ isLoading: true });

        // get route params
        const info = this.props.route.params;

        // format new user data
        let newUser = {
            user: {
                type: 'customer',
                first_name: info.firstName.trim(),
                last_name: info.lastName.trim(),
                email: info.email.trim(),
                phone_number: info.phoneNumber.replace(/\D/g, ''),
                address: info.address.trim(),
                city: info.city.trim(),
                state: info.state,
                zip_code: info.zipCode.toString(),
                county: info.county.trim(),
                geolocation: info.geolocation,
                garden_info: {}
            },
            password: info.password
        }

        // if unit, set unit details
        if (info.unit) newUser.user.unit = info.unit.trim();

        // create new user
        await this.props.createUser(newUser);

        // if session {...}
        if (this.props.user) {

            // create QR code for customer referrals
            const qrCode = await RNQRGenerator.generate({
                value: `${APP_URL}/referral?refId=${this.props.user._id}`,
                height: 100,
                width: 100,
                base64: true
            })

            // update user with referral QR code
            await this.props.updateUser(null, { qrCode: `data:image/png;base64,${qrCode.base64}` });

            // format new order
            const newOrder = {
                customer: this.props.user._id,
                type: 'yard assessment',
                date: new Date(info.date),
                time: info.time,
                description: vars.orderDescriptions.vendor.yardAssessment
            }

            // create new order
            await this.props.createOrder(newOrder);

            // format address
            const address = `${info.address.trim()}${((info.unit) ? (' #' + info.unit.trim()) : '')}, ${info.city.trim()} ${info.state} ${info.zipCode}`;

            // format email
            const orderConfirmation = {
                email: info.email.trim(),
                subject: `Welcome to Yarden!`,
                label: 'Appointment Confirmation',
                body: (
                    '<p>Hello <b>' + info.firstName.trim() + '</b>,</p>' +
                    '<p>Your appointment has been confirmed, log in to your Yarden app to view the details.</p>' +
                    '<table style="margin: 0 auto;" width="600px" cellspacing="0" cellpadding="0" border="0">' +
                    '<tr>' +
                    '<td>' +
                    '<p style="margin-bottom: 0px"><b>Date</b></p>' +
                    '</td>' +
                    '<td>' +
                    '<p style="margin-bottom: 0px"><em>' + info.date + '</em></p>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' +
                    '<p style="margin-bottom: 0px"><b>Time</b></p>' +
                    '</td>' +
                    '<td>' +
                    '<p style="margin-bottom: 0px"><em>' + moment(info.time, `HH:mm:ss`).format(`h:mm A`) + '</em></p>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' +
                    '<p style="margin-bottom: 0px"><b>Type</b></p>' +
                    '</td>' +
                    '<td>' +
                    '<p style="margin-bottom: 0px"><em>yard assessment</em></p>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' +
                    '<p style="margin-bottom: 0px"><b>Full Name</b></p>' +
                    '</td>' +
                    '<td>' +
                    '<p style="margin-bottom: 0px"><em>' + info.firstName.trim() + ' ' + info.lastName.trim() + '</em></p>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' +
                    '<p style="margin-bottom: 0px"><b>Email</b></p>' +
                    '</td>' +
                    '<td>' +
                    '<p style="margin-bottom: 0px"><em>' + info.email.trim() + '</em></p>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' +
                    '<p style="margin-bottom: 0px"><b>Phone Number</b></p>' +
                    '</td>' +
                    '<td>' +
                    '<p style="margin-bottom: 0px"><em>' + info.phoneNumber + '</em></p>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' +
                    '<p style="margin-bottom: 0px"><b>Address</b></p>' +
                    '</td>' +
                    '<td>' +
                    '<p style="margin-bottom: 0px"><em>' + address + '</em></p>' +
                    '</td>' +
                    '</tr>' +
                    '</table>'
                )
            }

            // send customer confirmation email
            await this.props.sendEmail(orderConfirmation);

            // send alert to HQ
            await this.props.sendAlert({
                channel: 'leads',
                text: `*New Lead!* \n${info.firstName.trim()} ${info.lastName.trim()}\n${address}\n${info.date} @ ${moment(info.time, `HH:mm:ss`).format(`h:mm A`)}`
            })

            // navigate to next screen
            await this.props.navigation.navigate('Welcome');
        }

        // hide loading indicator
        this.setState({ isLoading: false });
    }

    render() {

        const {
            isLoading
        } = this.state;

        const {
            date,
            time,
            firstName,
            lastName,
            address,
            unit,
            city,
            state,
            zipCode,
            phoneNumber,
            email
        } = this.props.route.params;

        return (
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

                    {/* confirmation start */}
                    <Header type="h4" style={{ marginBottom: units.unit5 }}>Confirm Appointment</Header>
                    <View>
                        <Card>
                            <View>
                                <Paragraph style={{ fontWeight: 'bold' }}>Date</Paragraph>
                                <Paragraph>{date}</Paragraph>
                            </View>
                            <View style={{ marginTop: units.unit5 }}>
                                <Paragraph style={{ fontWeight: 'bold' }}>Time</Paragraph>
                                <Paragraph>{moment(time, `HH:mm:ss`).format(`h:mm A`)}</Paragraph>
                            </View>
                            <View style={{ marginTop: units.unit5 }}>
                                <Paragraph style={{ fontWeight: 'bold' }}>Name</Paragraph>
                                <Paragraph>{`${firstName} ${lastName}`}</Paragraph>
                            </View>
                            <View style={{ marginTop: units.unit5 }}>
                                <Paragraph style={{ fontWeight: 'bold' }}>Location</Paragraph>
                                <Paragraph>{`${address}${(unit) ? ` ${unit} ` : ''}, ${city} ${state} ${zipCode}`}</Paragraph>
                            </View>
                            <View style={{ marginTop: units.unit5 }}>
                                <Paragraph style={{ fontWeight: 'bold' }}>Contact Information</Paragraph>
                                <Paragraph>{`${phoneNumber}`}</Paragraph>
                                <Paragraph>{`${email}`}</Paragraph>
                            </View>
                            <View style={{ marginTop: units.unit5 }}>
                                <Paragraph style={{ fontWeight: 'bold' }}>Price</Paragraph>
                                <Paragraph>FREE</Paragraph>
                            </View>
                        </Card>
                        <View style={{ marginTop: units.unit4 }}>
                            <Button
                                text="Finish"
                                onPress={() => this.finish()}
                                icon={(
                                    <Ionicons
                                        name="checkmark"
                                        size={units.unit4}
                                        color={colors.purpleB}
                                    />
                                )}
                            />
                        </View>
                    </View>
                    {/* confirmation end */}

                </View>

            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        createUser,
        updateUser,
        createOrder,
        sendEmail,
        sendAlert
    }, dispatch)
}

Confirm = connect(mapStateToProps, mapDispatchToProps)(Confirm);

export default Confirm;

module.exports = Confirm;