
import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import Messenger from '../components/app/Messenger';
import Header from '../components/UI/Header';
import units from '../components/styles/units';

class Message extends Component {

    render() {

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <View style={{padding: units.unit5}}>
                    <Header type="h4" style={{marginBottom: units.unit4}}>Messenger</Header>

                    {/* messenger */}
                    <Messenger conversationId={this.props.route.params.conversationId} />
                </View>
            </SafeAreaView>
        )
    }
}

module.exports = Message;