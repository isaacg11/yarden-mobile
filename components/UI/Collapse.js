// libraries
import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

// UI components
import Paragraph from './Paragraph';
import colors from '../styles/colors';

// styles
import units from '../../components/styles/units';
import fonts from '../styles/fonts';

class Collapse extends Component {
  state = {};

  componentDidMount() {
    if (this.props.open) {
      this.setState({ isOpen: true });
    }
  }

  componentDidUpdate(prevProps) {

    // NOTE: this check is specifically for the case when a gardener substitutes a plant. Without it, the UI checkboxes don't update properly
    // Author: Isaac G. 5/1/23
    if(prevProps.plantList !== this.props.plantList) {
      this.setState({ isOpen: false }, () => {
        this.setState({ isOpen: true })
      });
    }
  }

  render() {
    const {
      title = 'View Details',
      content,
      icon,
      icon2,
    } = this.props;

    const { isOpen } = this.state;

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
        <TouchableOpacity onPress={() => this.setState({ isOpen: !isOpen })}>
          <View
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {(icon) && (
              <View>{icon}</View>
            )}
            {(icon2) && (
              <View>{icon2}</View>
            )}
            <Paragraph style={{ color: colors.greenD75, fontSize: fonts.h3 }}>
              {title}
            </Paragraph>
            <Ionicons
              name={`caret-${isOpen ? 'up' : 'down'}`}
              size={fonts.h2}
              style={{ alignSelf: 'center' }}
              color={colors.purpleB}
            />
          </View>
        </TouchableOpacity>
        {isOpen && <View>{content}</View>}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
      plantList: state.plantList
  };
}

Collapse = connect(mapStateToProps, null)(Collapse);

export default Collapse;

module.exports = Collapse;
