import { Platform, NativeModules } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const installerPackageName = DeviceInfo.getInstallerPackageName();

let appUrl = null;

const isDevelopment =
  (typeof __DEV__ !== 'undefined' && __DEV__) ||
  NativeModules.PlatformConstants?.dev;

const isTestFlight = installerPackageName === 'com.apple.TestFlight';

const isAppStore =
  !isDevelopment &&
  Platform.OS === 'ios' &&
  !isTestFlight;

if(isDevelopment) appUrl = 'http://localhost:3000';
if(isTestFlight) appUrl = 'https://yarden-staging.herokuapp.com';
if(isAppStore) appUrl = 'https://www.yardengarden.com';

export const APP_URL = appUrl;
export const API_URL = `${APP_URL}/api/v1`;