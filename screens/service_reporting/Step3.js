// libraries
import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// UI components
import Header from '../../components/UI/Header';
import Link from '../../components/UI/Link';

// actions
import { setAnswers } from '../../actions/answers/index';

// types
import types from '../../vars/types';

// styles
import units from '../../components/styles/units';
import colors from '../../components/styles/colors';

class Step3 extends Component {

    state = {
        question: null
    }

    componentDidMount() {
        const questionIndex = this.props.questions.findIndex((question) => question.placement === 3);
        const question = this.props.questions[questionIndex];
        this.setState({ question });
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

        // if user answered yes {...}
        if (result === true) {

            // redirect user to Beds screen
            this.props.navigation.navigate('Beds', {
                order: this.props.selectedOrder,
                serviceReport: types.NEW_PLANTS
            })
        } else { // if user answered no {...}
            // redirect user to next screen
            this.props.navigation.navigate('Step 4');
        }
    }

    render() {
        const { question } = this.state;
        if (question) {
            return (
                <SafeAreaView style={{
                    flex: 1,
                    width: "100%",
                    backgroundColor: colors.greenE10,
                }}>
                    <View style={{ padding: units.unit3 + units.unit4 }}>
                        <View style={{ height: '100%', display: 'flex', justifyContent: 'center' }}>
                            <Header type="h5" style={{ textAlign: 'center', textTransform: 'none' }}>{question.description}</Header>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', paddingTop: units.unit6 }}>
                                <View>
                                    <Link
                                        text="No"
                                        onPress={() => this.next(false)}
                                    />
                                </View>
                                <View>
                                    <Link
                                        text="Yes"
                                        onPress={() => this.next(true)}
                                    />
                                </View>
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

Step3 = connect(mapStateToProps, mapDispatchToProps)(Step3);

export default Step3;

module.exports = Step3;