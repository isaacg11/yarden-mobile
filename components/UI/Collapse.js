import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Paragraph from './Paragraph';
import colors from '../styles/colors';
import units from '../../components/styles/units';

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
      <View style={{backgroundColor: '#fff', padding: units.unit5, borderRadius: 5}}>
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
            <Paragraph style={{fontWeight: 'bold'}}>{title}</Paragraph>
            <Ionicons
              name={`caret-${isOpen ? 'up' : 'down'}`}
              size={30}
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
