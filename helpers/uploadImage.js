import { RNS3 } from 'react-native-aws3';
import config from '../config/index';

export default async function uploadImage(image, name, type = 'jpg') {

    // Create a random unique identifier for the file so there are no duplicate file names
    const uid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // set file name and type
    const fileName = `${uid}-${name}`;
    const fileType = `image/${type}`;

    // format file info
    const file = {
        uri: image,
        name: fileName,
        type: fileType
    }

    // setup s3 config
    const options = {
        bucket: config.s3Bucket,
        region: config.s3Region,
        accessKey: config.s3AccessKeyId,
        secretKey: config.s3SecretAccessKey,
        successActionStatus: 201
    }

    // save image
    const response = await RNS3.put(file, options);

    // if success, return response
    if (response.status === 201) {
        return response.body.postResponse.location;
    }

    // if failed, return null
    return false;
}