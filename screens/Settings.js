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
import CircularButton from '../components/UI/CircularButton';
import Dialog from '../components/UI/Dialog';
import Input from '../components/UI/Input';

// actions
import { updateUser } from '../actions/user';
import { getUsers } from '../actions/users';
import { getSubscription } from '../actions/subscriptions/index';
import { sendEmail } from '../actions/emails/index';

// helpers
import formatPhoneNumber from '../helpers/formatPhoneNumber';
import capitalize from '../helpers/capitalize';
import { APP_URL } from '../helpers/getUrl';

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
        deleteAccountModalIsOpen: false,
        deleteSecondaryUserModalIsOpen: false,
        addAccountModalIsOpen: false,
        invitationSent: false,
        secondaryEmail: '',
        selectedSecondaryUser: null
    }

    componentDidMount() {
        this.props.getUsers(`primary=${this.props.user._id}`);
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
        this.setState({ isLoading: true }, () => {

            // wait 1 second to let the loading indicator render
            setTimeout(async () => {

                // if payment info exists {...}
                if (this.props.user.payment_info?.plan_id) {

                    // check for active subscription
                    const subscription = await this.props.getSubscription(this.props.user.payment_info.plan_id);

                    // check for active or trialing subscription {...}
                    if (subscription.status === 'active' || subscription.status === 'trialing') {

                        // hide loading indicator
                        this.setState({ isLoading: false, deleteAccountModalIsOpen: false });

                        // show warning
                        return alert('You need to cancel your membership plan before you can delete your account. Please go to the Membership page to manage your plan.');
                    }
                } else {

                    // delete user
                    await this.props.updateUser(null, { dtDeleted: new Date() });

                    // hide loading indicator
                    this.setState({ isLoading: false, deleteAccountModalIsOpen: false });

                    // redirect user to logout
                    this.props.navigation.navigate('Log Out');
                }
            }, 1000)
        });
    }

    addSecondaryAccount() {

        // show loading indicator
        this.setState({ isLoading: true }, () => {

            // wait 1 second to let the loading indicator render
            setTimeout(async () => {
                const url = `${APP_URL}/invitation?primary=${this.props.user._id}&secondary=${this.state.secondaryEmail}`;

                // format email
                const accountInvitation = {
                    email: this.state.secondaryEmail,
                    subject: `${capitalize(this.props.user.first_name)} invited you to view their Yarden account`,
                    label: 'Account Invitation',
                    body: (
                        '<p>Greetings from Yarden!</p>' +
                        `<p style="margin-bottom: 15px;">You have been invited to view ${capitalize(this.props.user.first_name)}'s Yarden account, click the link below to view.</p>` +
                        `<div><a href="${url}">${url}</a></div>`
                    )
                }

                // send email
                await this.props.sendEmail(accountInvitation, `override=${true}`);

                // hide loading indicator
                this.setState({
                    isLoading: false,
                    invitationSent: true
                })
            })
        }, 1000)
    }

    deleteSecondaryUser() {

        // show loading indicator
        this.setState({ isLoading: true }, async () => {

            // delete user
            await this.props.updateUser(`userId=${this.state.selectedSecondaryUser._id}`, { dtDeleted: new Date() }, true);

            // get updated list of secondary users
            await this.props.getUsers(`primary=${this.props.user._id}`);

            // hide loading indicator
            this.setState({ 
                isLoading: false, 
                deleteSecondaryUserModalIsOpen: false 
            });
        })
    }

    render() {

        const {
            user,
            users
        } = this.props;

        const {
            isLoading,
            email,
            sms,
            deleteAccountModalIsOpen,
            deleteSecondaryUserModalIsOpen,
            addAccountModalIsOpen,
            invitationSent,
            secondaryEmail
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
                                <Card style={{ marginBottom: units.unit4 }}>
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

                            {/* account users */}
                            {user.type === types.CUSTOMER && (
                                <Card>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: units.unit3 }}>
                                        <Paragraph style={{ fontWeight: 'bold', marginBottom: units.unit3 }}>Account Users</Paragraph>
                                        <CircularButton
                                            small
                                            variant="btn2"
                                            icon={(<Ionicons
                                                name={'add-outline'}
                                                color={colors.purpleB}
                                                size={fonts.h3}
                                            />)}
                                            onPress={() => this.setState({ addAccountModalIsOpen: true })}
                                        />
                                    </View>
                                    <View>
                                        {users.length > 0 ? users.map((u, index) => (
                                            <View key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Paragraph>
                                                    {capitalize(u.first_name)} {capitalize(u.last_name)}
                                                </Paragraph>
                                                <TouchableOpacity onPress={() => this.setState({ deleteSecondaryUserModalIsOpen: true, selectedSecondaryUser: u })}>
                                                    <Ionicons
                                                        name={'close-outline'}
                                                        color={colors.purpleB}
                                                        size={fonts.h2}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        )) : (
                                            <View>
                                                <Paragraph>Invite others to view your account</Paragraph>
                                            </View>
                                        )}
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
                <Dialog
                    isOpen={deleteAccountModalIsOpen}
                    content={(
                        <View>
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
                    )}
                />

                {/* add account user modal */}
                <Dialog
                    isOpen={addAccountModalIsOpen}
                    content={(
                        <View>
                            {invitationSent ? (
                                <View>
                                    <Header type="h5" style={{ color: colors.purpleB, textAlign: 'center', marginBottom: units.unit3, marginTop: units.unit3 }}>
                                        Success!
                                    </Header>
                                    <Text
                                        style={{
                                            fontSize: fonts.h1,
                                            textAlign: 'center',
                                            color: colors.purpleB,
                                            marginBottom: units.unit4
                                        }}>
                                        ٩( ᐛ )و
                                    </Text>
                                    <Text style={{ textAlign: 'center', marginBottom: units.unit3 }}>
                                        Great job, your invite was sent. Your new account user will appear once they have accepted the invite.
                                    </Text>
                                    <Button
                                        text="Close"
                                        variant="btn5"
                                        onPress={() => this.setState({ addAccountModalIsOpen: false, invitationSent: false, secondaryEmail: '' })}
                                    />
                                </View>
                            ) : (
                                <View>
                                    <Header type="h5" style={{
                                        color: colors.purpleB,
                                        textAlign: 'center',
                                        marginBottom: units.unit3,
                                        marginTop: units.unit3
                                    }}>
                                        Add new user?
                                    </Header>
                                    <Text style={{ textAlign: 'center', marginBottom: units.unit3 }}>
                                        Invite a family member to view your account
                                    </Text>
                                    <Input
                                        label="Email"
                                        onChange={value => this.setState({ secondaryEmail: value })}
                                        value={secondaryEmail}
                                        placeholder="Ex. johnsmith@gmail.com"
                                    />
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: units.unit5 }}>
                                        <Button
                                            text="Cancel"
                                            variant="btn5"
                                            onPress={() => this.setState({ addAccountModalIsOpen: false })}
                                        />
                                        <Button
                                            text="Add"
                                            variant="button"
                                            disabled={!secondaryEmail}
                                            onPress={() => this.addSecondaryAccount()}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                    )}
                />

                {/* delete secondary user modal */}
                <Dialog
                    isOpen={deleteSecondaryUserModalIsOpen}
                    content={(
                        <View>
                            <Header type="h5" style={{ color: colors.purpleB, textAlign: 'center', marginBottom: units.unit3, marginTop: units.unit3 }}>
                                Are you sure?
                            </Header>
                            <Text style={{ color: colors.greenD50, fontSize: 12 }}>This person will no longer have access to your account after being removed.</Text>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: units.unit5 }}>
                                <Button
                                    text="Delete"
                                    variant="btn5"
                                    onPress={() => this.deleteSecondaryUser()}
                                />
                                <Button
                                    text="Cancel"
                                    variant="button"
                                    onPress={() => this.setState({ deleteSecondaryUserModalIsOpen: false })}
                                />
                            </View>
                        </View>
                    )}
                />
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        users: state.users
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            updateUser,
            getSubscription,
            sendEmail,
            getUsers
        },
        dispatch,
    );
}

Settings = connect(mapStateToProps, mapDispatchToProps)(Settings);

export default Settings;

module.exports = Settings;