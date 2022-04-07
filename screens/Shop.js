
import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import ProductCategories from '../components/app/ProductCategories';
import ShoppingInfo from '../components/app/ShoppingInfo';
import Header from '../components/UI/Header';
import units from '../components/styles/units';

class Shop extends Component {

    render() {

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <Header type="h4" style={{ textAlign: 'center', marginTop: units.unit6 }}>
                    Shop
                </Header>
                <View style={{ padding: units.unit5 }}>

                    {/* shopping info */}
                    <View style={{ marginBottom: units.unit5 }}>
                        <ShoppingInfo
                            onSelectCart={() => this.props.navigation.navigate('Cart')}
                            onSelectPurchases={() => this.props.navigation.navigate('Purchases')}
                        />
                    </View>

                    {/* product categories */}
                    <ProductCategories
                        onPress={(category) => this.props.navigation.navigate('Products', { category: category })}
                    />
                </View>
            </SafeAreaView>
        )
    }
}

module.exports = Shop;