import React, {Component} from 'react';
import {connect} from 'react-redux';
import RNQRGenerator from 'rn-qr-generator';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Mark from '../components/app/branding/Mark';
import BottomTabNavigator from '../components/app/BottomTabNavigator';
import Referrals from '../screens/Referrals';
import Settings from '../screens/Settings';
import Logout from '../screens/Logout';
import Subscription from '../screens/Subscription';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Paragraph from '../components/UI/Paragraph';
import {APP_URL} from '../helpers/getUrl';
import units from '../components/styles/units';
import colors from '../components/styles/colors';

const Drawer = createDrawerNavigator();

class Dashboard extends Component {
  state = {};

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
    const {qrCode} = this.state;

    // display config
    const displayNone = () => {
      return <Paragraph></Paragraph>;
    };

    // set header logo
    const logo = <Mark size={units.unit5} />;

    const appHeaderStyle = {
      backgroundColor: colors.purpleB
    };

    const appHeaderTint = 'white';

    if (qrCode) {
      return (
        <Drawer.Navigator>
          <Drawer.Screen
            name="Home"
            component={BottomTabNavigator}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Drawer.Screen
            name="Referrals"
            component={Referrals}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
            initialParams={{
              qrCode: qrCode,
            }}
          />
          <Drawer.Screen
            name="Subscription"
            component={Subscription}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Drawer.Screen
            name="Settings"
            component={Settings}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Drawer.Screen
            name="Log Out"
            component={Logout}
            options={{
              headerLeft: displayNone,
              header: displayNone,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
        </Drawer.Navigator>
      );
    } else {
      return <LoadingIndicator isLoading={true} />;
    }
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
