import AsyncStorage from '@react-native-async-storage/async-storage';

export default function getCartVariants(items) {

    let i = items;

    i.forEach((item) => {

        let variants = [];

        item.product.variants.forEach(async (variant, index) => {
            // check for variant in storage
            const v = await AsyncStorage.getItem(`${variant._id}`);

            if (v) {
                variant.qty = parseInt(v);
                variants.push(variant);
            }
        })

        item.product.variants = variants;
    })

    return i;
}