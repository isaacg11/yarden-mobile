import React, {Component} from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import colors from '../styles/colors';
import units from '../styles/units';
import fonts from '../styles/fonts';
import {StyleSheet} from 'react-native';
import Mark from '../../components/app/branding/Mark';

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: colors.purpleB,
    fontSize: fonts.h1,
    fontFamily: fonts.default,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: fonts.h3,
    textAlign: 'center',
    margin: 0,
  },
  instructions: {
    textAlign: 'center',
    color: colors.purpleB,
    marginBottom: 0,
  },
});

class LoadingIndicator extends Component {
  render() {
    const {loading, message = 'Loading...'} = this.props;

    return (
      <Spinner
        visible={loading}
        textContent={message}
        textStyle={styles.spinnerTextStyle}
        overlayColor={'white'}
        color={colors.green0}
        customIndicator={<Mark size={units.unit7} />}
      />
    );
  }
}

module.exports = LoadingIndicator;
