// libraries
import React, { Component } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Header from '../components/UI/Header';
import Paragraph from '../components/UI/Paragraph';
import Button from '../components/UI/Button';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';

class PlantsSelected extends Component {

    render() {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    width: '100%',
                }}>
                <View
                    style={{
                        padding: units.unit3 + units.unit4,
                        flex: 1,
                        justifyContent: 'space-between',
                    }}>
                    <Header
                        style={{
                            marginBottom: units.unit4,
                            textAlign: 'center',
                            fontSize: fonts.h1,
                            lineHeight: fonts.h1 + fonts.h1 / 3,
                        }}>
                        Success!
                    </Header>
                    <View>
                        <Text
                            style={{
                                fontSize: fonts.h1,
                                textAlign: 'center',
                                color: colors.purpleB,
                            }}>
                            ٩( ᐛ )و
                        </Text>
                        <Paragraph
                            style={{
                                textAlign: 'center',
                                fontSize: fonts.h2,
                                color: colors.purpleB,
                            }}>
                            Your new plants have been selected, great job!
                        </Paragraph>
                    </View>
                    <View>
                        <View>
                            <Text
                                style={{
                                    fontSize: fonts.h3,
                                    color: colors.greenD75,
                                    lineHeight: fonts.h2,
                                }}>
                                What happens next?
                            </Text>
                            <Text style={{ color: colors.greenD75 }}>
                                1. On the date of service, Yarden will send a team member to rotate out your current plants for new ones.
                            </Text>
                            <Text style={{ color: colors.greenD75, marginTop: units.unit5 }}>
                                2. In the meantime, service will continue as normally scheduled until the date of the crop rotation.
                            </Text>
                            <Text style={{ color: colors.greenD75, marginTop: units.unit5 }}>
                                3. Once planted, your garden map will update to reflect the changes in your garden.
                            </Text>
                        </View>
                        <View style={{ marginTop: units.unit5 }}>
                            <Button
                                alignIconRight
                                text="Continue to dashboard"
                                onPress={() => this.props.navigation.navigate('Dashboard')}
                                icon={
                                    <Ionicons
                                        name="arrow-forward-outline"
                                        size={units.unit4}
                                        color={colors.purpleB}
                                    />
                                }
                            />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

module.exports = PlantsSelected;
