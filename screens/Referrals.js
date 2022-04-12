
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { SafeAreaView, View, Image } from 'react-native';
import Button from '../components/UI/Button';
import Paragraph from '../components/UI/Paragraph';
import Header from '../components/UI/Header';
import Card from '../components/UI/Card';
import { getReferrals } from '../actions/referrals/index';
import units from '../components/styles/units';

class Referrals extends Component {

    state = {
        referrals: []
    }

    async componentDidMount() {

        // get referrals
        await this.props.getReferrals(`referrer=${this.props.user._id}`);

        // format referrals
        this.formatReferrals();

    }

    formatReferrals() {
        let referrals = [];
        this.props.referrals.forEach((referral) => {
            referrals.push({
                name: `${referral.referee.first_name} ${referral.referee.last_name[0]}.`,
                date: moment(referral.dt_created).format('MM/DD/YYYY')
            })
        })

        this.setState({ referrals });
    }

    viewReferralHistory() {
        // navigate to request change page
        this.props.navigation.navigate('Referral History', { referrals: this.state.referrals });
    }

    render() {

        const {
            qrCode
        } = this.props.route.params;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>

                <Header type="h4" style={{ marginTop: units.unit6 }}>
                    Referrals
                </Header>
                <View style={{ padding: units.unit5 }}>

                    {/* QR code */}
                    <Card>
                        <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5 }}>Yarden Referral Program</Paragraph>
                        <Paragraph style={{ marginTop: units.unit4 }}>Share this QR with your family and friends. Upon signing up for service, you will both get 1 FREE month of gardening maintenance!</Paragraph>
                        <View style={{ marginTop: units.unit5, display: 'flex', alignItems: 'center' }}>
                            <Image source={{ uri: qrCode }} style={{ width: 200, height: 200 }} />
                        </View>
                    </Card>

                    {/* navigation button */}
                    <View style={{marginTop: units.unit4}}>
                        <Button
                            text="View Referral History"
                            onPress={() => this.viewReferralHistory()}
                        />
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        referrals: state.referrals
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getReferrals
    }, dispatch)
}

Referrals = connect(mapStateToProps, mapDispatchToProps)(Referrals);

export default Referrals;

module.exports = Referrals;