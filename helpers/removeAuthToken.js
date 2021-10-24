import AsyncStorage from '@react-native-async-storage/async-storage';

export default function removeAuthToken() {
    AsyncStorage.removeItem(`auth-token`);
    AsyncStorage.removeItem(`auth-token-exp`);
}