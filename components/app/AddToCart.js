import React, {Component} from 'react';
import {View, Modal, ScrollView, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../UI/Button';
import Paragraph from '../UI/Paragraph';
import capitalize from '../../helpers/capitalize';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import units from '../styles/units';
import ratio from '../styles/ratio';

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
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    height: '100%',
                  }}>
                  <View>
                    {/* header view */}
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        overflow: 'visible',
                      }}>
                      <Paragraph
                        style={{
                          fontSize: fonts.h3,
                          marginBottom: units.unit4,
                          marginTop: units.unit3,
                          display: 'flex',
                          justifyContent: 'center',
                        }}>
                        Item{qty > 1 ? 's' : ''} added to cart!
                      </Paragraph>
                      <Ionicons
                        name="checkmark"
                        size={units.unit5}
                        color={colors.purpleB}
                      />
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
                        style={{width: '100%', flex: 1}}
                      />
                      <Paragraph
                        style={{
                          flex: 1,
                          marginTop: units.unit3,
                          lineHeight: fonts.h2,
                          fontSize: fonts.h3,
                        }}>
                        ({qty}) {capitalize(product.name)} -{' '}
                        {capitalize(product.description)}
                      </Paragraph>
                    </View>
                  </View>

                  {/* buttons view */}
                  <View style={{overflow: 'visible', marginTop: units.unit6}}>
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
