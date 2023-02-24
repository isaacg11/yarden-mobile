import React, {Component} from 'react';
import {View, Modal, ScrollView, Image, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../UI/Button';
import Paragraph from '../UI/Paragraph';
import capitalize from '../../helpers/capitalize';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import units from '../styles/units';

class AddToCart extends Component {
  state = {};

  render() {
    const {isOpen = false, onViewCart, close, product, qty} = this.props;

    return (
      <View style={{overflow: 'visible'}}>
        {/* add to cart modal start */}
        <Modal
          animationType="slide"
          visible={isOpen}
          presentationStyle="fullScreen">
          <View style={{marginTop: units.unit5}}>
            <View
              style={{
                padding: units.unit3,
                display: 'flex',
              }}>
              <ScrollView
                style={{
                  overflow: 'visible',
                  flexGrow: 1,
                  height: '100%',
                }}>
                <View>
                  {/* header view */}
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      overflow: 'visible',
                      marginTop: units.unit6,
                    }}>
                    <View
                      style={{
                        backgroundColor: colors.purpleB,
                        height: units.unit6,
                        width: units.unit6,
                        borderRadius: units.unit5,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                      }}>
                      <Ionicons
                        name="checkmark"
                        size={units.unit5}
                        color={colors.green0}
                      />
                    </View>
                    <Paragraph
                      style={{
                        fontSize: fonts.h3,
                        marginBottom: units.unit4,
                        marginTop: units.unit3,
                        display: 'flex',
                        justifyContent: 'center',
                        color: colors.purpleB,
                        fontWeight: 'bold',
                      }}>
                      Item{qty > 1 ? 's' : ''} added to cart!
                    </Paragraph>
                  </View>

                  {/* image and description view */}
                  <View
                    style={{
                      flexDirection: 'column',
                      height: units.unit9,
                      marginTop: units.unit3,
                      marginBottom: units.unit3,
                    }}>
                    <Image
                      source={{uri: product.image}}
                      style={{
                        width: '100%',
                        flex: 1,
                        width: null,
                        height: null,
                        resizeMode: 'contain',
                        marginVertical: units.unit6,
                      }}
                    />
                    <Paragraph
                      style={{
                        flex: 1,
                        lineHeight: fonts.h2,
                        fontSize: fonts.h3,
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: fonts.h2,
                          textAlign: 'center',
                          paddingTop: units.unit4,
                        }}>
                        ({qty}) {capitalize(product.name)}
                      </Text>

                      {'\n'}
                      <Text
                        style={{textAlign: 'center', color: colors.greenD50}}>
                        {capitalize(product.description)}
                      </Text>
                    </Paragraph>
                  </View>
                </View>

                {/* buttons view */}
                <View
                  style={{
                    overflow: 'visible',
                    position: 'absolute',
                    width: '100%',
                    bottom: 0,
                    transform: [{translateY: units.unit6}],
                  }}>
                  <Button
                    text="View Cart"
                    onPress={() => {
                      // close modal
                      close();

                      // navigate user to cart
                      onViewCart();
                    }}
                    variant="button"
                  />
                  <View style={{marginTop: units.unit3}}>
                    <Button
                      text="Close"
                      onPress={() => close()}
                      variant="btn2"
                    />
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
        {/* add to cart modal end */}
      </View>
    );
  }
}

module.exports = AddToCart;
