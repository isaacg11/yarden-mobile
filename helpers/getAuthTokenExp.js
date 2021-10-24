import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function getAuthToken() {
    let authTokenExp = await AsyncStorage.getItem(`auth-token-exp`);
    return authTokenExp;
}