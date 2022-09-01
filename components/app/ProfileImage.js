import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TouchableOpacity, Image, View, Text, ActivityIndicator } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Card from '../UI/Card';
import Paragraph from '../UI/Paragraph';
import fonts from '../../components/styles/fonts';
import colors from '../../components/styles/colors';
import uploadImage from '../../helpers/uploadImage';
import units from '../styles/units';

class ProfileImage extends Component {

    state = {}

    async selectImage() {
        // open image gallery
        launchImageLibrary(
            {
                selectionLimit: 1,
                maxWidth: 500,
                maxHeight: 500,
                quality: 1,
            },
            res => {
                // if user selected an image {...}
                if (!res.didCancel) {
                    this.finish(res);
                }
            },
        );
    }

    async finish(res) {

        // show loading indicator
        this.setState({isLoading: true});

        // upload image to S3
        const selectedImage = await uploadImage(
            res.assets[0].uri,
            'attachment.jpg',
            'jpg',
        );

        // update UI
        this.setState({ 
            selectedImage,
            isLoading: false
        });

        // run callback
        this.props.onSelect(selectedImage);
    }

    render() {

        const { 
            selectedImage,
            isLoading
         } = this.state;
        const { user } = this.props;
        const imageStyle = {
            width: 100,
            height: 100,
            borderRadius: 100,
            borderWidth: 5,
            borderColor: colors.purpleB
        }

        return (
            <Card>
                <TouchableOpacity onPress={() => this.selectImage()}>

                    {/* current profile image */}
                    {(user?.profile_image) && (
                        <Image
                            style={imageStyle}
                            source={{ uri: user.profile_image }}
                            alt="profile"
                        />
                    )}

                    {/* image preview */}
                    {(selectedImage && !isLoading) && (
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <Image
                                style={imageStyle}
                                source={{ uri: selectedImage }}
                                alt="profile"
                            />
                            <View style={{marginLeft: units.unit3}}>
                                <Text>Great job!{'\n'}Your profile photo has been{'\n'}successfully uploaded.</Text>
                            </View>
                        </View>
                    )}

                    {/* loading indicator*/}
                    {(isLoading) && (
                        <View style={{display: 'flex', alignContent: 'center', padding: units.unit5}}>
                            <ActivityIndicator />
                        </View>
                    )}

                    {/* no image */}
                    {(!user?.profile_image && !selectedImage && !isLoading) && (
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View>
                                <Paragraph style={{ marginBottom: units.unit3 }}>Upload Image</Paragraph>
                                <Text style={{ paddingRight: units.unit5 }}>Please upload a clear photo of your face so our customers can identify you</Text>
                            </View>
                            <Ionicons
                                name="cloud-upload-outline"
                                size={fonts.h3}
                                color={colors.purpleB}
                            />
                        </View>
                    )}
                </TouchableOpacity>
            </Card>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        uploadImage
    }, dispatch)
}

ProfileImage = connect(null, mapDispatchToProps)(ProfileImage);

export default ProfileImage;

module.exports = ProfileImage;