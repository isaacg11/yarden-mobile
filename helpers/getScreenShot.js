import { captureScreen } from 'react-native-view-shot';

export default async function getScreenShot() {
    const uri = await captureScreen({
        format: 'png',
    })

    return uri;
}