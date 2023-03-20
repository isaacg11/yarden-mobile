// libraries
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import RNQRGenerator from 'rn-qr-generator';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Mark from '../components/app/branding/Mark';
import BottomTabNavigator from '../components/app/BottomTabNavigator';
import NavMenu from '../components/app/NavMenu';

// helpers
import { APP_URL } from '../helpers/getUrl';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';
import types from '../vars/types';

const Drawer = createDrawerNavigator();

class Dashboard extends Component {

  state = {
    qrCode: null
  };

  async componentDidMount() {
    // generate QR code
    const QR = await RNQRGenerator.generate({
      value: `${APP_URL}/referral?refId=${this.props.user._id}`,
      height: 100,
      width: 100,
      base64: true,
    });

    // set base64 format
    const qr = `data:image/png;base64,${QR.base64}`;

    // update UI
    this.setState({
      qrCode: qr,
    });
  }

  render() {
    const { qrCode, navMenuIsOpen } = this.state;
    const { user } = this.props;

    if (navMenuIsOpen) {
      return (
        <NavMenu
          isOpen={navMenuIsOpen}
          close={(route) => {
            const params = (route === 'Referrals') ? { qrCode } : {};
            this.props.navigation.navigate(route, params);
            this.setState({ navMenuIsOpen: false });
          }}
        />
      )
    }

    // validate user QR
    if (user.type === types.CUSTOMER && !qrCode) return null;

    // set header logo
    const logo = <Mark size={units.unit5} />;

    // set header style
    const appHeaderStyle = {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    };

    // set header tint
    const appHeaderTint = colors.purpleB;

    // render dashboard UI
    return (
      <Drawer.Navigator>
        <Drawer.Screen
          name="Home"
          component={BottomTabNavigator}
          options={() => ({
            headerTitle: () => logo,
            headerLeft: () => (
              <TouchableOpacity
                style={{ marginLeft: units.unit4 }}
                onPress={() => this.setState({ navMenuIsOpen: true })}>
                <Ionicons
                  name="menu-outline"
                  size={fonts.h2}
                  color={colors.purpleB}
                />
              </TouchableOpacity>
            ),
            headerStyle: appHeaderStyle,
            headerTintColor: appHeaderTint
          })}
          initialParams={{ qrCode }}
        />
      </Drawer.Navigator>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

Dashboard = connect(mapStateToProps, null)(Dashboard);

export default Dashboard;

module.exports = Dashboard;