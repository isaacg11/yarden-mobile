// NOTE: This is the old version, remove it once all customers have moved to the PlantSelection schema instead of PlantList
// Author: Isaac G. (3/20/24)

import separatePlantsByCommonType from '../helpers/separatePlantsByCommonType';

export default function formatMenuData(vegetables, herbs, fruit, search) {
  // group vegetables by common type
  const commonTypeVegetables = separatePlantsByCommonType(vegetables);
  const commonTypeHerbs = separatePlantsByCommonType(herbs);
  const commonTypeFruit = separatePlantsByCommonType(fruit);
  let gridData = [];

  // iterate through common type groups
  for (let item in commonTypeVegetables) {
    // iterate through each plant in the common type group
    commonTypeVegetables[item].map(vegetable => {
      // for {x} qty
      for (let i = 0; i < vegetable.qty; i++) {
        // add new plant
        gridData.push(vegetable);
      }
    });
  }

  // iterate through common type groups
  for (let item in commonTypeHerbs) {
    // iterate through each plant in the common type group
    commonTypeHerbs[item].map(herb => {
      // for {x} qty
      for (let i = 0; i < herb.qty; i++) {
        // add new plant
        gridData.push(herb);
      }
    });
  }

  // iterate through common type groups
  for (let item in commonTypeFruit) {
    // iterate through each plant in the common type group
    commonTypeFruit[item].map(fruit => {
      // for {x} qty
      for (let i = 0; i < fruit.qty; i++) {
        // add new plant
        gridData.push(fruit);
      }
    });
  }

  // set initial list data
  let listData = [];

  // iterate through grid data, add unique key
  gridData.forEach((item, index) => {
    listData.push({
      ...item,
      ...{key: index + 1},
    });
  });

  // if a search is active {...}
  if (search) {
    // filter by search
    listData = listData.filter(data => {
      if (data.id.common_type.name.toLowerCase().match(new RegExp(search))) {
        return true;
      }

      if (data.id.name.toLowerCase().match(new RegExp(search))) {
        return true;
      }
    });
  }

  return listData;
}
