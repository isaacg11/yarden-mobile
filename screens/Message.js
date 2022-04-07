
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
                <Header type="h4" style={{ textAlign: 'center', marginTop: units.unit6 }}>Messenger</Header>
                <View style={{ padding: units.unit5 }}>

                    {/* messenger */}
                    <Messenger 
                        conversationId={this.props.route.params.conversationId}
                    />

                </View>

            </SafeAreaView>
        )
    }
}

module.exports = Message;