
import React, { Component } from 'react';
import { View, SafeAreaView, Image, Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
import { createApplication } from '../actions/applications/index';
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class Submit extends Component {

    state = {}

    async finish() {
        // render loading indicator
        await this.setState({ isLoading: true });

        // get route params
        const info = this.props.route.params;

        // format new application data
        const newApplication = {
            role: 'gardener',
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
            profile_image: info.profileImage
        }

        // if unit, set unit details
        if (info.unit) newUser.user.unit = info.unit.trim();

        // create application
        await this.props.createApplication(newApplication);

        // set address
        const address = `${info.address.trim()}${((info.unit) ? (' #' + info.unit.trim()) : '')}, ${info.city.trim()} ${info.state} ${info.zipCode.toString()}`;

        // format message
        const applicationConfirmation = {
            email: info.email.trim(),
            subject: 'Yarden - Application received!',
            label: 'Submission Confirmation',
            body: (
                '<p>Hello <b>' + info.firstName.trim() + '</b>,</p>' + 
                '<p>Thanks for applying, we will contact you within 5 business days for a preliminary phone interview!</p>' + 
                '<table style="margin: 0 auto;" width="600px" cellspacing="0" cellpadding="0" border="0">' +
                    '<tr>' +
                        '<td style="padding-top: 10px;">' +
                            '<h2>Application Summary</h2>' +
                            '<table style="margin: 0 auto;" width="600px" cellspacing="0" cellpadding="0" border="0">' + 
                                '<tr>' +
                                    '<td>' +
                                        '<p style="margin-bottom: 0px">Applied For</p>' +
                                    '</td>' +
                                    '<td>' +
                                        '<p style="margin-bottom: 0px"><em>Gardener</em></p>' +
                                    '</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td>' +
                                        '<p style="margin-bottom: 0px">Name</p>' +
                                    '</td>' +
                                    '<td>' +
                                        '<p style="margin-bottom: 0px"><em>' + info.firstName.trim() + ' ' + info.lastName.trim() + '</em></p>' +
                                    '</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td>' +
                                        '<p style="margin-bottom: 0px">Email</p>' +
                                    '</td>' +
                                    '<td>' +
                                        '<p style="margin-bottom: 0px"><em>' + info.email.trim() + '</em></p>' +
                                    '</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td>' +
                                        '<p style="margin-bottom: 0px">Phone Number</p>' +
                                    '</td>' +
                                    '<td>' +
                                        '<p style="margin-bottom: 0px"><em>' + info.phoneNumber.replace(/\D/g, '') + '</em></p>' +
                                    '</td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td>' +
                                        '<p style="margin-bottom: 0px">Address</p>' +
                                    '</td>' +
                                    '<td>' +
                                        '<p style="margin-bottom: 0px"><em>' + address + '</em></p>' +
                                    '</td>' +
                                '</tr>' +
                            '</table>' +
                        '</td>' +
                    '</tr>' +
                '</table>' 
            )
        }

        // send applicant confirmation email
        await this.props.sendEmail(applicationConfirmation);

        // navigate to account pending screen
        await this.props.navigation.navigate('Account Pending');

        // hide loading indicator
        this.setState({ isLoading: false });
    }

    render() {

        const {
            isLoading
        } = this.state;

        const {
            firstName,
            lastName,
            address,
            unit,
            city,
            state,
            zipCode,
            phoneNumber,
            email,
            profileImage
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
                    <Header type="h4" style={{ marginBottom: units.unit5 }}>Review & Submit</Header>
                    <View>
                        <Card>
                            <View style={{display: 'flex', alignSelf: 'center'}}>
                                <Image
                                    style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: 100,
                                        borderWidth: 5,
                                        borderColor: colors.purpleB
                                    }}
                                    source={{ uri: profileImage }}
                                    alt="profile"
                                />
                            </View>
                            <View style={{ marginTop: units.unit5 }}>
                                <Text>Please review your information and make sure everything is correct before submitting your gardener application</Text>
                            </View>
                            <View style={{ marginTop: units.unit5 }}>
                                <Paragraph style={{ fontWeight: 'bold' }}>Name</Paragraph>
                                <Paragraph>{`${firstName} ${lastName}`}</Paragraph>
                            </View>
                            <View style={{ marginTop: units.unit5 }}>
                                <Paragraph style={{ fontWeight: 'bold' }}>Address</Paragraph>
                                <Paragraph>{`${address}${(unit) ? ` ${unit} ` : ''}, ${city} ${state} ${zipCode}`}</Paragraph>
                            </View>
                            <View style={{ marginTop: units.unit5 }}>
                                <Paragraph style={{ fontWeight: 'bold' }}>Contact Information</Paragraph>
                                <Paragraph>{`${phoneNumber}`}</Paragraph>
                                <Paragraph>{`${email}`}</Paragraph>
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
        sendAlert,
        createApplication
    }, dispatch)
}

Submit = connect(mapStateToProps, mapDispatchToProps)(Submit);

export default Submit;

module.exports = Submit;