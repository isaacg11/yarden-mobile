
import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import ProductCategories from '../components/app/ProductCategories';
import ShoppingInfo from '../components/app/ShoppingInfo';
import Paragraph from '../components/UI/Paragraph';

class Shop extends Component {

    render() {

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <Paragraph style={{ fontSize: 25, textAlign: 'center', marginTop: 25, marginBottom: 25 }}>Shop</Paragraph>
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