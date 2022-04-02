import React, { Component } from 'react';
import { View, Modal, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../UI/Button';
import Divider from '../UI/Divider';
import Paragraph from '../UI/Paragraph';
import capitalize from '../../helpers/capitalize';

class AddToCart extends Component {

    state = {}

    render() {
        const {
            isOpen = false,
            onViewCart,
            close,
            product,
            qty
        } = this.props;

        return (
            <View>

                {/* add to cart modal start */}
                <Modal
                    animationType="slide"
                    visible={isOpen}
                    presentationStyle="fullScreen"
                >
                    <View style={{ marginTop: 50 }}>
                        <View style={{ padding: 12 }}>
                            <ScrollView>
                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Paragraph style={{ fontSize: 25, marginBottom: 25, marginTop: 12 }}>Item{(qty > 1) ? 's' : ''} added to cart!</Paragraph>
                                    <Ionicons name="checkmark" size={50} color="#4d991a" />
                                </View>
                                <Divider />
                                <View style={{ display: 'flex', flexDirection: 'row', height: 100, marginTop: 12, marginBottom: 12 }}>
                                    <Image source={{ uri: product.image }} style={{ width: '100%' }} style={{ flex: 1 }} />
                                    <Paragraph style={{ flex: 3, marginLeft: 12 }}>({qty}) {capitalize(product.name)} - {capitalize(product.description)}</Paragraph>
                                </View>
                                <View>
                                    <Button
                                        text="View Cart"
                                        onPress={() => {
                                            // close modal
                                            close()

                                            // navigate user to cart
                                            onViewCart();
                                        }}
                                        variant="primary"
                                    />
                                    <View style={{marginBottom: 12}}>
                                        <Button
                                            text="Close"
                                            onPress={() => close()}
                                            variant="secondary"
                                        />
                                    </View>
                                    <Divider />
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
                {/* add to cart modal end */}

            </View>

        )
    }
}

module.exports = AddToCart;