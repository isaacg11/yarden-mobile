import { Platform, NativeModules } from 'react-native';
import TEST_FLIGHT from '../config/testflight';

// set initial app url
let appUrl = null;

// check if development
const isDevelopment =
  (typeof __DEV__ !== 'undefined' && __DEV__) ||
  NativeModules.PlatformConstants?.dev;

// check if staging
const isTestFlight = TEST_FLIGHT;

// check if production
const isAppStore =
  !isDevelopment &&
  Platform.OS === 'ios' &&
  !isTestFlight;

// set API base url
if(isDevelopment) appUrl = 'http://localhost:3000';
if(isTestFlight) appUrl = 'https://yarden-staging.herokuapp.com';
if(isAppStore) appUrl = 'https://www.yardengarden.com';

export const APP_URL = appUrl;
export const API_URL = `${APP_URL}/api/v1`;