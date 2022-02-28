
import React, { Component } from 'react';
import { View, SafeAreaView, ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import Table from '../components/UI/Table';

class ReferralHistory extends Component {

    render() {

        const { referrals } = this.props.route.params;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <ScrollView>
                    <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25, marginBottom: 25 }}>Referral History</Text>
                    <View style={{ padding: 12 }}>
                        <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                            <Table data={referrals} />
                        </View>
                    </View>
                </ScrollView >
            </SafeAreaView>

        )
    }
}

ReferralHistory = connect(null, null)(ReferralHistory);

export default ReferralHistory;

module.exports = ReferralHistory;