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

class Step4 extends Component {

    state = {
        question: null
    }

    componentDidMount() {
        const questionIndex = this.props.questions.findIndex((question) => question.placement === 4);
        const question = this.props.questions[questionIndex];
        this.setState({ question });
    }

    async next(result) {
        // if user answered yes {...}
        if (result === true) {

            // redirect user to neem oil screen
            this.props.navigation.navigate('Neem Oil');
        } else { // if user answered no {...}

            let currentAnswers = this.props.answers.map((answer) => answer);
            let updated = false;
            const defaultSelections = {
                pests: false,
                powdery_mildew: false
            }

            // iterate through current answers
            currentAnswers.forEach((answer) => {

                // if question was previously answered {...}
                if (answer.question === this.state.question._id) {

                    // update answer result
                    answer.result = defaultSelections;
                    updated = true;
                }
            })

            let answers = [];
            if (updated) {

                // update previous answer
                answers = currentAnswers;
            } else {

                // add new answer
                currentAnswers.push({ question: this.state.question._id, result: defaultSelections });
                answers = currentAnswers;
            }

            // set answers
            await this.props.setAnswers(answers);

            // redirect user to next screen
            this.props.navigation.navigate('Step 5');
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

Step4 = connect(mapStateToProps, mapDispatchToProps)(Step4);

export default Step4;

module.exports = Step4;