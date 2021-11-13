
import 'react-native-gesture-handler';
import React from 'react';
import { Text } from 'react-native';
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import ReduxPromise from "redux-promise";
import ReduxThunk from "redux-thunk";
import reducers from "./reducers";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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

// app navigation config
const Stack = createNativeStackNavigator();

// redux middleware
const createStoreWithMiddleware = applyMiddleware(ReduxPromise, ReduxThunk)(
  createStore
);

// global state config
const store = createStoreWithMiddleware(reducers);

// display config
const displayNone = () => { return <Text></Text> };

// format deep linking config
const config = {
  screens: {
    PasswordConfirm: 'password-confirm/:userId',
  }
};

// set linking prefixes
const linking = {
  prefixes: ['https://yarden.com', 'yarden://'],
  config,
};

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
              headerLeft: displayNone
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerLeft: displayNone
            }}
          />
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{
              headerLeft: displayNone,
              headerShown: false
            }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
          />
          <Stack.Screen
            name="Schedule"
            component={Schedule}
          />
          <Stack.Screen
            name="Confirm"
            component={Confirm}
          />
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{
              headerLeft: displayNone
            }}
          />
          <Stack.Screen
            name="Password Reset"
            component={PasswordReset}
          />
          <Stack.Screen
            name="PasswordConfirm"
            component={PasswordConfirm}
            options={{
              title: 'Password Confirm'
            }}
          />
          <Stack.Screen
            name="Order Details"
            component={OrderDetails}
          />
          <Stack.Screen
            name="Change Date"
            component={ChangeDate}
          />
          <Stack.Screen
            name="Log Out"
            component={Logout}
            options={{
              headerLeft: displayNone
            }}
          />
          <Stack.Screen
            name="Change Settings"
            component={ChangeSettings}
          />
          <Stack.Screen
            name="Quote Details"
            component={QuoteDetails}
          />
          <Stack.Screen
            name="Checkout"
            component={Checkout}
          />
          <Stack.Screen
            name="Approved"
            component={Approved}
            options={{
              headerLeft: displayNone
            }}
          />
          <Stack.Screen
            name="Garden"
            component={Garden}
          />
          <Stack.Screen
            name="Enrollment"
            component={Enrollment}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
