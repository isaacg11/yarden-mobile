
// rule formula: {qty} OF {item} PER {unit qty} {unit} FOR {product}

export default function applyProductRules(materials, rules, sqft, cf, vf, lf) {

    // set initial items value
    let items = materials;

    // iterate through items
    for (let i = 0; i < items.length; i++) {


        // iterate through rules
        for (let j = 0; j < rules.length; j++) {


            // if rule exists for item {...}
            if (items[i].name === rules[j].key.name) {


                // if rule unit is bid {...}
                if (rules[j].unit === 'bid') {

                    // set item qty
                    items[i].qty = rules[j].item_qty;
                } else {

                    let factor;
                    const unit = rules[j].unit;
                    if (unit === 'sqft') factor = sqft;
                    if (unit === 'cf') factor = cf;
                    if (unit === 'vf') factor = vf;
                    if (unit === 'lf') factor = lf;

                    // calculate unit value
                    const unitValue = (rules[j].item_qty / rules[j].unit_qty);

                    // set item qty
                    items[i].qty = Math.ceil((factor * unitValue));
                }
            }
        }
    }

    return items;
}