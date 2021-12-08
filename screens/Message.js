
import React, { Component } from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import Messenger from '../components/app/Messenger';

class Message extends Component {

    render() {

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25 }}>Messenger</Text>
                <View style={{ padding: 12 }}>

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