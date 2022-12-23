// libraries
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

// UI components
import Header from '../UI/Header';
import Label from '../UI/Label';
import Button from '../UI/Button';
import Divider from '../UI/Divider';

// styles
import units from '../styles/units';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

class HarvestReport extends Component {

    getRangeFilterStyles(status) {
        const sharedStyles = {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        }

        switch (status) {
            case 'active':
                return {
                    backgroundColor: colors.purpleB,
                    opacity: 0.3,
                    paddingHorizontal: units.unit3,
                    paddingVertical: units.unit2,
                    color: colors.white,
                    borderRadius: units.unit3,
                    ...sharedStyles

                }
            default:
                return {
                    backgroundColor: colors.white,
                    color: colors.purpleB,
                    opacity: 0.3,
                    ...sharedStyles
                }
        }
    }

    render() {

        const { onCheckStatus, beds } = this.props;
        
        return (
            <View style={{
                backgroundColor: colors.white,
                paddingVertical: units.unit3,
                paddingHorizontal: units.unit4,
                shadowColor: colors.greenD10,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 1,
                shadowRadius: 6,
            }}>
                <Label>TOTAL CROP YIELD</Label>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Header type="h4" style={{ marginBottom: units.unit3, marginRight: units.unit3, color: colors.purpleB }}>
                        No Data
                    </Header>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Text style={{ color: colors.greenD50, opacity: 0.5, marginRight: units.unit3 }}>- No Data (...%)</Text>
                    {(beds.length < 1) && (
                        <Text style={{ color: colors.greenD50 }}>You don't have any garden beds yet</Text>
                    )}
                </View>
                <View style={{ padding: units.unit5, display: 'flex', alignItems: 'center'}}>
                    <Text style={{fontSize: fonts.h3, color: colors.greenD75, textAlign: 'center', marginBottom: units.unit3}}>Your harvest data will appear here after your first harvest.</Text>
                    <Button text="Check Order Status" onPress={() => onCheckStatus()}/>
                </View>
                <Divider />
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: units.unit3
                }}>
                    <View style={{ ...this.getRangeFilterStyles('active') }}>
                        <Text style={{ color: this.getRangeFilterStyles('active').color }}>2W</Text>
                    </View>
                    <View style={{ ...this.getRangeFilterStyles() }}>
                        <Text style={{ color: this.getRangeFilterStyles().color }}>4W</Text>
                    </View>
                    <View style={{ ...this.getRangeFilterStyles() }}>
                        <Text style={{ color: this.getRangeFilterStyles().color }}>12W</Text>
                    </View>
                    <View style={{ ...this.getRangeFilterStyles() }}>
                        <Text style={{ color: this.getRangeFilterStyles().color }}>1Y</Text>
                    </View>
                    <View style={{ ...this.getRangeFilterStyles() }}>
                        <Text style={{ color: this.getRangeFilterStyles().color }}>YTD</Text>
                    </View>
                    <View style={{ ...this.getRangeFilterStyles() }}>
                        <Text style={{ color: this.getRangeFilterStyles().color }}>ALL</Text>
                    </View>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        conversations: state.conversations,
        user: state.user,
        beds: state.beds
    };
}

HarvestReport = connect(mapStateToProps, null)(HarvestReport);

export default HarvestReport;

module.exports = HarvestReport;
