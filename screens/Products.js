import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  SafeAreaView,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Paragraph from '../components/UI/Paragraph';
import Header from '../components/UI/Header';
import Card from '../components/UI/Card';
import { getProducts } from '../actions/products/index';
import capitalize from '../helpers/capitalize';
import units from '../components/styles/units';
import fonts from '../components/styles/fonts';

class Products extends Component {
  state = {};

  async componentDidMount() {
    // show loading indicator
    this.setState({ isLoading: true });

    // get products
    await this.props.getProducts(
      `category=${this.props.route.params.category._id}`,
    );

    // hide loading indicator
    this.setState({ isLoading: false });
  }

  componentWillUnmount() {
    // reset products
    this.props.getProducts(`name=none`);
  }

  render() {
    const { name } = this.props.route.params.category;

    const { products } = this.props;

    const { isLoading } = this.state;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
        }}>
        <ScrollView>
          <View style={{ padding: units.unit3 + units.unit4 }}>

            {/* loading indicator */}
            <LoadingIndicator loading={isLoading} />

            <Header
              type="h4"
              style={{ marginBottom: units.unit5 }}>
              {capitalize(name)}
            </Header>
            <View>
              {/* products list */}
              {products.map(product => {
                return product.variants.map((variant, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      this.props.navigation.navigate('Product', {
                        product: product,
                        variant: variant,
                      })
                    }>
                    <View style={{ marginBottom: units.unit5 }}>
                      <ImageBackground
                        source={{ uri: variant.image }}
                        style={{ width: '100%', height: 200 }}>
                        <View
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: units.unit5,
                          }}>
                          <Card>
                            <Paragraph
                              style={{ fontWeight: 'bold', fontSize: fonts.h3 }}>
                              {capitalize(product.name)} - {variant.name}
                            </Paragraph>
                          </Card>
                        </View>
                      </ImageBackground>
                    </View>
                  </TouchableOpacity>
                ));
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    products: state.products,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getProducts,
    },
    dispatch,
  );
}

Products = connect(mapStateToProps, mapDispatchToProps)(Products);

export default Products;

module.exports = Products;
