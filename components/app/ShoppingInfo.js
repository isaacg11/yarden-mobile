import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Badge from '../UI/Badge';
import Paragraph from '../UI/Paragraph';
import { getItems } from '../../actions/items/index';
import units from '../styles/units';
import Card from '../UI/Card';

class ShoppingInfo extends Component {

    state = {
        cartItems: []
    }

    componentDidUpdate(prevProps) {
        if(prevProps.items !== this.props.items) {

            // NOTE: Do not remove set timeout, it's necessary for proper rendering
            setTimeout(() => {

                // re-calculate items in cart
                this.calculateTotalItems();
            }, 500)
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
            if(index === this.props.items.length - 1) {
                return total;
            }
        })

        this.setState({cartItems: total})
    }

    render() {

        const {
            onSelectCart,
            onSelectPurchases
        } = this.props;

        const {
            cartItems
        } = this.state;

        return (
            <Card>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Paragraph style={{marginBottom: units.unit5}}>CART</Paragraph>
                        <TouchableOpacity onPress={() => onSelectCart()}>
                            {cartItems > 0 ? (<Badge icon={<Ionicons name="cart-outline" size={40} />} count={cartItems} />) : <Ionicons name="cart-outline" size={40} />}
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', borderLeftWidth: 1, borderLeftColor: '#ddd' }}>
                        <Paragraph style={{marginBottom: units.unit5}}>PURCHASES</Paragraph>
                        <TouchableOpacity onPress={() => onSelectPurchases()}>
                            <Ionicons name="receipt-outline" size={40} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Card>
        )
    }
}

function mapStateToProps(state) {
    return {
        items: state.items
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getItems
    }, dispatch)
}


ShoppingInfo = connect(mapStateToProps, mapDispatchToProps)(ShoppingInfo);

export default ShoppingInfo;

module.exports = ShoppingInfo;