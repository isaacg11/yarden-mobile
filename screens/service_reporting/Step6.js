// libraries
import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Header from '../../components/UI/Header';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';

// actions
import { setAnswers } from '../../actions/answers/index';

// styles
import units from '../../components/styles/units';
import colors from '../../components/styles/colors';
import fonts from '../../components/styles/fonts';

class Step6 extends Component {

    state = {
        question: null
    }

    componentDidMount() {
        const questionIndex = this.props.questions.findIndex((question) => question.placement === 6);
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

        // redirect user to next screen
        this.props.navigation.navigate('Image Upload', { order: this.props.selectedOrder });
    }

    render() {
        const { 
            note, 
            question 
        } = this.state;

        if (question) {
            return (
                <SafeAreaView style={{
                    flex: 1,
                    width: "100%",
                    backgroundColor: colors.greenE10,
                }}>
                    <View style={{ padding: units.unit3 + units.unit4 }}>
                        <View style={{ height: '100%', display: 'flex', justifyContent: 'center' }}>

                            {/* header */}
                            <Header type="h5" style={{ textAlign: 'center', textTransform: 'none' }}>{question.description}</Header>

                            {/* note input */}
                            <View style={{ marginTop: units.unit4 }}>
                                <Input
                                    multiline
                                    numberOfLines={5}
                                    value={note}
                                    onChange={(value) => this.setState({ note: value })}
                                    placeholder="Captains log..."
                                    label="Note"
                                />
                            </View>

                            {/* next button */}
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: units.unit4 }}>
                                <View></View>
                                <Button
                                    small
                                    alignIconRight
                                    text="Next"
                                    disabled={!note}
                                    icon={
                                        <Ionicons
                                            name={'arrow-forward'}
                                            color={colors.purpleB}
                                            size={fonts.h3}
                                        />
                                    }
                                    onPress={() => this.next({
                                        note
                                    })}
                                />
                            </View>

                        </View>
                    </View>
                </SafeAreaView>
            )
        } else {
            return <></>
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

Step6 = connect(mapStateToProps, mapDispatchToProps)(Step6);

export default Step6;

module.exports = Step6;