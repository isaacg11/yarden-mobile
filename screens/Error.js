
import React, { Component } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/UI/Header';
import Button from '../components/UI/Button';
import Paragraph from '../components/UI/Paragraph';
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class Error extends Component {

    render() {

        const { restart } = this.props;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <View style={{ padding: units.unit3 + units.unit4, position: 'relative', top: '25%' }}>
                    <Text style={{ textAlign: 'center', fontSize: units.unit6 }}>
                        😯
                    </Text>
                    <Header type="h4" style={{ marginBottom: units.unit5, textAlign: 'center' }}>Oh snap!</Header>
                    <View>
                        <Paragraph style={{ marginBottom: units.unit3, textAlign: 'center' }}>Something went wrong...</Paragraph>
                    </View>
                    <View style={{ marginTop: units.unit3 }}>
                        <Button
                            text="Refresh App"
                            onPress={() => restart()}
                            icon={(
                                <Ionicons
                                    name="refresh-outline"
                                    size={units.unit4}
                                    color={colors.purpleB}
                                />
                            )}
                        />
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

module.exports = Error;