
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { SafeAreaView, View, Image } from 'react-native';
import Button from '../components/UI/Button';
import Paragraph from '../components/UI/Paragraph';
import { getReferrals } from '../actions/referrals/index';

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
                <Paragraph style={{ fontSize: 25, textAlign: 'center', marginTop: 25, marginBottom: 25 }}>Referrals</Paragraph>
                <View style={{ padding: 12 }}>

                    {/* QR code */}
                    <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                        <Paragraph style={{ fontWeight: 'bold', marginTop: 12 }}>Yarden Referral Program</Paragraph>
                        <Paragraph style={{ marginTop: 12 }}>Share this QR with your family and friends. Upon signing up for service, you will both get 1 FREE month of gardening maintenance!</Paragraph>
                        <View style={{ marginTop: 12, display: 'flex', alignItems: 'center' }}>
                            <Image source={{ uri: qrCode }} style={{ width: 200, height: 200 }} />
                        </View>
                    </View>

                    {/* navigation button */}
                    <View>
                        <Button
                            text="View Referral History"
                            onPress={() => this.viewReferralHistory()}
                            variant="secondary"
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