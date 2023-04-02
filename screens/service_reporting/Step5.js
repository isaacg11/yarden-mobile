// libraries
import React, { Component } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Slider } from '@miblanchard/react-native-slider';
import CheckBox from '@react-native-community/checkbox';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Header from '../../components/UI/Header';
import Label from '../../components/UI/Label';
import Button from '../../components/UI/Button';
import Link from '../../components/UI/Link';
import Paragraph from '../../components/UI/Paragraph';
import LoadingIndicator from '../../components/UI/LoadingIndicator';

// actions
import { getReportType } from '../../actions/reportTypes/index';
import { getReports } from '../../actions/reports/index';
import { setAnswers, getAnswers } from '../../actions/answers/index';

// helpers
import formatWateringSchedule from '../../helpers/formatWateringSchedule';

// types
import types from '../../vars/types';

// styles
import units from '../../components/styles/units';
import colors from '../../components/styles/colors';
import fonts from '../../components/styles/fonts';
import card from '../../components/styles/card';

class Step5 extends Component {

    state = {
        question: null,
        daysInterval: 0,
        minuteDuration: 0,
        customIntervals: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
    }

    state = {
        daysInterval: 0,
        minuteDuration: 0
    }

    async componentDidMount() {

        // show loading indicator
        this.setState({ isLoading: true });

        const questionIndex = this.props.questions.findIndex((question) => question.placement === 5);
        const question = this.props.questions[questionIndex];
        const order = this.props.selectedOrder;
        let wateringSchedule = [];

        // if order for maintenance service {...}
        if (order.type === types.FULL_PLAN || order.type === types.ASSISTED_PLAN) {

            // if reports are found {...}
            if (this.props.reports.length > 0) {

                // get latest report
                const latestReport = await this.getLatestReport();

                // get answers
                const answers = await this.props.getAnswers(`report=${latestReport._id}`);

                // set watering schedule
                wateringSchedule = answers.filter((answer) => answer.question.placement === 5);
            } else {
                // get report type
                const initialPlantingReportType = await this.props.getReportType(`name=${types.INITIAL_PLANTING}`);

                // get previous reports for customer
                await this.props.getReports(`customer=${order.customer._id}&type=${initialPlantingReportType._id}`);

                if (this.props.reports.length > 0) {
                    // get latest report
                    const latestReport = await this.getLatestReport();

                    // get answers
                    const answers = await this.props.getAnswers(`report=${latestReport._id}`);

                    // set watering schedule
                    wateringSchedule = answers.filter((answer) => answer.question.placement === 5);
                }  
            }
        }

        // update UI
        this.setState({
            question,
            wateringSchedule,
            isLoading: false
        });
    }

    async getLatestReport() {
        // get latest report
        let latestReport = null;
        let newestDate = null;
        for (const report of this.props.reports) {
            const date = new Date(report.order.date);
            if (!newestDate || date > newestDate) {
                latestReport = report;
                newestDate = date;
            }
        }

        return latestReport;
    }

    renderDayIntervalControl() {
        return (
            <View>
                <Header type="h6" style={{ color: colors.purpleB }}>{this.state.daysInterval} {(this.state.daysInterval > 1) ? 'Days' : 'Day'}</Header>
            </View>
        )
    }

    renderMinuteDurationControl() {
        return (
            <View>
                <Header type="h6" style={{ color: colors.purpleB }}>{this.state.minuteDuration} {(this.state.minuteDuration > 1) ? 'Minutes' : 'Minute'}</Header>
            </View>
        )
    }

    async next(result) {
        let currentAnswers = this.props.answers.map((answer) => answer);
        let updated = false;

        // iterate through current answers
        currentAnswers.forEach((answer) => {

            // if question was previously answered {...}
            if (answer.question === this.state.question._id) {

                // update answer result
                answer.result = result;
                updated = true;
            }
        })

        let answers = [];
        if (updated) {

            // update previous answer
            answers = currentAnswers;
        } else {

            // add new answer
            currentAnswers.push({ question: this.state.question._id, result: result });
            answers = currentAnswers;
        }

        // set answers
        await this.props.setAnswers(answers);

        // redirect user to next screen
        this.props.navigation.navigate('Step 6');
    }

