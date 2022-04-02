
import React, { Component } from 'react';
import { View, Image } from 'react-native';
import Paragraph from '../UI/Paragraph';

class ImageGrid extends Component {

    render() {
        const { images } = this.props;
        const imageList = images.map((image, index) => (
            <View key={index}>
                <Image
                    style={{
                        width: '100%',
                        height: 200,
                        marginBottom: 12
                    }}
                    source={{
                        uri: image.url
                    }}
                />
            </View>
        ));

        return (
            <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                <Paragraph style={{ fontWeight: 'bold', marginTop: 12, marginBottom: 12 }}>Images</Paragraph>
                <View>
                    {(images.length > 0) ? imageList : <View><Paragraph style={{textAlign: 'center', marginTop: 25, marginBottom: 25}}>No images found</Paragraph></View>}
                </View>
            </View>
        )
    }
}

module.exports = ImageGrid;