
import React, { Component } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/UI/Header';
import Button from '../components/UI/Button';
import Paragraph from '../components/UI/Paragraph';
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';

class LearnMore extends Component {

    state = {
        step: 1
    }

    next() {
        this.setState({ step: this.state.step + 1 });
    }

    back() {
        this.setState({ step: this.state.step - 1 });
    }

    renderSteps(step) {
        switch (step) {
            case 1:
                return (
                    <View>
                        <Header
                            style={{
                                ...fonts.header,
                                paddingTop: units.unit5,
                                paddingBottom: units.unit4,
                                textAlign: 'center'
                            }}>
                            GROW.
                        </Header>
                        <Paragraph style={{textAlign: 'center'}}>
                            Take the hassle out of gardening - Yarden's expert gardeners will maintain your garden for you, including weed abatement, pest control, harvesting, and more!
                        </Paragraph>
                    </View>
                )
            case 2:
                return (
                    <View>
                        <Header
                            style={{
                                ...fonts.header,
                                paddingTop: units.unit5,
                                paddingBottom: units.unit4,
                                textAlign: 'center'
                            }}>
                            EAT.
                        </Header>
                        <Paragraph style={{textAlign: 'center'}}>
                            Enjoy fresh produce, delivered straight to your front door! With over 100 vareties of vegetables, herbs, and fruit - Yarden will grow the garden that is right for you.
                        </Paragraph>
                    </View>
                )
            case 3:
                return (
                    <View>
                        <Header
                            style={{
                                ...fonts.header,
                                paddingTop: units.unit5,
                                paddingBottom: units.unit4,
                                textAlign: 'center'
                            }}>
                            REPEAT.
                        </Header>
                        <Paragraph style={{textAlign: 'center'}}>
                            Each time a plant is harvested, Yarden will replace it with another one - keeping your garden growing strong all year long!
                        </Paragraph>
                    </View>
                )
            default:
                return (
                    <View>
                        <Header
                            style={{
                                ...fonts.header,
                                paddingTop: units.unit5,
                                paddingBottom: units.unit4,
                                textAlign: 'center'
                            }}>
                            GROW.
                        </Header>
                    </View>
                )
        }
    }

    render() {

        const {
            step
        } = this.state;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
                backgroundColor: 'white',
            }}>
                <View style={{ padding: units.unit3 + units.unit4, height: '100%' }}>

                    {/* steps */}
                    {this.renderSteps(step)}

                    {/* buttons */}
                    <View style={{
                        overflow: 'visible',
                        position: 'absolute',
                        width: '100%',
                        bottom: 0,
                        transform: [{ translateX: units.unit4 + units.unit3 }],
                    }}>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Button
                                onPress={() => this.back()}
                                disabled={step < 2}
                                variant="btn2"
                                text=""
                                icon={
                                    <Ionicons
                                        name="arrow-back-outline"
                                        color={colors.purpleB}
                                        size={fonts.h3}
                                    />
                                }>
                            </Button>
                            {(step === 3) ? (
                                <Button
                                    onPress={() => this.props.navigation.navigate('Register')}
                                    text="Sign Up">
                                </Button>
                            ) : (
                                <Button
                                    onPress={() => this.next()}
                                    variant="btn2"
                                    text=""
                                    icon={
                                        <Ionicons
                                            name="arrow-forward-outline"
                                            color={colors.purpleB}
                                            size={fonts.h3}
                                        />
                                    }>
                                </Button>
                            )}
                            
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

module.exports = LearnMore;