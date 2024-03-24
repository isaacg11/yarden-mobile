export default function formatMenuData(vegetables, herbs, fruit, search) {
  let gridData = [];
  gridData.push(...vegetables);
  gridData.push(...herbs);
  gridData.push(...fruit);

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
      if (data.common_type.name.toLowerCase().match(new RegExp(search))) {
        return true;
      }

      if (data.name.toLowerCase().match(new RegExp(search))) {
        return true;
      }
    });
  }

  return listData;
}
