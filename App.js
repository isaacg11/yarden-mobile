import 'react-native-gesture-handler';
import React from 'react';
import { Text, View } from 'react-native';
import { Provider } from 'react-redux';
import store from './config/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Mark from './components/app/branding/Mark';
import Register from './screens/Register';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import Splash from './screens/Splash';
import Schedule from './screens/Schedule';
import Confirm from './screens/Confirm';
import Welcome from './screens/Welcome';
import PasswordReset from './screens/PasswordReset';
import PasswordConfirm from './screens/PasswordConfirm';
import OrderDetails from './screens/OrderDetails';
import ChangeDate from './screens/ChangeDate';
import Logout from './screens/Logout';
import ChangeSettings from './screens/ChangeSettings';
import QuoteDetails from './screens/QuoteDetails';
import Checkout from './screens/Checkout';
import Garden from './screens/Garden';
import Approved from './screens/Approved';
import Enrollment from './screens/Enrollment';
import ChangeOrderDetails from './screens/ChangeOrderDetails';
import ChangePlan from './screens/ChangePlan';
import Message from './screens/Message';
import RequestQuoteChange from './screens/RequestQuoteChange';
import RequestOrderChange from './screens/RequestOrderChange';
import ChangesRequested from './screens/ChangesRequested';
import Products from './screens/Products';
import Product from './screens/Product';
import Cart from './screens/Cart';
import PurchaseDetails from './screens/PurchaseDetails';
import Purchases from './screens/Purchases';
import Plants from './screens/Plants';
import ReferralHistory from './screens/ReferralHistory';
import units from './components/styles/units';
import colors from './components/styles/colors';

// app navigation config
const Stack = createNativeStackNavigator();

// display config
const displayNone = () => {
  return <Text></Text>;
};

// format deep linking config
const config = {
  screens: {
    PasswordConfirm: 'password-confirm/:userId',
  },
};

// set linking prefixes
const linking = {
  prefixes: ['https://yarden.com', 'yarden://'],
  config,
};

// set header logo
const logo = <Mark size={units.unit5} />;

const appHeaderStyle = {
  backgroundColor: colors.purpleB
};

const appHeaderTint = 'white';

// set app theme (AFTER V1 RELEASE; Note: There is an issue with the transition when updating background color)
// const AppTheme = {
//   dark: false,
//   colors: {
//     background: colors.greenC5,
//     card: colors.greenC5,
//   }
// };

// main app render
function App() {
  return (
    <Provider store={store}>
      <NavigationContainer linking={linking}>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{
              headerLeft: displayNone,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerLeft: displayNone,
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{
              headerLeft: displayNone,
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Schedule"
            component={Schedule}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Confirm"
            component={Confirm}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{
              headerLeft: displayNone,
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Password Reset"
            component={PasswordReset}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="PasswordConfirm"
            component={PasswordConfirm}
            options={{
              title: 'Password Confirm',
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Order Details"
            component={OrderDetails}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Change Date"
            component={ChangeDate}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Log Out"
            component={Logout}
            options={{
              headerLeft: displayNone,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Change Settings"
            component={ChangeSettings}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Quote Details"
            component={QuoteDetails}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Checkout"
            component={Checkout}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Approved"
            component={Approved}
            options={{
              headerLeft: displayNone,
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Garden"
            component={Garden}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Enrollment"
            component={Enrollment}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Change Order Details"
            component={ChangeOrderDetails}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Change Plan"
            component={ChangePlan}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Message"
            component={Message}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Request Quote Change"
            component={RequestQuoteChange}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Request Order Change"
            component={RequestOrderChange}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Changes Requested"
            component={ChangesRequested}
            options={{
              headerTitle: () => logo,
              headerLeft: displayNone,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Products"
            component={Products}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Product"
            component={Product}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Cart"
            component={Cart}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Purchase Details"
            component={PurchaseDetails}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Purchases"
            component={Purchases}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Plants"
            component={Plants}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
          <Stack.Screen
            name="Referral History"
            component={ReferralHistory}
            options={{
              headerTitle: () => logo,
              headerStyle: appHeaderStyle,
              headerTintColor: appHeaderTint
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
