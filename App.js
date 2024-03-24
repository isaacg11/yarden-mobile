// libraries
import 'react-native-gesture-handler';
import React from 'react';
import { Text, View } from 'react-native';
import { Provider } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Sentry from "@sentry/react-native";

// global state
import store from './config/store';

// helpers
import ErrorBoundary from './components/app/ErrorBoundary';
import Mark from './components/app/branding/Mark';

// screens
import Splash from './screens/Splash';
import Register from './screens/Register';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import Schedule from './screens/Schedule';
import Confirm from './screens/Confirm';
import Welcome from './screens/Welcome';
import PasswordReset from './screens/PasswordReset';
import PasswordConfirm from './screens/PasswordConfirm';
import OrderDetails from './screens/OrderDetails';
import ChangeDate from './screens/ChangeDate';
import Logout from './screens/Logout';
import ChangeSettings from './screens/ChangeSettings';
import Settings from './screens/Settings';
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
import ReferralHistory from './screens/ReferralHistory';
import LearnMore from './screens/LearnMore';
import AccountType from './screens/AccountType';
import Application from './screens/Application';
import Submit from './screens/Submit';
import AccountPending from './screens/AccountPending';
import AccountActivation from './screens/AccountActivation';
import Beds from './screens/Beds';
import Bed from './screens/Bed';
import Planted from './screens/Planted';
import Substitution from './screens/Substitution';
import ImageUpload from './screens/ImageUpload';
import OrderComplete from './screens/OrderComplete';
import Step1 from './screens/service_reporting/Step1';
import Step2 from './screens/service_reporting/Step2';
import Step3 from './screens/service_reporting/Step3';
import Step4 from './screens/service_reporting/Step4';
import Step5 from './screens/service_reporting/Step5';
import Step6 from './screens/service_reporting/Step6';
import Notes from './screens/Notes';
import NeemOil from './screens/NeemOil';
import WateringSchedule from './screens/WateringSchedule';
import HarvestInstructions from './screens/HarvestInstructions';
import Referrals from './screens/Referrals';
import Subscription from './screens/Subscription';
import ReminderDetails from './screens/ReminderDetails';
import PlantsSelected from './screens/PlantsSelected';
import NewBeds from './screens/NewBeds';
import BedPlants from './screens/BedPlants';
import PlantSelectionType from './screens/PlantSelectionType';
import PlantsConfirmation from './screens/PlantsConfirmation';
import Plants from './screens/Plants';

// UI components
import Link from './components/UI/Link';

// types
import types from './vars/types';

// styles
import units from './components/styles/units';
import colors from './components/styles/colors';
import fonts from './components/styles/fonts';

// error reporting
Sentry.init({
  dsn: 'https://ac125a88d07a40be9ca8dc38d13d8bb9@o160258.ingest.sentry.io/6455224',
  enableNative: false
});

// app navigation config
const Stack = createStackNavigator();

// format deep linking config
const config = {
  screens: {
    PasswordConfirm: 'password-confirm/:userId',
    AccountActivation: 'account-activation/:applicationId',
    Splash: 'splash'
  }
};

// set linking prefixes
const linking = {
  prefixes: ['https://yarden.com', 'yarden://'],
  config,
};

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

// set app theme (AFTER V1 RELEASE; Note: There is an issue with the transition when updating background color)
const AppTheme = {
  dark: false,
  colors: {
    background: 'white',
    card: 'white',
  }
};

const displayNone = () => {
  return <Text></Text>;
};

function renderBackButton(nav) {
  const state = store.getState();
  let redirect = () => nav.navigation.goBack();

  // if maintenance order {...}
  if (state.selectedOrder.type === types.FULL_PLAN || state.selectedOrder.type === types.FULL_PLAN) {

    // if service report is for dead plants {...}
    if (nav.route.params.serviceReport === types.DEAD_PLANTS) {

      // set redirect to step 1
      redirect = () => nav.navigation.navigate('Step 1');
    } else if (nav.route.params.serviceReport === types.HARVESTED_PLANTS) { // if service report is for dead plants {...}

      // set redirect to step 2
      redirect = () => nav.navigation.navigate('Step 2');
    }
  }

  return (
    <Link
      icon={
        <Ionicons
          name="chevron-back"
          size={fonts.h3}
          color={colors.purpleB}
        />
      }
      text={'Back'}
      onPress={() => redirect()}
    />
  )
}

