// libraries
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Paragraph from '../components/UI/Paragraph';
import Header from '../components/UI/Header';
import Card from '../components/UI/Card';
import PaymentMethod from '../components/app/PaymentMethod';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import { alert } from '../components/UI/SystemAlert';

// actions
import { updateUser } from '../actions/user';

// helpers
import formatPhoneNumber from '../helpers/formatPhoneNumber';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';

class Settings extends Component {

    state = {
        sms: this.props.user.notifications.sms,
        email: this.props.user.notifications.email,
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

    render() {

        const {
            user
        } = this.props;

        const { 
            isLoading,
            email,
            sms
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
                            {user.payment_info && (
                                <Card style={{ marginBottom: units.unit4 }}>
                                    <PaymentMethod />
                                </Card>
                            )}
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
                        </View>
                    </ScrollView>
                </View>
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
        updateUser
      },
      dispatch,
    );
  }

Settings = connect(mapStateToProps, mapDispatchToProps)(Settings);

export default Settings;

module.exports = Settings;