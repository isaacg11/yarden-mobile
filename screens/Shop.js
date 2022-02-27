
import React, { Component } from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import ProductCategories from '../components/app/ProductCategories';
import ShoppingInfo from '../components/app/ShoppingInfo';

class Shop extends Component {

    render() {

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <Text style={{ fontSize: 25, textAlign: 'center', marginTop: 25, marginBottom: 25 }}>Shop</Text>
                <View style={{ padding: 12 }}>
    
                    {/* shopping info */}
                    <View style={{marginBottom: 12}}>
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