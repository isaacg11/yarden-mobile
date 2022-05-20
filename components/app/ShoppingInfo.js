import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Badge from '../UI/Badge';
import Label from '../UI/Label';
import {getItems} from '../../actions/items/index';
import Card from '../UI/Card';
import colors from '../styles/colors';

class ShoppingInfo extends Component {
  state = {
    cartItems: [],
  };

  componentDidUpdate(prevProps) {
    if (prevProps.items !== this.props.items) {
      // NOTE: Do not remove set timeout, it's necessary for proper rendering
      setTimeout(() => {
        // re-calculate items in cart
        this.calculateTotalItems();
      }, 500);
    }
  }

  componentDidMount() {
    // get items in cart
    this.props.getItems();
  }

  calculateTotalItems() {
    let total = 0;
    this.props.items.forEach((item, index) => {
      total += item.product.variants.length;
      if (index === this.props.items.length - 1) {
        return total;
      }
    });

    this.setState({cartItems: total});
  }

  render() {
    const {onSelectCart, onSelectPurchases} = this.props;

    const {cartItems} = this.state;

    return (
      <Card>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity onPress={() => onSelectCart()}>
              {cartItems > 0 ? (
                <Badge
                  icon={<Ionicons name="cart-outline" size={40} />}
                  count={cartItems}
                />
              ) : (
                <Ionicons
                  name="cart-outline"
                  size={40}
                  color={colors.purpleB}
                />
              )}
            </TouchableOpacity>
            <Label>Cart</Label>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              borderLeftWidth: 1,
              borderLeftColor: '#ddd',
              justifyContent: 'center',
            }}>
            <TouchableOpacity onPress={() => onSelectPurchases()}>
              <Ionicons name="receipt-outline" size={40} color={colors.purpleB} />
            </TouchableOpacity>
            <Label>Purchases</Label>
          </View>
        </View>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    items: state.items,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems,
    },
    dispatch,
  );
}

ShoppingInfo = connect(mapStateToProps, mapDispatchToProps)(ShoppingInfo);

export default ShoppingInfo;

module.exports = ShoppingInfo;
