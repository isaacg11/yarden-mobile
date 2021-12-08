import React, { Component } from 'react';
import { View, Modal, Image, Text } from 'react-native';
import Link from '../UI/Link';

class ImageDetails extends Component {

    render() {
        const {
            isOpen = false,
            url,
            close
        } = this.props;

        return (
            <View>

                {/* image details modal start */}
                <Modal
                    animationType="slide"
                    visible={isOpen}
                    presentationStyle="fullScreen"
                >
                    <View style={{ marginTop: 50 }}>
                        <View style={{ padding: 12 }}>
                            <Link text="Back" onPress={() => close()} />
                            <Text style={{ fontSize: 25, marginBottom: 25, marginTop: 12 }}>Image Details</Text>
                            <Image
                                source={{ uri: url }}
                                style={{ width: '100%', height: 200 }}
                            />
                        </View>
                    </View>
                </Modal>
                {/* image details modal end */}

            </View>

        )
    }
}

module.exports = ImageDetails;