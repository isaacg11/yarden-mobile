// libraries
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView, TouchableOpacity, Switch, Text, Modal } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Paragraph from '../components/UI/Paragraph';
import Header from '../components/UI/Header';
import Card from '../components/UI/Card';
import PaymentMethod from '../components/app/PaymentMethod';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Button from '../components/UI/Button';
import { alert } from '../components/UI/SystemAlert';

// actions
import { updateUser } from '../actions/user';
import { getSubscription } from '../actions/subscriptions/index';

// helpers
import formatPhoneNumber from '../helpers/formatPhoneNumber';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';

// types
import types from '../vars/types';

class Settings extends Component {

    state = {
        sms: this.props.user.notifications.sms,
        email: this.props.user.notifications.email,
        deleteAccountModalIsOpen: false
    }

    updateNotificationSettings(notificationType, value) {

        // if user resubscribing for sms notifications {...}
        if (notificationType === 'sms' && value === true) {

            // open opt in modal
            alert('Resubscribe to text messages by texting "start" to (888) 828-9287', 'Turn on text notifications?');
        } else {
            // show loading indicator
            this.setState({ isLoading: true }, async () => {

                // set notifications
                const notifications = {
                    email: (notificationType === 'email') ? value : this.props.user.notifications.email,
                    sms: (notificationType === 'sms') ? value : this.props.user.notifications.sms
                }

                // update notification settings
                await this.props.updateUser(null, { notifications });

                // hide loading indicator
                notifications.isLoading = false;

                // update UI
                this.setState(notifications);
            })
        }
    }

    deleteAccount() {

        // show loading indicator
        this.setState({ isLoading: true, deleteAccountModalIsOpen: false }, () => {

            // wait 1 second to let the loading indicator render
            setTimeout(async () => {

                // if payment info exists {...}
                if (this.props.user.payment_info?.plan_id) {

                    // check for active subscription
                    const subscription = await this.props.getSubscription(this.props.user.payment_info.plan_id);

                    // check for active or trialing subscription {...}
                    if (subscription.status === 'active' || subscription.status === 'trialing') {

                        // hide loading indicator
                        this.setState({ isLoading: false });

                        // show warning
                        return alert('You need to cancel your maintenance subscription before you can delete your account. Please go to the Subscription page to manage your maintenance plan.');
                    }
                } else {

                    // delete user
                    await this.props.updateUser(null, { dtDeleted: new Date() });

                    // hide loading indicator
                    this.setState({ isLoading: false });

                    // redirect user to logout
                    this.props.navigation.navigate('Log Out');
                }
            }, 1000)
        });
    }

    render() {

        const {
            user
        } = this.props;

        const {
            isLoading,
            email,
            sms,
            deleteAccountModalIsOpen
        } = this.state;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
                backgroundColor: colors.greenD5,
            }}>
                {/* loading indicator */}
                <LoadingIndicator loading={isLoading} />

                <View style={{ padding: units.unit3 + units.unit4 }}>
                    <ScrollView>
                        <Header type="h4" style={{ marginBottom: units.unit5 }}>Settings</Header>
                        <View>

                            {/* user info */}
                            <Card style={{ marginBottom: units.unit4 }}>
                                <View>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Paragraph style={{ fontWeight: 'bold' }}>Name</Paragraph>
                                        <TouchableOpacity
                                            onPress={() => this.props.navigation.navigate('Change Settings', {
                                                firstName: user.first_name,
                                                lastName: user.last_name,
                                                email: user.email,
                                                phoneNumber: user.phone_number
                                            })}>
                                            <Ionicons
                                                name="pencil-outline"
                                                size={fonts.h3}
                                                color={colors.purpleB}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <Paragraph style={{ textTransform: 'capitalize' }}>{user.first_name} {user.last_name}</Paragraph>
                                    <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Email</Paragraph>
                                    <Paragraph>{user.email}</Paragraph>
                                    <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Phone Number</Paragraph>
                                    <Paragraph>{formatPhoneNumber(user.phone_number)}</Paragraph>
                                </View>
                            </Card>

                            {/* payment info */}
                            {user.type === types.CUSTOMER && user.payment_info && (
                                <Card style={{ marginBottom: units.unit4 }}>
                                    <PaymentMethod />
                                </Card>
                            )}

                            {/* notification management */}
                            {user.type === types.CUSTOMER && (
                                <Card>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View>
                                            <Paragraph style={{ fontWeight: 'bold' }}>Text Notifications</Paragraph>
                                            <Paragraph>{sms ? 'On' : 'Off'}</Paragraph>
                                        </View>
                                        <Switch
                                            trackColor={{ false: '#e5e6e5', true: colors.green0 }}
                                            thumbColor={'#f4f3f4'}
                                            ios_backgroundColor="#e5e6e5"
                                            onValueChange={() => this.updateNotificationSettings('sms', !user.notifications.sms)}
                                            value={user.notifications.sms}
                                        />
                                    </View>
                                    <View style={{ marginTop: units.unit5, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View>
                                            <Paragraph style={{ fontWeight: 'bold' }}>Email Notifications</Paragraph>
                                            <Paragraph>{email ? 'On' : 'Off'}</Paragraph>
                                        </View>
                                        <Switch
                                            trackColor={{ false: '#e5e6e5', true: colors.green0 }}
                                            thumbColor={'#f4f3f4'}
                                            ios_backgroundColor="#e5e6e5"
                                            onValueChange={() => this.updateNotificationSettings('email', !user.notifications.email)}
                                            value={user.notifications.email}
                                        />
                                    </View>
                                </Card>
                            )}
                        </View>
                    </ScrollView>
                </View>

                {/* delete account button */}
                {user.type === types.CUSTOMER && (
                    <View style={{ position: 'absolute', bottom: 25, left: 25 }}>
                        <TouchableOpacity onPress={() => this.setState({ deleteAccountModalIsOpen: true })}>
                            <Text style={{ color: colors.greenD50 }}>Delete account</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* delete account modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={deleteAccountModalIsOpen}>
                    <View style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        paddingHorizontal: units.unit5
                    }}>
                        <View style={{
                            backgroundColor: colors.white,
                            padding: units.unit5,
                            borderRadius: units.unit4
                        }}>
                            <Header type="h5" style={{ color: colors.purpleB, textAlign: 'center', marginBottom: units.unit3, marginTop: units.unit6 }}>
                                (⌒-⌒; )
                            </Header>
                            <Header type="h6" style={{ color: colors.purpleB, textAlign: 'center', marginBottom: units.unit3 }}>
                                We're sad to see you go. Are you sure you want to delete your account?
                            </Header>
                            <Text style={{ color: colors.greenD50, fontSize: 12 }}>WARNING: This will erase all your harvest data, personal info, and payment info FOREVER. We will not be able to recover your data or restore your account.</Text>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: units.unit5 }}>
                                <Button
                                    text="Delete"
                                    variant="btn5"
                                    onPress={() => this.deleteAccount()}
                                />
                                <Button
                                    text="Cancel"
                                    variant="button"
                                    onPress={() => this.setState({ deleteAccountModalIsOpen: false })}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            updateUser,
            getSubscription
        },
        dispatch,
    );
}

Settings = connect(mapStateToProps, mapDispatchToProps)(Settings);

export default Settings;

module.exports = Settings;