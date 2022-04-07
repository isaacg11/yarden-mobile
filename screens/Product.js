
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SafeAreaView, ImageBackground, View } from 'react-native';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Paragraph from '../components/UI/Paragraph';
import AddToCart from '../components/app/AddToCart';
import { getItems } from '../actions/items/index';
import { getRules } from '../actions/rules/index';
import { getIrrigation } from '../actions/irrigation/index';
import capitalize from '../helpers/capitalize';
import updateCart from '../helpers/updateCart';
import applyProductRules from '../helpers/applyProductRules';
import getProductMeasurements from '../helpers/getProductMeasurements';
import calculateMaterials from '../helpers/calculateMaterials';
import calculateLabor from '../helpers/calculateLabor';
import delimit from '../helpers/delimit';
import units from '../components/styles/units';

class Product extends Component {

    state = {
        qty: '1',
        price: 0
    }

    async componentDidMount() {

        // show loading indicator
        this.setState({ isLoading: true });

        // set selected product
        let selectedProduct = this.props.route.params.product;
        let selectedVariant = this.props.route.params.variant;

        // get product rules
        const productRules = await this.props.getRules(`product=${selectedProduct._id}`, true);

        // get irrigation items
        await this.props.getIrrigation();

        // set initial product materials
        let productMaterials = selectedVariant.line_items.materials;

        // if product rules exist for product {...}
        if (productRules.length > 0) {

            // set product measurements
            const productMeasurements = getProductMeasurements(selectedVariant.dimensions, this.state.qty);

            // apply rules to materials, which will calculate the qty of each item
            productMaterials = await applyProductRules(
                selectedVariant.line_items.materials,
                productRules,
                productMeasurements.sqft,
                productMeasurements.cf,
                productMeasurements.vf,
                productMeasurements.lf
            );

        } else {
            // assign qty to material items based on the product qty
            productMaterials.forEach((i) => {
                i.qty = parseInt(this.state.qty);
            })
        }

        // if product is for garden beds {...}
        if (selectedProduct.name === 'garden bed') {
            let materialList = [];

            // remove irrigation items from materials
            productMaterials.forEach((material) => {
                const isIrrigationItem = this.props.irrigation.find((irr) => irr.item._id === material._id);
                if (!isIrrigationItem) materialList.push(material);
            })

            // set product materials
            productMaterials = materialList;
        }

        // set materials cost
        const materialsCost = calculateMaterials(productMaterials);

        // set labor cost
        const laborCost = calculateLabor(selectedVariant.line_items.labor);

        // update UI
        this.setState({
            price: (materialsCost + laborCost),
            isLoading: false
        })

    }

    async addToCart() {

        // set product
        const product = this.props.route.params.product;

        // set variant
        const variant = this.props.route.params.variant;

        // update cart
        await updateCart(product._id, variant._id, parseInt(this.state.qty));

        // get updated items in cart
        await this.props.getItems();

        // open add to cart modal
        this.setState({ isOpen: true });
    }

    render() {

        const {
            description,
        } = this.props.route.params.product;

        const {
            image
        } = this.props.route.params.variant;

        const {
            qty,
            isOpen,
            price,
            isLoading
        } = this.state;

        const name = `${capitalize(this.props.route.params.product.name)} - ${this.props.route.params.variant.name}`;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                {/* loading indicator */}
                <LoadingIndicator
                    loading={isLoading}
                />

                {/* add to cart modal */}
                <AddToCart
                    isOpen={isOpen}
                    onViewCart={() => this.props.navigation.navigate('Cart')}
                    close={() => this.setState({ isOpen: false })}
                    product={{ name, image, description }}
                    qty={qty}
                />

                {/* product image */}
                <ImageBackground
                    source={{ uri: image }}
                    style={{ width: '100%', height: 200 }}
                >
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', padding: units.unit5 }}>
                        <View style={{ backgroundColor: '#fff', padding: units.unit5 }}>
                            <Paragraph style={{ fontWeight: 'bold', fontSize: units.unit6 }}>{capitalize(name)}</Paragraph>
                        </View>
                    </View>
                </ImageBackground>

                {/* product info */}
                <View style={{ padding: units.unit5 }}>
                    <View style={{ backgroundColor: '#fff', padding: units.unit5, borderRadius: 5 }}>
                        <View style={{ marginBottom: units.unit5 }}>
                            <Paragraph style={{ fontWeight: 'bold' }}>Price</Paragraph>
                            <Paragraph>${delimit(price.toFixed(2))} / each</Paragraph>
                        </View>
                        <View style={{ marginBottom: units.unit5 }}>
                            <Paragraph style={{ fontWeight: 'bold' }}>Description</Paragraph>
                            <Paragraph>{description}</Paragraph>
                        </View>
                        <View>
                            <Paragraph style={{ fontWeight: 'bold' }}>Qty</Paragraph>
                            <Input
                                type="numeric"
                                onChange={(value) => this.setState({ qty: value })}
                                value={qty}
                                placeholder="qty"
                            />
                        </View>
                    </View>
                    <View>
                        <Button
                            text="Add to Cart"
                            onPress={() => this.addToCart()}
                            variant="primary"
                            disabled={!qty}
                        />
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        items: state.items,
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


Product = connect(mapStateToProps, mapDispatchToProps)(Product);

export default Product;

module.exports = Product;