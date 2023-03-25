import { Platform, NativeModules } from 'react-native';
import TEST_FLIGHT from '../config/testflight';
import LOCAL_DEVICE from '../config/local-device';

// check if local device
const isLocalDevice = LOCAL_DEVICE;

// check if development (simulator)
const isDevelopment =
  (typeof __DEV__ !== 'undefined' && __DEV__) ||
  NativeModules.PlatformConstants?.dev

// check if staging
const isTestFlight = TEST_FLIGHT;

// check if production
const isAppStore =
  !isDevelopment &&
  !isTestFlight &&
  Platform.OS === 'ios'

// set initial app url
let appUrl = null;

// set API base url
if (isDevelopment) {
  appUrl = 'http://localhost:3000';
} else if (isTestFlight || isLocalDevice) {
  appUrl = 'https://yarden-staging.herokuapp.com';
} else if (isAppStore) {
  appUrl = 'https://www.yardengarden.com';
}

export const APP_URL = appUrl;
export const API_URL = `${APP_URL}/api/v1`;