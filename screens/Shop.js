
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
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
                <ScrollView>
                    <View style={{ padding: units.unit3 + units.unit4 }}>
                        <Header type="h4" style={{ marginBottom: units.unit5 }}>
                            Shop
                        </Header>

                        {/* shopping info */}
                        <ShoppingInfo
                            onSelectCart={() => this.props.navigation.navigate('Cart')}
                            onSelectPurchases={() => this.props.navigation.navigate('Purchases')}
                        />

                        {/* product categories */}
                        <ProductCategories
                            onPress={(category) => this.props.navigation.navigate('Products', { category: category })}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

module.exports = Shop;