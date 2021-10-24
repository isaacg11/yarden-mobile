import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function getAuthToken() {
    let authToken = await AsyncStorage.getItem(`auth-token`);
    return authToken;
}