
import { Alert } from 'react-native';

export function alert(
    message,
    title = 'Uh Oh!',
    onPress = () => { },
    isConfirmPrompt
) {
    let buttons = [
        {
            text: "OK",
            onPress: () => onPress()
        }
    ];

    if(isConfirmPrompt) buttons.push(
        {
            text: "Cancel"
        }
    )

    Alert.alert(
        title,
        message,
        buttons
    );

    return null;
}