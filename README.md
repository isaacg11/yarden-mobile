# yarden-mobile
The official codebase for the Yarden mobile app (iOS only)

## Getting Started
Please note that these instructions only apply to iOS development. To get started, you will need a few items installed on your machine. Please see the list below and install each tool.
- NodeJS
- XCode
- CocoaPods

### Setting up your front end
1. Clone this repository on to your desktop
2. Change directories into `/yarden-mobile`
3. Run `npm start` to install the necessary npm packages
4. Run `cd ios && pods install` to install the neccessary cocoapods modules
5. Run `cd..` to change back to the root directory
6. Run `npx react-native run-ios` to boot up the app in the ios simulator

### Setting up your back end (open in a seperate tab)
1. Open a new tab by pressing CMD + t
2. Change directories into `/yarden-staging`
3. Run `npm start`
4. Open a new tab by pressing CMD + t
5. Run `cd client` to change directories into the client
6. Run `npm start`

## Stack Info
- MongoDB
- Express
- ReactJS
- NodeJS
