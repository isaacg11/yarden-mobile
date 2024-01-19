
// Note: This function was introduced to prevent the edge case where sometimes a plant will be saved as "selected" in the database
// Author: Isaac G. 1/15/24
export default function removeSelectionsFromBed(bed) {
  let bedWithoutSelections = bed;
  bedWithoutSelections.plot_points.forEach(row => {
    row.forEach(column => {
      column.selected = false;
    });
  });

  return bedWithoutSelections;
}
