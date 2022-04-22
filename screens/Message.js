import React, {Component} from 'react';
import {SafeAreaView, View} from 'react-native';
import Messenger from '../components/app/Messenger';
import Header from '../components/UI/Header';
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class Message extends Component {
  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: colors.greenD5,
        }}>
        <View style={{flex: 1}}>
          {/* messenger */}
          <Messenger conversationId={this.props.route.params.conversationId} />
        </View>
      </SafeAreaView>
    );
  }
}

module.exports = Message;
