// libraries
import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

// UI components
import Header from '../UI/Header';
import Label from '../UI/Label';
import Divider from '../UI/Divider';
import BarChart from '../UI/BarChart';
import ToggleSwitch from '../UI/ToggleSwitch';
import Button from '../UI/Button';
import LoadingIndicator from '../UI/LoadingIndicator';

// actions
import { getPlantActivities } from '../../actions/plantActivities/index';

// types
import types from '../../vars/types';

// helpers
import groupByWeek from '../../helpers/groupByWeek';

// styles
import units from '../styles/units';
import colors from '../styles/colors';
import calculateHarvestWeight from '../../helpers/calculateHarvestWeight';

class HarvestReport extends Component {

    state = {
        rangeFilter: 2,
        harvestData: [],
        total: 0
    };

    componentDidMount() {
        this.setTimeRange(12);
    }

    async setHarvestData() {
        const plantActivities = this.props.plantActivities;
        let harvestData = [];
        let total = 0;

        // if plant activities {...}
        if (plantActivities.length > 0) {

            // group plant activities by week
            const weeklyPlantActivity = await groupByWeek(plantActivities);

            // iterate through each week of plant activities
            for (let group in weeklyPlantActivity) {
                let weeklyTotal = 0;
                weeklyPlantActivity[group].forEach((plantActivity) => {

                    // calculate harvest weight
                    weeklyTotal += calculateHarvestWeight(plantActivity);
                })

                // add to combined total
                total += weeklyTotal;

                // add weekly total to harvest data list
                harvestData.push({
                    value: parseFloat(weeklyTotal.toFixed(2))
                });
            }
        }

        // update UI
        this.setState({
            harvestData,
            total
        })
    }

    getRangeFilterStyles(isActive) {

        const sharedStyles = {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        }

        if (isActive) {
            return {
                backgroundColor: colors.purpleA25,
                paddingHorizontal: units.unit3,
                paddingVertical: units.unit2,
                borderRadius: units.unit3,
                ...sharedStyles

            }
        } else {
            return {
                backgroundColor: colors.white,
                color: colors.purpleB,
                ...sharedStyles
            }
        }
    }

    async setTimeRange(days) {

        // show loading indicator
        this.setState({ isLoading: true });

        // get plant activities
        await this.props.getPlantActivities(`customer=${this.props.user._id}&type=${types.HARVESTED}&start=${new Date(moment().subtract(days, 'days').startOf('day'))}&end=${new Date(moment().add(1, 'day').endOf('day'))}`);

        // set harvest data
        await this.setHarvestData();

        let harvestData = this.state.harvestData;

        // if plant activities {...}
        if (this.props.plantActivities.length > 0) {

            // if not enough data exists yet to match number of weeks {...}
            if (this.state.harvestData.length < (days / 7)) {
                const diff = (days / 7) - this.state.harvestData.length;
                for (let i = 0; i < diff; i++) {

                    // add empty bar
                    harvestData.unshift({ value: 0 });
                }
            }
        }

        // hide loading indicator, update UI
        this.setState({
            isLoading: false,
            rangeFilter: (days / 7),
            harvestData
        });
    }

    renderHarvestReport() {
        const {
            rangeFilter,
            weeklyYieldIsActive,
            harvestData,
            total,
            isLoading
        } = this.state;

        const {
            onCheckStatus,
            plantActivities
        } = this.props;

        // render harvest report
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
                {/* loading indicator (dynamically visible) */}
                <LoadingIndicator loading={isLoading} />

                {/* header */}
                <Label style={{ marginBottom: units.unit2 }}>TOTAL CROP YIELD</Label>
                {(harvestData.length < 1) ? (
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <Header type="h4" style={{ marginBottom: units.unit3, marginRight: units.unit3, color: colors.purpleB }}>
                            No Data
                        </Header>
                    </View>
                ) : (
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: units.unit4 + units.unit3, justifyContent: 'space-between' }}>
                        <Header type="h4" style={{ marginRight: units.unit3, color: colors.purpleB }}>
                            {total.toFixed(1)} lbs
                        </Header>
                        <ToggleSwitch
                            trackLabel="Weekly Yield"
                            thumbLabel="Weekly Yield"
                            onChange={(value) => this.setState({ weeklyYieldIsActive: value })}
                        />
                    </View>
                )}

                {/* bar chart */}
                {(harvestData.length < 1) ? (
                    <View>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <Text style={{ color: colors.greenD50, opacity: 0.5, marginRight: units.unit3 }}>- No Data (...%)</Text>
                            <Text style={{ color: colors.greenD50 }}>You don't have any harvest data yet</Text>
                        </View>
                        <View style={{ padding: units.unit5, display: 'flex', alignItems: 'center' }}>
                            <Text style={{ fontSize: fonts.h3, color: colors.greenD75, textAlign: 'center', marginBottom: units.unit3 }}>Your harvest data will appear here after your first harvest.</Text>
                            <Button text="Check Order Status" onPress={() => onCheckStatus()} />
                        </View>
                    </View>
                ) : (
                    <BarChart
                        showValues={weeklyYieldIsActive}
                        data={harvestData}
                    />
                )}
                <Divider style={{ backgroundColor: colors.purpleB }} />

                {/* range filters */}
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: units.unit3
                }}>
                    <TouchableOpacity
                        disabled={plantActivities.length < 1}
                        style={{ ...this.getRangeFilterStyles(rangeFilter === 2) }}
                        onPress={() => this.setTimeRange(12)}>
                        <Text style={{ color: this.getRangeFilterStyles(rangeFilter === 2).color }}>2W</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={plantActivities.length < 1}
                        style={{ ...this.getRangeFilterStyles(rangeFilter === 4) }}
                        onPress={() => this.setTimeRange(26)}>
                        <Text style={{ color: this.getRangeFilterStyles(rangeFilter === 4).color }}>4W</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={plantActivities.length < 1}
                        style={{ ...this.getRangeFilterStyles(rangeFilter === 12) }}
                        onPress={() => this.setTimeRange(82)}>
                        <Text style={{ color: this.getRangeFilterStyles(rangeFilter === 12).color }}>12W</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={plantActivities.length < 1}
                        style={{ ...this.getRangeFilterStyles(rangeFilter === 24) }}
                        onPress={() => this.setTimeRange(180)}>
                        <Text style={{ color: this.getRangeFilterStyles(rangeFilter === 24).color }}>24W</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={plantActivities.length < 363}
                        style={{ ...this.getRangeFilterStyles(rangeFilter === 53) }}
                        onPress={() => this.setTimeRange(53)}>
                        <Text style={{ color: this.getRangeFilterStyles(rangeFilter === 53).color }}>1Y</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    render() {
        return this.renderHarvestReport();
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        beds: state.beds,
        plantActivities: state.plantActivities
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getPlantActivities
        },
        dispatch,
    );
}

HarvestReport = connect(mapStateToProps, mapDispatchToProps)(HarvestReport);

export default HarvestReport;

module.exports = HarvestReport;