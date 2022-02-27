import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function clearCart(items) {
    
    // iterate through items
    await items.forEach((item) => {

        // remove product id reference from storage
        AsyncStorage.removeItem(item.product._id);

        // iterate through product variants
        item.product.variants.forEach((variant) => {

            // remove variant id references from storage
            AsyncStorage.removeItem(variant._id);
        })
    })
}