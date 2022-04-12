import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Paragraph from './Paragraph';
import colors from '../styles/colors';
import units from '../../components/styles/units';
import fonts from '../styles/fonts';

class Collapse extends Component {
  state = {};

  componentDidMount() {
    if (this.props.open) {
      this.setState({isOpen: true});
    }
  }

  render() {
    const {title = 'View Details', content} = this.props;

    const {isOpen} = this.state;

    return (
      <View
        style={{
          backgroundColor: colors.white75,
          width: '100%',
          justifyContent: 'space-between',
          marginBottom: units.unit4,
          shadowColor: colors.greenC10,
          padding: units.unit5,
          borderWidth: 1,
          borderColor: colors.greenC10,
          borderTopColor: 'white',
          borderBottomColor: colors.greenC25,
          borderRadius: units.unit4,
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 1,
          shadowRadius: 8,
          shadowColor: colors.greenC10,
        }}>
        <TouchableOpacity onPress={() => this.setState({isOpen: !isOpen})}>
          <View
            style={{
              display: 'flex',
              flex: 1,
              alignSelf: 'stretch',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Paragraph style={{color: colors.greenD75, fontSize: fonts.h3}}>
              {title}
            </Paragraph>
            <Ionicons
              name={`caret-${isOpen ? 'up' : 'down'}`}
              size={fonts.h2}
              style={{alignSelf: 'flex-end'}}
              color={colors.purpleB}
            />
          </View>
        </TouchableOpacity>
        {isOpen && <View>{content}</View>}
      </View>
    );
  }
}

module.exports = Collapse;
