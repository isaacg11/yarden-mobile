import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingIndicator from '../UI/LoadingIndicator';
import { getProductCategories } from '../../actions/productCategories/index';
import capitalize from '../../helpers/capitalize';

class ProductCategories extends Component {

    state = {}

    async componentDidMount() {

        // show loading indicator
        this.setState({ isLoading: true });

        // get product categories
        await this.props.getProductCategories();

        // hide loading indicator
        this.setState({ isLoading: false });
    }

    render() {

        const {
            productCategories,
            onPress,
            user
        } = this.props;

        const {
            isLoading
        } = this.state;

        // check to see if customer already has garden beds
        const customerHasGarden = (user.garden_info && user.garden_info.beds);

        return (
            <View>

                {/* loading indicator */}
                <LoadingIndicator
                    loading={isLoading}
                />

                {/* product categories */}
                {(productCategories.map((category, index) => {

                    // if "garden beds" or "potted plants" category and customer does not have garden yet {...}
                    if((category.name === 'garden beds' || category.name === 'potted plants') && !customerHasGarden) {

                        // render nothing
                        return <View key={index}></View>;
                    }

                    // render category
                    return (
                        <View key={index} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5, marginBottom: 12 }}>
                            <TouchableOpacity onPress={() => onPress(category)}>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={{ fontWeight: 'bold' }}>{capitalize(category.name)}</Text>
                                    <Ionicons name="arrow-forward" size={30} color="#CCCCCC" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                }))}
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        productCategories: state.productCategories,
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getProductCategories
    }, dispatch)
}

ProductCategories = connect(mapStateToProps, mapDispatchToProps)(ProductCategories);

export default ProductCategories;

module.exports = ProductCategories;