
import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SafeAreaView, Image, View, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { alert } from '../components/UI/SystemAlert';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Paragraph from '../components/UI/Paragraph';
import Header from '../components/UI/Header';
import Card from '../components/UI/Card';
import { getItems } from '../actions/items/index';
import { getRules } from '../actions/rules/index';
import { getIrrigation } from '../actions/irrigation/index';
import capitalize from '../helpers/capitalize';
import truncate from '../helpers/truncate';
import updateCart from '../helpers/updateCart';
import applyProductRules from '../helpers/applyProductRules';
import getProductMeasurements from '../helpers/getProductMeasurements';
import vars from '../vars/index';
import units from '../components/styles/units';

class Cart extends Component {

    state = {
        quotes: []
    }

    componentDidMount() {
        // set quotes
        this.setQuotes();
    }

    async setQuotes() {
        
        // set initial product ids
        let productIds = '';

        // iterate through items in cart
        this.props.items.forEach((item, i) => {

            // add comma to string
            let comma = (i !== this.props.items.length - 1) ? ',' : '';

            // add to list of product ids
            productIds += (item.product._id + comma)
        });

        // get product rules
        await this.props.getRules(`products=${productIds}`);

        // get irrigation items
        await this.props.getIrrigation();

        // set initial quote
        let quotes = [];

        // iterate through items in cart
        this.props.items.forEach((item) => {

            // set product rules
            let productRules = this.props.rules;

            // get rules for product
            const rules = productRules.filter((rule) => rule.product._id === item.product._id);

            // set initial product materials
            let quoteMaterials = [];

            // set initial quote
            let quote = {
                product: item.product,
                status: 'approved',
                type: item.product.service,
                customer: this.props.user._id,
                type: item.product.service.name,
                title: item.product.name,
                description: '',
                line_items: {
                    materials: [],
                    labor: {}
                }
            }

            // set initial labor hours
            let laborHours = 0;

            // set initial combined dimensions
            let combinedDimensions = {
                sqft: 0,
                cf: 0,
                vf: 0,
                lf: 0
            }

            // set initial beds
            let beds = [];

            // iterate through materials
            item.product.variants.forEach((variant, index) => {

                // if delivery, add to quote
                if(variant.line_items.delivery) quote.line_items.delivery = variant.line_items.delivery;

                // add labor hours
                laborHours += (variant.line_items.labor.qty * variant.qty);

                // set check for first iteration
                let firstIteration = index === 0;

                // set check for last iteration
                let lastIteration = index === (item.product.variants.length - 1);

                // set description
                quote.description += `${(firstIteration) ? '' : ' '}(${variant.qty}) ${item.product.name} - ${variant.name}${(lastIteration) ? '' : ','}`;

                const dimensions = getProductMeasurements(variant.dimensions, variant.qty);                
                combinedDimensions.sqft += dimensions.sqft;
                combinedDimensions.cf += dimensions.cf;
                combinedDimensions.vf += dimensions.vf;
                combinedDimensions.lf += dimensions.lf;

                // iterate through materials
                variant.line_items.materials.forEach((material) => {

                    // check if item is already in quote materials list
                    const itemExists = quoteMaterials.find((m) => m._id === material._id);

                    // if no matching item, add to quote materials list
                    if (!itemExists) {
                        if (rules.length > 0) {
                            quoteMaterials.push(material);
                        } else {                            
                            const qty = { qty: variant.qty };
                            const newItem = {
                                ...material,
                                ...qty
                            }                            
                            quoteMaterials.push(newItem);
                        }
                    }
                })

                // if garden bed {...}
                if(item.product.name === 'garden bed') {
                    beds.push({
                        qty: variant.qty,
                        width: variant.dimensions.width,
                        height: variant.dimensions.height,
                        length: variant.dimensions.length
                    })
                }
            })

            // if rules {...}
            if (rules.length > 0) {

                // set quote materials based on product rules
                quoteMaterials = applyProductRules(quoteMaterials, rules, combinedDimensions.sqft, combinedDimensions.cf, combinedDimensions.vf, combinedDimensions.lf);

            }

            // if product is for garden beds {...}
            if(item.product.name === 'garden bed') {

                let materialList = [];

                // remove irrigation items from materials
                quoteMaterials.forEach((material) => {
                    const isIrrigationItem = this.props.irrigation.find((irr) => irr.item._id === material._id);
                    if(!isIrrigationItem) materialList.push(material);
                })

                // set quote materials
                quoteMaterials = materialList;

                // set quote beds
                quote.line_items.beds = beds;
            }

            // set materials
            quote.line_items.materials = quoteMaterials;

            // set labor
            quote.line_items.labor.qty = laborHours;
            quote.line_items.labor.price = vars.labor.rate;
            quote.line_items.labor.name = vars.labor.description;

            // add quote to quotes list
            quotes.push(quote);
        })

        this.setState({ quotes });
    }

    async updateItemQty(product, variant, qty) {

        // show loading indicator
        this.setState({ isLoading: true });

        // set additional qty
        const additionalQty = qty;

        // if new variant qty is zero {...}
        if ((additionalQty + variant.qty) < 1) {

            // if last variant for product, mark to remove product
            const productId = (product.variants.length < 2) ? product._id : false;

            // render confirm prompt
            return this.removeItem(variant._id, productId);
        }

        // update cart
        await updateCart(product._id, variant._id, additionalQty);

        // get updated items in cart
        await this.props.getItems();

        // set quotes
        await this.setQuotes();

        // NOTE: Do not remove set timeout, it's necessary for proper rendering
        setTimeout(() => {

            // hide loading indicator
            this.setState({ isLoading: false });
        }, 500)
    }

