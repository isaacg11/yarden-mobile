// libraries
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// UI components
import HarvestReport from '../components/app/HarvestReport';
import BedList from '../components/app/BedList';

// actions
import { getBeds } from '../actions/beds/index';
import { getPlantActivities } from '../actions/plantActivities/index';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';

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
