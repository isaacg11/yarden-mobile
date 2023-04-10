// libraries
import React, { Component } from 'react';
import { KeyboardAvoidingView, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Header from '../components/UI/Header';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { alert } from '../components/UI/SystemAlert';

// actions
import { sendEmail } from '../actions/emails/index';

// config
import config from '../config';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';

class NewBeds extends Component {

    state = {
        note: ''
    }

    async submit() {
        // format email
        const newBedsRequest = {
            email: config.email,
            subject: `Yarden - (ACTION REQUIRED) New garden bed request`,
            label: 'Garden Bed Request',
            body: (
                '<p>Hello <b>Yarden HQ</b>,</p>' +
                '<p style="margin-bottom: 15px;">A new garden bed request has been submitted by <u>' + this.props.user.email + '</u>, please prepare the quote accordingly.</p>' +
                '<p><b>Request Description</b></p>' +
                '<p>' + '"' + this.state.note + '"' + '</p>'
            )
        }

        // send email
        await this.props.sendEmail(newBedsRequest);

        // show confirmation
        alert(
            'Your request for new garden beds has been submitted, you will receive your quote in 3 - 5 business days.',
            'Success!',
            () => this.props.navigation.navigate('Dashboard'),
        );
    }

    render() {
        const {
            note
        } = this.state;

        return (
            <KeyboardAvoidingView
                behavior="padding"
                style={{
                    flex: 1,
                    width: "100%",
                    backgroundColor: colors.greenE10,
                }}>
                <View style={{ padding: units.unit3 + units.unit4 }}>
                    <View>

                        {/* header */}
                        <Header type="h5" style={{ marginBottom: units.unit3 }}>New Garden Beds</Header>

                        {/* helper text */}
                        <Text>Fill out the form below to request a quote for new garden beds. Make sure to include the desired quantity, width, length, and height of each bed.</Text>

                        {/* note input */}
                        <View style={{ marginTop: units.unit4 }}>
                            <Input
                                multiline
                                numberOfLines={5}
                                value={note}
                                onChange={(value) => this.setState({ note: value })}
                                placeholder="I want two more 4' x 8' x 1' garden beds..."
                                label="Request Description"
                            />
                        </View>

                        {/* submit button */}
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: units.unit4 }}>
                            <View></View>
                            <Button
                                small
                                alignIconRight
                                text="Submit"
                                disabled={!note}
                                icon={
                                    <Ionicons
                                        name={'checkmark-outline'}
                                        color={colors.purpleB}
                                        size={fonts.h3}
                                    />
                                }
                                onPress={() => this.submit()}
                            />
                        </View>

                    </View>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            sendEmail
        },
        dispatch,
    );
}

NewBeds = connect(mapStateToProps, mapDispatchToProps)(NewBeds);

export default NewBeds;

module.exports = NewBeds;