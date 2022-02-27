import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function updateCart(productId, variantId, qty) {

    // check for item in storage
    const productCount = parseInt(await AsyncStorage.getItem(`${productId}`));

    // check for variant in storage
    const variantCount = parseInt(await AsyncStorage.getItem(`${variantId}`));

    // if no matching product exists inside cart {...}
    if (!productCount) {

        // create a new cart 
        await AsyncStorage.setItem(`${productId}`, `${qty}`);
        await AsyncStorage.setItem(`${variantId}`, `${qty}`);
    } else {

        // update current product
        const newProductQty = (parseInt(productCount) + qty);
        await AsyncStorage.setItem(`${productId}`, `${newProductQty}`);

        // update current variant
        const newVariantQty = (variantCount > 0) ? variantCount + qty : qty;
        await AsyncStorage.setItem(`${variantId}`, `${newVariantQty}`);
    }

}