    async removeItem(variantId, productId) {

        // hide loading indicator
        this.setState({ isLoading: false });

        // render confirm prompt to remove item from cart
        return alert(
            'Once this action is completed, it cannot be undone',
            'Remove item from cart?',
            async () => {
                // show loading indicator
                this.setState({ isLoading: true });

                // remove item from storage
                await AsyncStorage.removeItem(variantId);

                // if product has been marked for removal, remove item from storage
                if (productId) {
                    await AsyncStorage.removeItem(productId);
                }

                // get updated items in cart
                await this.props.getItems();

                // set quotes
                await this.setQuotes();

                // NOTE: Do not remove set timeout, it's necessary for proper rendering
                setTimeout(() => {

                    // hide loading indicator
                    this.setState({ isLoading: false });
                }, 500)
            },
            true
        );
    }

    goToCheckout() {

        // set params
        const params = JSON.stringify(this.state.quotes)

        // navigate user to product details
        this.props.navigation.navigate('Purchase Details', { quotes: params }); 
        
    }

    getListItems() {

        // set initial list
        let list = [];

        if (this.props.items.length > 0) {
            // iterate through cart items
            for (let i = 0; i < this.props.items.length; i++) {

                // iterate through item variants
                for (let j = 0; j < this.props.items[i].product.variants.length; j++) {

                    // set variant
                    let variant = this.props.items[i].product.variants[j];

                    // set item
                    let item = this.props.items[i];

                    // add item with variant to list
                    list.push({ variant: variant, item: item })
                }

                // if last iteration, return list
                if (i === this.props.items.length - 1) return list;
            }
        } else {
            return list;
        }
    }

    renderItems() {
        // get list items
        const list = this.getListItems();

        // render items
        return list.map((li, index) => (
            <Card key={index} style={{ marginBottom: (index === (list.length - 1)) ? 0 : units.unit5 }}>
                <View style={{ display: 'flex', flexDirection: 'row', height: 100, marginTop: units.unit5, marginBottom: units.unit5 }}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigation.navigate('Product', { product: li.item.product, variant: li.variant })}>
                        <Image source={{ uri: li.variant.image }} style={{ width: '100%', height: '100%' }} />
                    </TouchableOpacity>
                    <View style={{ flex: 3 }}>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <Paragraph style={{ marginLeft: units.unit5, marginRight: units.unit5, flex: 3 }}>{capitalize(li.item.product.name)} - {capitalize(truncate(li.variant.name, 35))}</Paragraph>
                            <TouchableOpacity onPress={async () => {

                                const variantQty = await AsyncStorage.getItem(li.variant._id);

                                const removeQty = (parseInt(variantQty) * -1);

                                this.updateItemQty(li.item.product, li.variant, removeQty);
                            }}>
                                <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginLeft: units.unit5, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ marginRight: units.unit5 }}>
                                <Input
                                    disabled={true}
                                    type="numeric"
                                    value={li.variant.qty.toString()}
                                    placeholder="qty"
                                />
                            </View>
                            <TouchableOpacity onPress={() => this.updateItemQty(li.item.product, li.variant, 1)}>
                                <Ionicons name="add-circle-outline" size={30} color="#737373" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.updateItemQty(li.item.product, li.variant, -1)}>
                                <Ionicons name="remove-circle-outline" size={30} color="#737373" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Card>
        ));
    }

    render() {

        const {
            items,
        } = this.props;

        const {
            isLoading
        } = this.state;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                {/* loading indicator */}
                <LoadingIndicator
                    loading={isLoading}
                />

                {/* items list */}
                <ScrollView>
                    <View style={{ padding: units.unit5 }}>
                        
                        <Header type="h4" style={{ textAlign: 'center', marginTop: units.unit6 }}>Cart</Header>
                        <View style={{ display: (items.length > 0) ? null : 'none' }}>
                            {
                                (!isLoading) ? (
                                    <View>
                                        {this.renderItems()}
                                        <View>
                                            <Button
                                                text="Proceed to Checkout"
                                                onPress={() => this.goToCheckout()}
                                                variant="primary"
                                            />
                                            <Button
                                                text="Back to Dashboard"
                                                onPress={() => this.props.navigation.navigate('Dashboard')}
                                                variant="secondary"
                                            />
                                        </View>
                                    </View>
                                ) : <LoadingIndicator loading={isLoading} />}
                        </View>
                        <View style={{ display: (items.length > 0) ? 'none' : null, padding: units.unit6 }}>
                            <Paragraph style={{ fontWeight: 'bold', textAlign: 'center' }}>No items in cart</Paragraph>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}


function mapStateToProps(state) {
    return {
        items: state.items,
        rules: state.rules,
        user: state.user,
        irrigation: state.irrigation
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getItems,
        getRules,
        getIrrigation
    }, dispatch)
}


Cart = connect(mapStateToProps, mapDispatchToProps)(Cart);

export default Cart;

module.exports = Cart;