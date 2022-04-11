
import React, { Component } from 'react';
import { View, Image } from 'react-native';
import Paragraph from '../UI/Paragraph';
import Card from '../UI/Card';
import units from '../../components/styles/units';

class ImageGrid extends Component {

    render() {
        const { images } = this.props;
        const imageList = images.map((image, index) => (
            <View key={index}>
                <Image
                    style={{
                        width: '100%',
                        height: 200,
                        marginBottom: units.unit5
                    }}
                    source={{
                        uri: image.url
                    }}
                />
            </View>
        ));

        return (
            <Card>
                <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5, marginBottom: units.unit5 }}>Images</Paragraph>
                <View>
                    {(images.length > 0) ? imageList : <View><Paragraph style={{textAlign: 'center', marginTop: units.unit6, marginBottom: units.unit6}}>No images found</Paragraph></View>}
                </View>
            </Card>
        )
    }
}

module.exports = ImageGrid;