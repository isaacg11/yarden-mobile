// libraries
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import HarvestReport from '../components/app/HarvestReport';
import BedList from '../components/app/BedList';
import Header from '../components/UI/Header';
import Paragraph from '../components/UI/Paragraph';
import CircularButton from '../components/UI/CircularButton';

// actions
import { getBeds } from '../actions/beds/index';
import { getPlantActivities } from '../actions/plantActivities/index';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';

class Reports extends Component {

    state = {}

    componentDidMount() {

        // get beds
        this.props.getBeds(`customer=${this.props.user._id}`);
    }

    render() {

        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    width: '100%',
                    backgroundColor: colors.greenD5,
                }}>
                <ScrollView>

                    {/* harvest report */}
                    <HarvestReport
                        onCheckStatus={() => this.props.navigation.navigate('Orders')}
                    />

                    {/* bed list */}
                    <View style={{ padding: units.unit4 }}>
                        <View style={{ 
                            display: 'flex', 
                            flexDirection: 'row', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: units.unit4}}>
                            <Header
                                type="h5"
                                style={{ color: colors.purpleC75 }}>
                                Garden Beds
                            </Header>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <Paragraph style={{ color: colors.purpleB, marginRight: units.unit3 }}>
                                    Add
                                </Paragraph>
                                <CircularButton
                                    small
                                    icon={(<Ionicons
                                        name={'add-outline'}
                                        color={colors.purpleB}
                                        size={fonts.h3}
                                    />)}
                                    onPress={() => this.props.navigation.navigate('New Beds')}
                                />
                            </View>
                        </View>
                        <BedList onSelect={(bed) => this.props.navigation.navigate('Bed', bed)} />
                    </View>

                </ScrollView>
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getBeds,
            getPlantActivities
        },
        dispatch,
    );
}

Reports = connect(mapStateToProps, mapDispatchToProps)(Reports);

export default Reports;

module.exports = Reports;
