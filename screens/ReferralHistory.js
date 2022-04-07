
import React, { Component } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Table from '../components/UI/Table';
import Header from '../components/UI/Header';
import units from '../components/styles/units';

class ReferralHistory extends Component {

    render() {

        const { referrals } = this.props.route.params;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <ScrollView>
                    <Header type="h4" style={{ textAlign: 'center', marginTop: units.unit6 }}>
                        Referral History
                    </Header>
                    <View style={{ padding: units.unit5 }}>
                        <View style={{ backgroundColor: '#fff', padding: units.unit5, borderRadius: 5 }}>
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