
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Header from '../components/UI/Header';
import Paragraph from '../components/UI/Paragraph';
import Card from '../components/UI/Card';
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class AccountType extends Component {

    state = {}

    render() {

        const {
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

                        {/* password reset start */}
                        <Header type="h4" style={{ marginBottom: units.unit5 }}>Which option best describes you?</Header>
                        <Paragraph style={{ marginBottom: units.unit2, color: colors.purpleB }}>I want to...</Paragraph>
                        <Card>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Register', { accountType: 'customer' })}>
                                <View
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    <Paragraph style={{ fontWeight: 'bold' }}>
                                        Get help from a gardener
                                    </Paragraph>
                                    <Ionicons
                                        name="arrow-forward"
                                        size={30}
                                        color={colors.purpleB}
                                    />
                                </View>
                            </TouchableOpacity>
                        </Card>
                        <Card style={{ marginTop: units.unit4 }}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Register', { accountType: 'gardener' })}>
                                <View
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    <Paragraph style={{ fontWeight: 'bold' }}>
                                        Apply for work
                                    </Paragraph>
                                    <Ionicons
                                        name="arrow-forward"
                                        size={30}
                                        color={colors.purpleB}
                                    />
                                </View>
                            </TouchableOpacity>
                        </Card>
                        {/* password reset end */}

                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        users: state.users,
    }
}

AccountType = connect(mapStateToProps, null)(AccountType);

export default AccountType;

module.exports = AccountType;