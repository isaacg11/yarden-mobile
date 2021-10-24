
import { Alert } from 'react-native';

export function alert(message, title = 'Uh Oh!') {
    Alert.alert(
        title,
        message,
        [
            { 
                text: "OK"
            }
        ]
    );

    return null;
}