function renderListButton(nav) {
  return (
    <View style={{ marginRight: units.unit3 }}>
      <Link
        icon={
          <Ionicons
            name="list-outline"
            size={fonts.h2}
            color={colors.purpleB}
          />
        }
        text={''}
        onPress={() => nav.navigation.navigate('Bed Plants', { bed: nav.route.params.bed })}
      />
    </View>
  )
}

// main app render
function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <NavigationContainer linking={linking} theme={AppTheme}>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen
              name="Splash"
              component={Splash}
              options={{
                headerLeft: displayNone,
                headerTitle: displayNone,
                headerStyle: appHeaderStyle,
                headerShadowVisible: false,
                headerTintColor: appHeaderTint,
              }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                headerLeft: displayNone,
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerShadowVisible: false,
                headerTintColor: appHeaderTint,
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
                headerShadowVisible: false,
                headerTintColor: appHeaderTint,
              }}
            />
            <Stack.Screen
              name="Schedule"
              component={Schedule}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Confirm"
              component={Confirm}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Welcome"
              component={Welcome}
              options={{
                headerLeft: displayNone,
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Password Reset"
              component={PasswordReset}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="PasswordConfirm" // name must have no spaces for deep linking to work
              component={PasswordConfirm}
              options={{
                title: 'Password Confirm',
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Order Details"
              component={OrderDetails}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Change Date"
              component={ChangeDate}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Log Out"
              component={Logout}
              options={{
                headerTitle: displayNone,
                headerLeft: displayNone,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Settings"
              component={Settings}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Change Settings"
              component={ChangeSettings}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Referrals"
              component={Referrals}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint
              }}
            />
            <Stack.Screen
              name="Subscription"
              component={Subscription}
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
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Checkout"
              component={Checkout}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Approved"
              component={Approved}
              options={{
                headerLeft: displayNone,
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Garden"
              component={Garden}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Enrollment"
              component={Enrollment}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Change Order Details"
              component={ChangeOrderDetails}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Change Plan"
              component={ChangePlan}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Message"
              component={Message}
              options={(navigation) => ({
                headerLeft: () => renderBackButton(navigation),
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              })}
            />
            <Stack.Screen
              name="Request Quote Change"
              component={RequestQuoteChange}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerShadowVisible: false,
                headerTintColor: appHeaderTint,
              }}
            />
            <Stack.Screen
              name="Request Order Change"
              component={RequestOrderChange}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Changes Requested"
              component={ChangesRequested}
              options={{
                headerTitle: () => logo,
                headerLeft: displayNone,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Products"
              component={Products}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Product"
              component={Product}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Cart"
              component={Cart}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Purchase Details"
              component={PurchaseDetails}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Purchases"
              component={Purchases}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Referral History"
              component={ReferralHistory}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Learn More"
              component={LearnMore}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Account Type"
              component={AccountType}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Application"
              component={Application}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Submit"
              component={Submit}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Account Pending"
              component={AccountPending}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="AccountActivation" // name must have no spaces for deep linking to work
              component={AccountActivation}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Beds"
              component={Beds}
              options={(navigation) => ({
                headerLeft: () => renderBackButton(navigation),
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              })}
            />
            <Stack.Screen
              name="Bed"
              component={Bed}
              options={(navigation) => ({
                headerRight: () => renderListButton(navigation),
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              })}
            />
            <Stack.Screen
              name="Planted"
              component={Planted}
              options={{
                headerLeft: displayNone,
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Substitution"
              component={Substitution}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Image Upload"
              component={ImageUpload}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Order Complete"
              component={OrderComplete}
              options={{
                headerLeft: displayNone,
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Step 1"
              component={Step1}
              options={(nav) => ({
                headerLeft: () => (
                  <Link
                    icon={
                      <Ionicons
                        name="chevron-back"
                        size={fonts.h3}
                        color={colors.purpleB}
                      />
                    }
                    text={'Back'}
                    onPress={() => {
                      const state = store.getState();
                      nav.navigation.navigate('Order Details', state.selectedOrder);
                    }}
                  />
                ),
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              })}
            />
            <Stack.Screen
              name="Step 2"
              component={Step2}
              options={(nav) => ({
                headerLeft: () => (
                  <Link
                    icon={
                      <Ionicons
                        name="chevron-back"
                        size={fonts.h3}
                        color={colors.purpleB}
                      />
                    }
                    text={'Back'}
                    onPress={() => nav.navigation.navigate('Step 1')}
                  />
                ),
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              })}
            />
            <Stack.Screen
              name="Step 3"
              component={Step3}
              options={(nav) => ({
                headerLeft: () => (
                  <Link
                    icon={
                      <Ionicons
                        name="chevron-back"
                        size={fonts.h3}
                        color={colors.purpleB}
                      />
                    }
                    text={'Back'}
                    onPress={() => nav.navigation.navigate('Step 2')}
                  />
                ),
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              })}
            />
            <Stack.Screen
              name="Step 4"
              component={Step4}
              options={(nav) => ({
                headerLeft: () => (
                  <Link
                    icon={
                      <Ionicons
                        name="chevron-back"
                        size={fonts.h3}
                        color={colors.purpleB}
                      />
                    }
                    text={'Back'}
                    onPress={() => nav.navigation.navigate('Step 3')}
                  />
                ),
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              })}
            />
            <Stack.Screen
              name="Step 5"
              component={Step5}
              options={(nav) => ({
                headerLeft: () => (
                  <Link
                    icon={
                      <Ionicons
                        name="chevron-back"
                        size={fonts.h3}
                        color={colors.purpleB}
                      />
                    }
                    text={'Back'}
                    onPress={() => {
                      const state = store.getState();
                      if (state.selectedOrder.type === types.INITIAL_PLANTING || state.selectedOrder.type === types.CROP_ROTATION) {
                        nav.navigation.navigate('Order Details', state.selectedOrder);
                      } else {
                        nav.navigation.navigate('Step 4');
                      }
                    }}
                  />
                ),
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              })}
            />
            <Stack.Screen
              name="Step 6"
              component={Step6}
              options={(nav) => ({
                headerLeft: () => (
                  <Link
                    icon={
                      <Ionicons
                        name="chevron-back"
                        size={fonts.h3}
                        color={colors.purpleB}
                      />
                    }
                    text={'Back'}
                    onPress={() => nav.navigation.navigate('Step 5')}
                  />
                ),
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              })}
            />
            <Stack.Screen
              name="Notes"
              component={Notes}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Neem Oil"
              component={NeemOil}
              options={(nav) => ({
                headerLeft: () => (
                  <Link
                    icon={
                      <Ionicons
                        name="chevron-back"
                        size={fonts.h3}
                        color={colors.purpleB}
                      />
                    }
                    text={'Back'}
                    onPress={() => nav.navigation.navigate('Step 4')}
                  />
                ),
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              })}
            />
            <Stack.Screen
              name="Watering Schedule"
              component={WateringSchedule}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Harvest Instructions"
              component={HarvestInstructions}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Reminder Details"
              component={ReminderDetails}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Plants Selected"
              component={PlantsSelected}
              options={{
                headerLeft: displayNone,
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="New Beds"
              component={NewBeds}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Bed Plants"
              component={BedPlants}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Selection Type"
              component={PlantSelectionType}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Confirm Plants"
              component={PlantsConfirmation}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Plants"
              component={Plants}
              options={{
                headerTitle: () => logo,
                headerStyle: appHeaderStyle,
                headerTintColor: appHeaderTint,
                headerShadowVisible: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </ErrorBoundary>
  );
}

export default Sentry.wrap(App);
