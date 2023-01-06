// libraries
import React, { Component } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CheckBox from '@react-native-community/checkbox';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Header from '../components/UI/Header';
import Button from '../components/UI/Button';
import Paragraph from '../components/UI/Paragraph';
import Divider from '../components/UI/Divider';

// actions
import { setAnswers } from '../actions/answers/index';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';

class NeemOil extends Component {

    componentDidMount() {
        const questionIndex = this.props.questions.findIndex((question) => question.placement === 4);
        const question = this.props.questions[questionIndex];
        this.setState({ question });
    }

    state = {
        question: null,
        pests: false,
        powderyMildew: false
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
        this.props.navigation.navigate('Step 5');
    }

    render() {

        const { pests, powderyMildew } = this.state;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
                backgroundColor: colors.greenE10,
            }}>
                <View style={{ padding: units.unit3 + units.unit4 }}>

                    {/* header */}
                    <Header>Select all that apply</Header>

                    {/* helper text */}
                    <Text style={{ marginTop: units.unit3 }}>Please select all the reasons that you applied Neem Oil to the garden today</Text>

                    {/* checkboxes */}
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: units.unit4 }}>
                        <CheckBox
                            value={pests}
                            onValueChange={() => this.setState({ pests: !pests })}
                            boxType="square"
                            tintColor={colors.purpleB}
                            onTintColor={colors.green0}
                            onCheckColor={colors.green0}
                            onFillColor={colors.purpleB}
                        />
                        <Paragraph style={{ marginLeft: units.unit4 }}>Pests</Paragraph>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: units.unit4 }}>
                        <CheckBox
                            value={powderyMildew}
                            onValueChange={() => this.setState({ powderyMildew: !powderyMildew })}
                            boxType="square"
                            tintColor={colors.purpleB}
                            onTintColor={colors.green0}
                            onCheckColor={colors.green0}
                            onFillColor={colors.purpleB}
                        />
                        <Paragraph style={{ marginLeft: units.unit4 }}>Powdery Mildew</Paragraph>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: units.unit4 }}>
                        <CheckBox
                            value={pests}
                            onValueChange={() => this.setState({ pests: !pests })}
                            boxType="square"
                            tintColor={colors.purpleB}
                            onTintColor={colors.green0}
                            onCheckColor={colors.green0}
                            onFillColor={colors.purpleB}
                        />
                        <Paragraph style={{ marginLeft: units.unit4 }}>Preventative Maintenance</Paragraph>
                    </View>
                    <View style={{ paddingVertical: units.unit5 }}>
                        <Divider />
                    </View>

                    {/* next button */}
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View></View>
                        <Button
                            small
                            alignIconRight
                            text="Next"
                            disabled={!pests && !powderyMildew}
                            icon={
                                <Ionicons
                                    name={'arrow-forward'}
                                    color={colors.purpleB}
                                    size={fonts.h3}
                                />
                            }
                            onPress={() => this.next({
                                pests,
                                powderyMildew
                            })}
                        />
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        selectedOrder: state.selectedOrder,
        questions: state.questions,
        answers: state.answers
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            setAnswers
        },
        dispatch,
    );
}

NeemOil = connect(mapStateToProps, mapDispatchToProps)(NeemOil);

export default NeemOil;

module.exports = NeemOil;