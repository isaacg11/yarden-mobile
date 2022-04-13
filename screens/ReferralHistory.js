
import React, { Component } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Table from '../components/UI/Table';
import Header from '../components/UI/Header';
import Card from '../components/UI/Card';
import Paragraph from '../components/UI/Paragraph';
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
                    <View style={{ padding: units.unit3 + units.unit4 }}>
                        <Header type="h4" style={{ marginBottom: units.unit5 }}>
                            Referral History
                        </Header>
                        <View>
                            {(referrals && referrals.length > 0) ? (
                                <Card>
                                    <Table data={referrals} />
                                </Card>
                            ) : (
                                <Paragraph style={{textAlign: 'center', marginTop: units.unit4}}>
                                    No referral history
                                </Paragraph>
                            )}

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