    disableButton() {
        let disabled = false;
        if (this.state.customIntervals) {
            if (!this.state.monday && !this.state.tuesday && !this.state.wednesday && !this.state.thursday && !this.state.friday && !this.state.saturday && !this.state.sunday) {
                return true;
            }
        } else {
            if (!this.state.daysInterval) {
                return true;
            }
        }

        if (!this.state.minuteDuration) {
            return true;
        }

        return disabled;

    }

    render() {

        const {
            wateringSchedule,
            daysInterval,
            minuteDuration,
            question,
            customIntervals,
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday,
            isLoading
        } = this.state;

        if (question) {
            return (
                <SafeAreaView style={{
                    flex: 1,
                    width: "100%",
                    backgroundColor: colors.greenE10,
                }}>
                    {/* loading indicator (dynamically visible) */}
                    <LoadingIndicator loading={isLoading} />

                    <View style={{ padding: units.unit3 + units.unit4 }}>
                        <View style={{ height: '100%', display: 'flex', justifyContent: 'center' }}>

                            {/* header */}
                            <Header type="h5" style={{ textAlign: 'center', textTransform: 'none' }}>{question.description}</Header>

                            {/* watering schedule */}
                            <View style={{ paddingHorizontal: units.unit6 }}>
                                <Label style={{ textAlign: 'center', marginTop: units.unit4 }}>Previous Schedule</Label>
                                <Text style={{ textAlign: 'center' }}>{(wateringSchedule.length > 0) ? formatWateringSchedule(wateringSchedule[wateringSchedule.length - 1].result) : 'No schedule found'}</Text>
                            </View>

                            {/* day interval slider */}
                            <View style={{ marginTop: units.unit5 }}>
                                {(!customIntervals) && (
                                    <View>
                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Label>Once every...</Label>
                                            {this.renderDayIntervalControl()}
                                        </View>
                                        <Slider
                                            thumbStyle={{
                                                ...card,
                                                backgroundColor: colors.white,
                                                borderRadius: 50
                                            }}
                                            thumbTintColor={colors.white}
                                            minimumTrackTintColor={colors.purpleB}
                                            trackClickable={true}
                                            minimumValue={0}
                                            maximumValue={5}
                                            value={daysInterval}
                                            onValueChange={value => this.setState({ daysInterval: Math.round(value) })}
                                        />
                                    </View>
                                )}
                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {(customIntervals) ? (
                                        <Label>Once every...</Label>
                                    ) : (
                                        <View></View>
                                    )}
                                    <Link
                                        text={(customIntervals) ? "Daily Intervals" : "Custom Intervals"}
                                        onPress={() => {
                                            this.setState({ customIntervals: !customIntervals });
                                        }}
                                    />
                                </View>
                                {(customIntervals) && (
                                    <View>

                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: units.unit4 }}>
                                            <CheckBox
                                                value={monday}
                                                onValueChange={() => this.setState({ monday: !monday })}
                                                boxType="square"
                                                tintColor={colors.purpleB}
                                                onTintColor={colors.green0}
                                                onCheckColor={colors.green0}
                                                onFillColor={colors.purpleB}
                                            />
                                            <Paragraph style={{ marginLeft: units.unit4 }}>Monday</Paragraph>
                                        </View>
                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: units.unit4 }}>
                                            <CheckBox
                                                value={tuesday}
                                                onValueChange={() => this.setState({ tuesday: !tuesday })}
                                                boxType="square"
                                                tintColor={colors.purpleB}
                                                onTintColor={colors.green0}
                                                onCheckColor={colors.green0}
                                                onFillColor={colors.purpleB}
                                            />
                                            <Paragraph style={{ marginLeft: units.unit4 }}>Tuesday</Paragraph>
                                        </View>
                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: units.unit4 }}>
                                            <CheckBox
                                                value={wednesday}
                                                onValueChange={() => this.setState({ wednesday: !wednesday })}
                                                boxType="square"
                                                tintColor={colors.purpleB}
                                                onTintColor={colors.green0}
                                                onCheckColor={colors.green0}
                                                onFillColor={colors.purpleB}
                                            />
                                            <Paragraph style={{ marginLeft: units.unit4 }}>Wednesday</Paragraph>
                                        </View>
                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: units.unit4 }}>
                                            <CheckBox
                                                value={thursday}
                                                onValueChange={() => this.setState({ thursday: !thursday })}
                                                boxType="square"
                                                tintColor={colors.purpleB}
                                                onTintColor={colors.green0}
                                                onCheckColor={colors.green0}
                                                onFillColor={colors.purpleB}
                                            />
                                            <Paragraph style={{ marginLeft: units.unit4 }}>Thursday</Paragraph>
                                        </View>
                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: units.unit4 }}>
                                            <CheckBox
                                                value={friday}
                                                onValueChange={() => this.setState({ friday: !friday })}
                                                boxType="square"
                                                tintColor={colors.purpleB}
                                                onTintColor={colors.green0}
                                                onCheckColor={colors.green0}
                                                onFillColor={colors.purpleB}
                                            />
                                            <Paragraph style={{ marginLeft: units.unit4 }}>Friday</Paragraph>
                                        </View>
                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: units.unit4 }}>
                                            <CheckBox
                                                value={saturday}
                                                onValueChange={() => this.setState({ saturday: !saturday })}
                                                boxType="square"
                                                tintColor={colors.purpleB}
                                                onTintColor={colors.green0}
                                                onCheckColor={colors.green0}
                                                onFillColor={colors.purpleB}
                                            />
                                            <Paragraph style={{ marginLeft: units.unit4 }}>Saturday</Paragraph>
                                        </View>
                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: units.unit4 }}>
                                            <CheckBox
                                                value={sunday}
                                                onValueChange={() => this.setState({ sunday: !sunday })}
                                                boxType="square"
                                                tintColor={colors.purpleB}
                                                onTintColor={colors.green0}
                                                onCheckColor={colors.green0}
                                                onFillColor={colors.purpleB}
                                            />
                                            <Paragraph style={{ marginLeft: units.unit4 }}>Sunday</Paragraph>
                                        </View>
                                    </View>
                                )}
                            </View>

                            {/* minute interval slider */}
                            <View style={{ marginTop: units.unit5 }}>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Label style={{ marginBottom: units.unit3 }}>For...</Label>
                                    {this.renderMinuteDurationControl()}
                                </View>
                                <Slider
                                    thumbStyle={{
                                        ...card,
                                        backgroundColor: colors.white,
                                        borderRadius: 50
                                    }}
                                    thumbTintColor={colors.white}
                                    minimumTrackTintColor={colors.purpleB}
                                    trackClickable={true}
                                    minimumValue={0}
                                    maximumValue={60}
                                    value={minuteDuration}
                                    onValueChange={value => this.setState({ minuteDuration: Math.round(value) })}
                                />
                            </View>

                            {/* next button */}
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: units.unit4 }}>
                                <View></View>
                                <Button
                                    small
                                    alignIconRight
                                    text="Next"
                                    disabled={this.disableButton()}
                                    icon={
                                        <Ionicons
                                            name={'arrow-forward'}
                                            color={colors.purpleB}
                                            size={fonts.h3}
                                        />
                                    }
                                    onPress={() => {
                                        let data = { minute_duration: this.state.minuteDuration };
                                        if (this.state.customIntervals) {
                                            data.custom_intervals = {
                                                monday,
                                                tuesday,
                                                wednesday,
                                                thursday,
                                                friday,
                                                saturday,
                                                sunday
                                            }
                                        } else {
                                            data.days_interval = daysInterval;
                                        }

                                        this.next(data);
                                    }}
                                />
                            </View>

                        </View>
                    </View>
                </SafeAreaView>
            )
        } else {
            return (
                <></>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        selectedOrder: state.selectedOrder,
        questions: state.questions,
        answers: state.answers,
        reports: state.reports
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            setAnswers,
            getAnswers,
            getReportType,
            getReports
        },
        dispatch,
    );
}

Step5 = connect(mapStateToProps, mapDispatchToProps)(Step5);

export default Step5;

module.exports = Step5;