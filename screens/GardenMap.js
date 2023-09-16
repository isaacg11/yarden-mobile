// libraries
import React, { Component } from 'react';
import moment from 'moment';
import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Text,
  Animated,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Popover from 'react-native-popover-view';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import PlantMenu from '../components/app/PlantMenu';
import PlantInfo from '../components/app/PlantInfo';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Paragraph from '../components/UI/Paragraph';
import { alert } from '../components/UI/SystemAlert';
import Header from '../components/UI/Header';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import HarvestMenu from '../components/app/HarvestMenu';
import NewPlantMenu from '../components/app/NewPlantMenu';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';

// actions
import { createDraft, updateDraft, getDrafts } from '../actions/drafts/index';
import { updateBed, getBeds } from '../actions/beds/index';
import { createPlantActivity } from '../actions/plantActivities/index';

// types
import types from '../vars/types';

// helpers
import calculatePlantingProgress from '../helpers/calculatePlantingProgress';
import calculateDaysToMature from '../helpers/calculateDaysToMature';
import getSeason from '../helpers/getSeason';

class GardenMap extends Component {
  constructor() {
    super();
    this.shakeAnimation = new Animated.Value(0);
    this.translateX = new Animated.Value(0);
    this.translateY = new Animated.Value(0);
    this.lastOffset = { x: 0, y: 0 };
    this.onGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationX: this.translateX,
            translationY: this.translateY,
          },
        },
      ],
      { useNativeDriver: false },
    );
  }

  state = {
    plotPoints: [],
    optionsMenuIsOpen: false,
    animatedStyle: [],
    scale: 1,
    harvestInfo: [],
    plantQueuedToMove: false,
    isLoading: true
  };

  translateX = Animated.Value;
  translateY = Animated.Value;
  lastOffset = { x: 0, y: 0 };
  onGestureEvent = event => {
    return;
  };

  componentDidMount() {
    const {
      plantList,
      rows,
      columns,
      user,
      order,
      beds,
      drafts,
      bedId
    } = this.props;
    let plotPoints = [];
    let plotPointId = 0;
    const season = getSeason();
    let bedsOutOfSeason = false;

    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < columns; j++) {
        plotPointId += 1;
        row.push({
          id: plotPointId,
          plant: null,
          selected: false,
        });
      }

      plotPoints.push(row);
    }

    if (user.type === types.GARDENER) {
      if (order.type === types.INITIAL_PLANTING) {
        if (drafts.length > 0) {
          const match = drafts.find(
            draft => draft.key === bedId,
          );

          // if draft key matches selected bed id {...}
          if (match) {
            // set plot points using draft
            plotPoints = match.plot_points;
          }
        }
      } else {
        if (order.type === types.CROP_ROTATION) {
          beds.forEach((bed) => {
            bed.plot_points.forEach((rows) => {
              rows.forEach((column) => {

                // if plant is not in season {...}
                if (column.plant && ((column.plant.id.season !== season) && (column.plant.id.season !== types.ANNUAL))) {

                  // flag the beds as out of season
                  bedsOutOfSeason = true;
                }
              })
            })
          })
        }

        // if plants in bed are in season {...}
        if (bedsOutOfSeason === false) {
          const match = beds.find(
            bed => bed.key === bedId
          );

          // if bed key matches selected bed id {...}
          if (match?.plot_points?.length > 0) {

            // set plot points using bed
            plotPoints = match.plot_points;
          }
        }
      }
    } else if (user.type === types.CUSTOMER) {
      const match = beds.find(bed => bed.key === bedId);

      // if bed key matches selected bed id {...}
      if (match) {
        // set plot points using bed
        plotPoints = match.plot_points;
      }
    }

    let vegetables = false;
    let herbs = false;
    let fruit = false;

    if (user.type === types.GARDENER) {
      if (order.type === types.INITIAL_PLANTING) {

        // set plants using bid line items
        vegetables = order.bid.line_items.vegetables;
        herbs = order.bid.line_items.herbs;
        fruit = order.bid.line_items.fruit;
      } else if (order.type === types.CROP_ROTATION) {
        // set plants using plant list
        vegetables = plantList.vegetables;
        herbs = plantList.herbs;
        fruit = plantList.fruit;
      }
    }

    // update UI
    this.setState({
      isLoading: false,
      plotPoints,
      vegetables,
      herbs,
      fruit
    });
  }

  async changeBedName(newName) {
    // validate name field
    if (!newName) {
      // show error
      return alert('The garden bed name cannot be empty.', 'Invalid Name');
    }

    // show loading indicator
    this.setState({ isLoading: true });

    // update bed
    await this.props.updateBed(this.props.bed._id, { name: newName });

    // get updated beds
    await this.props.getBeds(`customer=${this.props.user._id}`);

    // hide loading indicator
    this.setState({
      isLoading: false,
      isEditingName: false,
    });

    alert('Your changes to the garden beds have been saved.', 'Success!');
  }

  selectPlotPoint(plotPoint, selectedRowIndex, selectedColumnIndex) {
    // if a plant is queued to move {...}
    if (this.state.plantQueuedToMove) {
      // move plant, do no select
      return this.movePlant(plotPoint, selectedRowIndex, selectedColumnIndex);
    }

    // if reporting service results {...}
    if (this.props.serviceReport) {
      // if service report is for dead plants {...}
      if (this.props.serviceReport === types.DEAD_PLANTS) {
        // if no plant exists on selected plot point, do no select
        if (!plotPoint.plant) return;
      } else if (this.props.serviceReport === types.HARVESTED_PLANTS) {
        // if service report is for harvested plants {...}

        // if plant exists on selected plot point {...}
        if (plotPoint.plant) {
          const matchIndex = this.state.harvestInfo.findIndex(
            harvest =>
              harvest.key === plotPoint.plant.key &&
              harvest.plant === plotPoint.plant.id._id,
          );

          // if user is de-selecting
          if (matchIndex > -1) {
            // remove plant from harvest info
            this.removeHarvestInfo(matchIndex);
          }
        } else {
          // do no select
          return;
        }
      } else if (this.props.serviceReport === types.NEW_PLANTS) {
        // if service report is for new plants {...}
        // if plant exists on selected plot point, do no select
        if (plotPoint.plant) return;
      }
    } else {
      // if read only (READ ONLY MODE)
      if (
        (this.props.user.type === types.GARDENER &&
          (this.props.order.type === types.FULL_PLAN || this.props.order.type === types.ASSISTED_PLAN)) ||
        this.props.user.type === types.CUSTOMER
      ) {
        // if the user selected a plot point with a plant {...}
        if (plotPoint.plant) {
          // determine if the plant menu should be open
          const isOpen = this.state.selectedPlotPoint?.id !== plotPoint.id;

          // open plant info menu
          this.setState({
            plantInfoIsOpen: isOpen,
            selectedPlant: plotPoint.plant,
          });
        } else {
          return;
        }
      } else if (
        this.props.user.type === types.GARDENER &&
        this.props.order.type === types.INITIAL_PLANTING
      ) {
        const match = this.props.drafts.find((draft) => draft.key === this.props.bedId);
        if (match && match.published) {

          // if the user selected a plot point with a plant {...}
          if (plotPoint.plant) {

            // determine if the plant menu should be open
            const isOpen = this.state.selectedPlotPoint?.id !== plotPoint.id;

            // open plant info menu
            this.setState({
              plantInfoIsOpen: isOpen,
              selectedPlant: plotPoint.plant
            });
          } else {
            return;
          }
        }
      }
    }

    // get plot points
    let plotPoints = this.state.plotPoints;

    // iterate through plot points
    plotPoints.forEach((row, rowIndex) => {
      // iterate through rows
      row.forEach((column, columnIndex) => {
        // if column plant {...}
        if (column.plant && plotPoint.plant) {
          // if selecting a plot point with a matching plant {...}
          if (
            plotPoint.plant.id._id === column.plant.id._id &&
            plotPoint.group === column.group
          ) {
            // set selected status
            column.selected = !column.selected;
          }
        } else {
          if (
            rowIndex === selectedRowIndex &&
            columnIndex === selectedColumnIndex
          ) {
            // set selected status
            column.selected = !column.selected;
          }
        }
      });
    });

    // update UI
    this.setState({
      plotPoints,
      selectedRowIndex,
      selectedColumnIndex,
      selectedPlotPoint: plotPoint.selected ? plotPoint : null,
      harvestMenuIsOpen:
        this.props.serviceReport === types.HARVESTED_PLANTS &&
        plotPoint.selected,
    });
  }

  async addPlant(p) {
    // get render info
    const renderInfo = await this.getRenderInfo(
      p,
      this.state.selectedRowIndex,
      this.state.selectedColumnIndex,
    );

    // check to see if plants are located in the render path
    const validRenderPath = await this.validateRenderPath(renderInfo, p);

    // get available plot points
    const availablePlotPoints = await this.getAvailablePlotPoints();

    // if valid render path {...}
    if (validRenderPath) {
      // render plant
      await this.renderPlant(p, renderInfo);
    } else {
      // set x position initial value
      let x = null;

      // set y position initial value
      let y = null;

      // iterate through rows {...}
      for (let i = 0; i < availablePlotPoints.length; i++) {
        // set combined spaces initial value
        let combinedSpaces = 0;

        // set rows initial value
        let rows = 0;

        // set initial x-indexes
        let xIndexes = [];

        // iterate through X number of row (based on height)
        for (let j = 0; j < renderInfo.height; j++) {
          // if next plot point exists {...}
          if (availablePlotPoints[j + i]) {
            xIndexes.push(availablePlotPoints[j + i]);

            // set spaces
            const spaces = availablePlotPoints[j + i].length;

            // increment rows
            rows += spaces < renderInfo.width ? 0 : 1;

            // increment combined spaces
            combinedSpaces += spaces;
          }
        }

        // if combined spaces is enough to render the plant {...}
        if (
          combinedSpaces >= renderInfo.quadrantSize &&
          rows === renderInfo.height
        ) {
          // get matching x-indexes
          let matchingXIndexes = xIndexes.shift().filter(function (v) {
            return xIndexes.every(function (a) {
              return a.indexOf(v) !== -1;
            });
          });

          // set x position
          x = matchingXIndexes[0];

          // set y position
          y = i;

          // stop loop once the first available space is found to render the plant
          break;
        }
      }

      // if there was space found for the plant {...}
      if (x !== null && y !== null) {
        // get adjusted render info
        const adjustedRenderInfo = await this.getRenderInfo(p, y, x);

        // render plant
        await this.renderPlant(p, adjustedRenderInfo);
      } else {
        // show error
        return alert(
          `There is not enough space available to plant (${p.selectedPlants.length}) "${p.plant.id.common_type.name}"`,
        );
      }
    }
  }

  async renderPlant(p, renderInfo) {
    // get plot points
    let plotPoints = this.state.plotPoints;

    // check for last group id
    const lastGroupId = await this.getLastGroupId(p);

    // set initial indexes
    let xIndexes = [];

    // set initial planted count
    let planted = 0;

    // set initial group number
    let groupNumber = 0;

    // set initial new plant index
    let selectionIndex = 0;

    // iterate through rows
    for (let i = 0; i < plotPoints.length; i++) {
      // set initial count value
      let count = 0;

      // iterate through columns
      for (let j = 0; j < plotPoints[i].length; j++) {
        // if current index is greater than or equal to X or Y {...}
        if (i >= renderInfo.y && j >= renderInfo.x) {
          // increment count
          count += 1;

          // if first row being rendered {...}
          if (xIndexes.length < renderInfo.width) {
            // if count is smaller than width
            if (count <= renderInfo.width) {
              // add to x-indexes list
              xIndexes.push(j);

              // if no group number {...}
              if (!groupNumber) {
                // if any existing groups {...}
                if (lastGroupId > 0) {
                  // set group number by adding 1 to the existing group total
                  groupNumber = lastGroupId + 1;
                } else {
                  // increment group number
                  groupNumber += 1;
                }
              }

              // set group
              plotPoints[i][j].group = groupNumber;

              // set plant
              plotPoints[i][j].plant = p.selectedPlants[0];

              // set date planted
              plotPoints[i][j].plant.dt_planted = new Date();

              // if no plant key found {...}
              if (!plotPoints[i][j].plant.key) {

                // add key (for newly added plants during maintenance)
                plotPoints[i][j].plant.key = (i * plotPoints[i].length) + (j + 1);
              }

              // check to see if quadrant size is 1 {...}
              if (planted === 0 && renderInfo.quadrantSize === 1) {

                // set image
                plotPoints[i][j].image = p.plant.id.common_type.image;
              }

              // update planted qty
              planted += 1;
            }
          } else {
            // set allowed index
            let allowedIndex = false;

            // check to see if this index is allowed to render
            xIndexes.forEach(indice => {
              if (indice === j) {
                allowedIndex = true;
              }
            });

            // if index is allowed to render {...}
            if (allowedIndex) {
              // if number of planted plot points is less than the plant's quadrant size {...}
              if (planted < renderInfo.quadrantSize * p.selectedPlants.length) {
                // check to see if rendering last plant of group
                const isLastPlantOfGroup =
                  (planted + 1) % renderInfo.quadrantSize === 0;

                // check to see if there is only 1 plant quadrant to render
                const isOnlyOneQuadrant = renderInfo.quadrantSize === 1;

                // set the index of the plants being added
                let plantIndex =
                  p.selectedPlants.length > 1 ? selectionIndex : 0;

                // if there is only 1 quadrant
                if (isOnlyOneQuadrant) plantIndex += 1;

                // if end of plant, update selection index
                if (isLastPlantOfGroup) selectionIndex += 1;

                // set plant
                plotPoints[i][j].plant = p.selectedPlants[plantIndex];

                // set date planted
                plotPoints[i][j].plant.dt_planted = new Date();

                // if no plant key found {...}
                if (!plotPoints[i][j].plant.key) {

                  // add key (for newly added plants during maintenance)
                  plotPoints[i][j].plant.key = (i * plotPoints[i].length) + (j + 1);
                }

                // if there is only 1 quadrant to render OR if the last plant of a group is being rendered {...}
                if (isOnlyOneQuadrant || isLastPlantOfGroup) {
                  // set image
                  plotPoints[i][j].image = p.plant.id.common_type.image;
                }

                // if 2nd plant group or greater {...}
                if (planted >= renderInfo.quadrantSize) {
                  // if rendering new plant group {...}
                  if (planted % renderInfo.quadrantSize === 0) {
                    // increment group number
                    groupNumber += 1;
                  }
                }

                // set group number
                plotPoints[i][j].group = groupNumber;

                // update planted qty
                planted += 1;
              }
            }
          }
        }
      }
    }

    this.setState(
      {
        plotPoints,
        selectedPlotPoint: null,
      },
      () => {
        this.updatePlantedList();
      },
    );
  }

  async getLastGroupId(p) {
    // get plot points
    let plotPoints = this.state.plotPoints;

    // set initial groups
    let groups = [];

    // iterate through rows
    for (let i = 0; i < plotPoints.length; i++) {
      // iterate through columns
      for (let j = 0; j < plotPoints[i].length; j++) {
        // set column
        let column = plotPoints[i][j];

        // if plant in column {...}
        if (column.plant) {
          // if column plant id matches selected plant id {...}
          if (column.plant.id._id === p.plant.id._id) {
            // add new group to groups list
            groups.push(column.group);
          }
        }
      }
    }

    // get unique groups
    const uniqueGroups = groups.filter((item, i, ar) => ar.indexOf(item) === i);

    // get last group (element with highest number)
    const lastGroup = uniqueGroups.length < 1 ? 0 : Math.max(...uniqueGroups);

    return lastGroup;
  }

  async getRenderInfo(plotPoint, selectedRowIndex, selectedColumnIndex) {
    // get plant
    const plant = plotPoint.plant.id;

    // get plot points
    let plotPoints = this.state.plotPoints;

    // iterate through rows {...}
    for (let i = 0; i < plotPoints.length; i++) {
      // iterate through columns {...}
      for (let j = 0; j < plotPoints[i].length; j++) {
        // if selected plot point found {...}
        if (selectedRowIndex === i && selectedColumnIndex === j) {
          // set column width
          const columnWidth = plotPoints[i].length;

          // get square root
          const sqrt = Math.sqrt(plant.quadrant_size);

          // get shape
          const shape = sqrt % 1 === 0 ? 'square' : 'rectangle';

          // get dimensions
          const height =
            shape === 'square'
              ? sqrt * plotPoint.selectedPlants.length
              : Math.floor(sqrt) * plotPoint.selectedPlants.length;
          const width = shape === 'square' ? sqrt : plant.quadrant_size / 2;

          // set initial x-index
          let xIndex = selectedColumnIndex;

          // if spaces to the right are less than the plant width required spaces ...
          if (columnWidth - selectedColumnIndex < width) {
            // set adjusted position
            const adjustedPosition = selectedColumnIndex + 1 - width;

            // use adjusted position as x-index
            xIndex = adjustedPosition < 0 ? 0 : adjustedPosition;
          }

          // set row length
          const rowLength = plotPoints.length;
          const diff = rowLength - selectedRowIndex;

          // set y-index
          const yIndex =
            diff < height
              ? selectedRowIndex - (height - diff)
              : selectedRowIndex;

          return {
            x: xIndex,
            y: yIndex,
            width: width,
            height: height,
            quadrantSize: plant.quadrant_size,
            columnWidth: columnWidth,
            shape: shape,
          };
        }
      }
    }
  }

  async getAvailablePlotPoints() {
    // get plot points
    let plotPoints = this.state.plotPoints;

    // set available spaces initial value
    let availablePlotPoints = [];

    // iterate through rows {...}
    for (let i = 0; i < plotPoints.length; i++) {
      // set no plants list initial value
      let noPlants = [];

      // iterate through columns {...}
      for (let j = 0; j < plotPoints[i].length; j++) {
        // if no plant found {...}
        if (!plotPoints[i][j].plant) {
          // add to the no plants list
          noPlants.push(j);
        }
      }

      // add row's available spaces
      availablePlotPoints.push(noPlants);
    }

    return availablePlotPoints;
  }

  async validateRenderPath(renderInfo, plotPoint) {
    // set initial validation value
    let validRenderPath = true;

    // get plot points
    let plotPoints = this.state.plotPoints;

    // set initial indexes
    let xIndexes = [];

    // set initial planted count
    let planted = 0;

    // iterate through rows
    for (let i = 0; i < plotPoints.length; i++) {
      // set initial count value
      let count = 0;

      // iterate through columns
      for (let j = 0; j < plotPoints[i].length; j++) {
        // if current index is greater than or equal to X or Y {...}
        if (i >= renderInfo.y && j >= renderInfo.x) {
          // increment count
          count += 1;

          // if first row being rendered {...}
          if (xIndexes.length < renderInfo.width) {
            // if count is smaller than width
            if (count <= renderInfo.width) {
              // if plant already occupies designated space {...}
              if (plotPoints[i][j].plant) {
                // set validation
                validRenderPath = false;
              }

              // update planted count
              planted += 1;

              // add to x-indexes list
              xIndexes.push(j);
            }
          } else {
            // set allowed index
            let allowedIndex = false;

            // check to see if this index is allowed to render
            xIndexes.forEach(indice => {
              if (indice === j) {
                allowedIndex = true;
              }
            });
            // if index is allowed to render {...}
            if (allowedIndex) {
              // if planted is less than total quadrant size {...}
              if (
                planted <
                renderInfo.quadrantSize * plotPoint.selectedPlants.length
              ) {
                // if plant already occupies designated space {...}
                if (plotPoints[i][j].plant) {
                  // set validation
                  validRenderPath = false;
                } else {
                  // update planted count
                  planted += 1;
                }
              }
            }
          }
        }
      }
    }

    return validRenderPath;
  }

  async updatePlantedList() {

    // if initial planting{...}
    if (this.props.order.type === types.INITIAL_PLANTING) {

      // show saving indicator
      this.setState({ isSaving: true });

      // check for match
      const match = this.props.drafts.find(
        draft => draft.key === this.props.bedId,
      );

      // if draft key matches selected bed id {...}
      if (match) {

        // update draft
        await this.props.updateDraft(match._id, {
          plot_points: this.state.plotPoints,
        });

        // get updated drafts
        await this.props.getDrafts(`order=${this.props.order._id}`);
      }

      // hide saving indicator
      this.setState({ isSaving: false });
    }
  }

  async removePlant() {
    // get plot points
    let plotPoints = this.state.plotPoints;

    // iterate through plot points
    plotPoints.forEach(row => {
      // iterate through rows
      row.forEach(column => {
        // if column is selected {...}
        if (column.selected) {
          // reset column (removes plant)
          column.selected = false;
          column.id = column.id;
          column.plant = null;
          delete column.moveQueue;
          delete column.group;
          delete column.image;
        }
      });
    });

    // update UI
    this.setState(
      {
        plotPoints,
        selectedPlotPoint: null,
      },
      () => {
        this.updatePlantedList();
      },
    );
  }

  addPlantToMoveQueue(p) {
    // get plot points
    let plotPoints = this.state.plotPoints;

    // set plant queued to move
    const plantQueuedToMove = p;

    // iterate through rows
    plotPoints.forEach(row => {
      // iterate through columns
      row.forEach(column => {
        // set selected status
        column.selected = false;

        // if column is selected {...}
        if (
          column.group === p.group &&
          column.plant.id._id === p.plant.id._id
        ) {
          // set move queue
          column.moveQueue = true;
        } else {
          // set move queue
          column.moveQueue = false;
        }
      });
    });

    // update UI
    this.setState(
      {
        plotPoints,
        plantQueuedToMove,
        selectedPlotPoint: null,
      },
      () => {
        this.startShake();
      },
    );
  }

  async movePlant(plotPoint, selectedRowIndex, selectedColumnIndex) {
    // check to see if there's already a plant in the target plot point {...}
    if (plotPoint.plant) {
      // if selected plot point plant is the same as plant that is queued to move {...}
      if (
        plotPoint.group === this.state.plantQueuedToMove.group &&
        plotPoint.plant.id._id === this.state.plantQueuedToMove.plant.id._id
      ) {
        // cancel function
        return;
      } else {
        // render warning
        return alert(
          'There is already a plant in that location, please select another space.',
        );
      }
    } else {
      // update selected x and y positions
      this.setState(
        {
          selectedRowIndex,
          selectedColumnIndex,
        },
        async () => {
          // get plant to move
          const plantToMove = this.state.plantQueuedToMove.plant;

          // remove queued plants
          await this.removeQueuedPlants();

          // add new plants
          await this.addPlant({
            selectedPlants: [plantToMove],
            plant: plantToMove,
          });

          // update UI
          this.setState(
            {
              plantQueuedToMove: null,
            },
            () => {
              // stop plant animation
              Animated.timing(this.shakeAnimation).stop();
            },
          );
        },
      );
    }
  }

  async removeQueuedPlants() {
    // get plot points
    let plotPoints = this.state.plotPoints;

    // iterate through plot points
    plotPoints.forEach(row => {
      // iterate through rows
      row.forEach(column => {
        // if column is selected {...}
        if (column.moveQueue) {
          // reset column (removes plant)
          column.id = column.id;
          column.plant = null;
          column.selected = false;
          delete column.moveQueue;
          delete column.group;
          delete column.image;
        }
      });
    });

    // update UI
    this.setState({
      plotPoints,
    });
  }
  getPlantContainerTransform(quadrantSize) {
    switch (quadrantSize) {
      case 1:
        return [{ scale: 0.9 }, { translateX: 0 }, { translateY: -0.5 }];
      case 4:
        return [{ scale: 1.9 }, { translateX: -10.66 }, { translateY: -10.66 }];
      case 9:
        return [{ scale: 2.9 }, { translateX: -13.84 }, { translateY: -13.84 }];
      case 16:
        return [{ scale: 3.9 }, { translateX: -15.4 }, { translateY: -15.4 }];
      default:
        return [];
    }
  }

  getPlantImageStyles(quadrantSize) {
    switch (quadrantSize) {
      case 1:
        return {
          width: 20,
          height: 20,
          transform: [{ scale: 1.2 }, { translateX: 0 }, { translateY: 0 }],
        };
      case 4:
        return {
          width: 20,
          height: 20,
          transform: [{ scale: 0.75 }, { translateX: 0 }, { translateY: 8 }],
          padding: 0,
        };
      case 9:
        return {
          width: 20,
          height: 20,
          transform: [{ scale: 0.75 }, { translateX: 0 }, { translateY: 10 }],
        };
      case 16:
        return {
          width: 20,
          height: 20,
          transform: [{ scale: 0.75 }, { translateX: 0 }, { translateY: 10 }],
        };
      default:
        return {};
    }
  }

  getPlantTextStyles(quadrantSize) {
    switch (quadrantSize) {
      case 1:
        return {
          transform: [{ scale: this.state.scale }],
        };
      case 4:
        return {
          transform: [
            { scale: this.getTextScale(this.state.scale > 1.2 ? 0.4 : 0.45) },
            { translateY: this.getTextTranslateY(0) },
          ],
          width: '200%',
          textAlign: 'center',
        };
      case 9:
        return {
          transform: [{ scale: this.getTextScale(0.28) }],
          width: '300%',
          textAlign: 'center',
        };
      case 16:
        return {
          transform: [{ scale: this.getTextScale(0.22) }],
          width: '400%',
          textAlign: 'center',
        };
      default:
        return {};
    }
  }

  getTextScale(initialScale) {
    const scale = this.state.scale;
    if ((scale > 1) & (scale < 1.1)) {
      return initialScale;
    } else if ((scale > 1.1) & (scale < 1.2)) {
      return initialScale - 0.01;
    } else if ((scale > 1.2) & (scale < 1.3)) {
      return initialScale - 0.02;
    } else if ((scale > 1.3) & (scale < 1.4)) {
      return initialScale - 0.03;
    } else if ((scale > 1.4) & (scale < 1.5)) {
      return initialScale - 0.04;
    } else {
      return initialScale;
    }
  }

  getTextTranslateY(initialTranslate) {
    const scale = this.state.scale;
    if ((scale > 1) & (scale < 1.1)) {
      return initialTranslate;
    } else if ((scale > 1.1) & (scale < 1.2)) {
      return initialTranslate - 1;
    } else if ((scale > 1.2) & (scale < 1.3)) {
      return initialTranslate - 2;
    } else if ((scale > 1.3) & (scale < 1.4)) {
      return initialTranslate - 3;
    } else if ((scale > 1.4) & (scale < 1.5)) {
      return initialTranslate - 4;
    } else {
      return initialTranslate;
    }
  }

  startShake() {
    // start animated loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.shakeAnimation, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(this.shakeAnimation, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }

  getSqFtBorder(row, column) {
    let leftSqX = false;
    let rightSqX = false;
    let topSqY = false;
    let border = {};

    if (row % 2 === 0) {
      topSqY = true;
    }

    if (column % 2 === 0) {
      leftSqX = true;
    } else {
      rightSqX = true;
    }

    if (topSqY) {
      if (leftSqX) {
        border = {
          borderColor: 'white',
          borderWidth: 0.5,
        };
      } else if (rightSqX) {
        border = {
          borderColor: 'white',
          borderWidth: 0.5,
        };
      }
    } else {
      if (leftSqX) {
        border = {
          borderColor: 'white',
          borderWidth: 0.5,
        };
      } else if (rightSqX) {
        border = {
          borderColor: 'white',
          borderWidth: 0.5,
        };
      }
    }

    return border;
  }

  save() {
    switch (this.props.serviceReport) {
      case types.DEAD_PLANTS:
        // show loading indicator
        this.setState({ isLoading: true });

        const bedWithDeadPlants = this.props.beds.find(
          b => b.key === this.props.bedId,
        );
        let createDeathActivities = [];
        this.state.plotPoints.forEach(row => {
          row.forEach(column => {
            if (column.selected && column.image) {
              createDeathActivities.push(
                new Promise(async resolve => {
                  // create plant activity
                  await this.props.createPlantActivity({
                    type: types.DECEASED,
                    owner: this.props.user._id,
                    customer: this.props.order.customer._id,
                    order: this.props.order._id,
                    plant: column.plant.id._id,
                    key: column.plant.key,
                    bed: bedWithDeadPlants._id,
                  });
                  resolve();
                }),
              );
            }
          });
        });

        // create plant activities
        Promise.all(createDeathActivities).then(async () => {
          // remove selected plants
          await this.removePlant();

          // update bed
          await this.props.updateBed(bedWithDeadPlants._id, {
            plot_points: this.state.plotPoints,
          });

          // hide loading indicator
          this.setState({ isLoading: false }, () => {
            // show confirmation message to user
            alert(
              'All selected plants have been marked as dead and removed from garden bed.',
              'Success!',
              () => this.props.onNavigateBack(),
            );
          });
        });

        break;
      case types.HARVESTED_PLANTS:
        // show loading indicator
        this.setState({ isLoading: true });

        let plotPoints = this.state.plotPoints;
        plotPoints.forEach(row => {
          row.forEach(column => {
            if (column.selected) {
              const data = this.state.harvestInfo.find(
                h =>
                  h.plant === column.plant.id._id && h.key === column.plant.key,
              );

              // if selected plant had a partial harvest, set selected status to false so the plant is not removed from the garden bed
              // otherwise, keep column selected so it can be removed from the garden bed
              if (data.harvest === types.PARTIAL_HARVEST) {
                column.selected = false;
              }
            }
          });
        });

        const bedWithHarvestedPlants = this.props.beds.find(
          b => b.key === this.props.bedId,
        );
        let createHarvestActivities = [];
        this.state.harvestInfo.forEach(harvest => {
          createHarvestActivities.push(
            new Promise(async resolve => {
              // create plant activity
              await this.props.createPlantActivity(harvest);
              resolve();
            }),
          );
        });

        // create plant activities
        Promise.all(createHarvestActivities).then(async () => {
          // hide loading indicator
          this.setState(
            {
              isLoading: false,
              plotPoints,
            },
            async () => {
              // remove selected plants (full harvest only)
              await this.removePlant();

              // update bed
              await this.props.updateBed(bedWithHarvestedPlants._id, {
                plot_points: this.state.plotPoints,
              });

              // show confirmation message to user
              alert(
                'All selected plants have been marked as harvested. Plants that were marked as a full harvest have been removed from the bed.',
                'Success!',
                () => this.props.onNavigateBack(),
              );
            },
          );
        });

        break;
      case types.NEW_PLANTS:
        this.props.onNavigateBack();
        break;
      default:
        return;
    }
  }

  addHarvestInfo(info) {
    let harvestInfo = this.state.harvestInfo;
    const bed = this.props.beds.find(b => b.key === this.props.bedId);

    // add harvest info to list
    harvestInfo.push({
      type: types.HARVESTED,
      owner: this.props.user._id,
      customer: this.props.order.customer._id,
      order: this.props.order._id,
      plant: info.column.plant.id._id,
      key: info.column.plant.key,
      bed: bed._id,
      harvest: info.harvest,
      qty: info.qty,
      head: info.produceType === types.HEAD,
    });

    // update harvest info list
    this.setState({
      harvestInfo,
    });
  }

  removeHarvestInfo(index) {
    let harvestInfo = this.state.harvestInfo;

    // remove harvest info from list
    harvestInfo.splice(index, 1);

    // update harvest info list
    this.setState({
      harvestInfo,
    });
  }

  async setPlant(p) {
    // get render info
    const renderInfo = await this.getRenderInfo(
      p,
      this.state.selectedRowIndex,
      this.state.selectedColumnIndex,
    );

    // get available plot points
    const availablePlotPoints = await this.getAvailablePlotPoints();

    // set initial available plot point count
    let availablePlotPointCount = 0;

    // increment count based on available plot points
    availablePlotPoints.forEach(row => (availablePlotPointCount += row.length));

    // set total plants
    const totalPlants = p.selectedPlants.length;

    // if total quadrant size area is greater than spaces available {...}
    if (renderInfo.quadrantSize * totalPlants > availablePlotPointCount) {
      // show error
      return alert(
        `There is not enough space available to plant (${totalPlants}) "${p.plant.id.common_type.name}"`,
      );
    } else {
      // add plant
      this.addPlant(p);
    }
  }

  renderAddButton(column, i, index) {
    if (this.props.user.type === types.GARDENER) {
      return (
        <TouchableOpacity
          style={{
            display:
              this.state.selectedPlotPoint?.plant
                ? 'none'
                : 'flex',
          }}
          onPress={async () => {
            // if plant already in selected plot point {...}
            if (this.state.selectedPlotPoint?.plant) {
              // render warning
              alert(
                'The selected space already has a plant. If you want to replace with a different plant, delete the current plant and try again.',
              );
            } else {
              // de-select plot point
              await this.selectPlotPoint(column, i, index);

              // NOTE: Must set timeout to allow the popover animiation to finish
              setTimeout(() => {
                // if reporting results for new plants {...}
                if (
                  this.props.serviceReport &&
                  this.props.serviceReport === types.NEW_PLANTS
                ) {
                  // update UI
                  this.setState({ newPlantMenuIsOpen: true });
                } else {
                  // update UI
                  this.setState({ plantMenuIsOpen: true });
                }
              }, 500);
            }
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: units.unit3,
            }}>
            <Ionicons name={'add'} color={colors.purpleB} size={fonts.h3} />
            <Text
              style={{
                fontWeight: 'bold',
                color: colors.purpleB,
                marginLeft: units.unit2,
              }}>
              Add
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      // NOTE: This is a work-around. If an element with no dimensions is returned, a warning will occur
      return (
        <View>
          <Text style={{ color: colors.white, height: 1 }}>|</Text>
        </View>
      );
    }
  }

  renderMoveButton(column) {
    if (this.props.user.type === types.GARDENER) {
      return (
        <TouchableOpacity
          style={{
            display:
              this.state.selectedPlotPoint && this.state.selectedPlotPoint.plant
                ? 'flex'
                : 'none',
          }}
          onPress={() => this.addPlantToMoveQueue(column)}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: units.unit3,
            }}>
            <Ionicons
              name={'move-outline'}
              color={colors.purpleB}
              size={fonts.h3}
            />
            <Text
              style={{
                fontWeight: 'bold',
                color: colors.purpleB,
                marginLeft: units.unit2,
              }}>
              Move
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      // NOTE: This is a work-around. If an element with no dimensions is returned, a warning will occur
      return (
        <View>
          <Text style={{ color: colors.white, height: 1 }}>|</Text>
        </View>
      );
    }
  }

  renderInfoButton(column, i, index) {
    return (
      <TouchableOpacity
        style={{
          display:
            this.state.selectedPlotPoint && this.state.selectedPlotPoint.plant
              ? 'flex'
              : 'none',
        }}
        onPress={async () => {
          const selectedPlant = this.state.selectedPlotPoint.plant;

          // de-select plot point
          await this.selectPlotPoint(column, i, index);

          // NOTE: Must set timeout to allow the popover animiation to finish
          setTimeout(() => {
            // update UI
            this.setState({
              plantInfoIsOpen: true,
              selectedPlant: selectedPlant,
            });
          }, 500);
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: units.unit3,
          }}>
          <Ionicons
            name={'information-circle-outline'}
            color={colors.purpleB}
            size={fonts.h3}
          />
          <Text
            style={{
              fontWeight: 'bold',
              color: colors.purpleB,
              marginLeft: units.unit2,
            }}>
            Info
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderRemoveButton() {
    if (this.props.user.type === types.GARDENER) {
      return (
        <TouchableOpacity
          style={{
            display:
              this.state.selectedPlotPoint && this.state.selectedPlotPoint.plant
                ? 'flex'
                : 'none',
          }}
          onPress={() => this.removePlant()}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: units.unit3,
            }}>
            <Ionicons
              name={'trash-outline'}
              color={colors.purpleB}
              size={fonts.h3}
            />
            <Text
              style={{
                fontWeight: 'bold',
                color: colors.purpleB,
                marginLeft: units.unit2,
              }}>
              Remove
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      // NOTE: This is a work-around. If an element with no dimensions is returned, a warning will occur
      return (
        <View>
          <Text style={{ color: colors.white, height: 1 }}>|</Text>
        </View>
      );
    }
  }

  renderPartialHarvestButton() {
    if (this.props.serviceReport === types.HARVESTED_PLANTS) {
      return (
        <TouchableOpacity>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: units.unit3,
            }}>
            <Ionicons
              name={'arrow-forward-outline'}
              color={colors.purpleB}
              size={fonts.h3}
            />
            <Text
              style={{
                fontWeight: 'bold',
                color: colors.purpleB,
                marginLeft: units.unit2,
              }}>
              Harvest part of plant
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  renderHelperText(serviceReport) {
    switch (serviceReport) {
      case types.DEAD_PLANTS:
        return 'Select dead plants';
      case types.HARVESTED_PLANTS:
        return 'Select harvested plants';
      case types.NEW_PLANTS:
        return 'Add new plants';
      default:
        return '';
    }
  }

  renderHint() {
    if (this.props.user.type === types.GARDENER) {
      if (
        this.props.order.type === types.INITIAL_PLANTING ||
        this.props.order.type === types.CROP_ROTATION
      ) {
        if (!this.props.drafts.find(draft => draft.key === this.props.bedId)) {
          return (
            <View
              style={{
                backgroundColor: colors.green0,
                borderRadius: 10,
              }}>
              <Ionicons name={'add'} color={colors.purple0} size={fonts.h3} />
            </View>
          );
        }
      }
    }

    return <></>;
  }

  renderPopover(row, column, rowIndex, columnIndex) {
    let render = false;

    // if column is selected {...}
    if (column.selected) {
      // if column id matches the column being rendered {...}
      if (column.id === rowIndex * row.length + (columnIndex + 1)) {
        // if gardener {...}
        if (this.props.user.type === types.GARDENER) {
          // if order type is for initial planting {...}
          if (this.props.order.type === types.INITIAL_PLANTING) {
            const match = this.props.drafts.find((draft) => draft.key === this.props.bedId);
            if (match && !match.published) {
              // update render status
              render = true;
            }
          } else if (this.props.order.type === types.FULL_PLAN || this.props.order.type === types.ASSISTED_PLAN) { // if order type is for maintenance {...}

            // if service report is for new plants {...}
            if (
              this.props.serviceReport &&
              this.props.serviceReport === types.NEW_PLANTS
            ) {
              // update render status
              render = true;
            }
          } else if (this.props.order.type === types.CROP_ROTATION) {
            render = true;
          }
        }
      }
    }

    return render;
  }

  renderPlotPoints() {
    // get interpolated value for queued plant animation
    const interpolated = this.shakeAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['-5deg', '5deg'],
    });

    // set animated style
    const animatedStyle = [{ rotate: interpolated }];

    return (
      <View
        style={{
          backgroundColor: colors.greenD05,
          overflow: 'hidden',
          shadowColor: colors.greenD10,
          shadowRadius: units.unit2,
          shadowOpacity: 1,
          shadowOffset: { width: 0, height: 4 },
          borderRadius: units.unit4,
        }}>
        {/* rows */}
        {this.state.plotPoints.map((row, i) => {
          return (
            <View
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
              {/* columns */}
              {row.map((column, index) => {
                // set border style
                const sqftBorder = this.getSqFtBorder(
                  i,
                  index,
                  this.state.plotPoints.length,
                  row.length,
                );

                // set radius of the corners of the map
                let borderTopLeftRadius = 0;
                let borderTopRightRadius = 0;
                let borderBottomLeftRadius = 0;
                let borderBottomRightRadius = 0;

                if (i === 0 && index === 0) {
                  // top left
                  borderTopLeftRadius = units.unit4;
                }

                // top left
                else if (i % 2 === 0 && index % 2 === 0) {
                  borderTopLeftRadius = units.unit3;
                }

                // top right
                else if (i === 0 && index === row.length - 1) {
                  borderTopRightRadius = units.unit4;
                } else if (i % 2 === 0 && index === 1) {
                  borderTopRightRadius = units.unit3;
                } else if (i % 2 === 0 && index === 3) {
                  borderTopRightRadius = units.unit3;
                } else if (i % 2 === 0 && index === 5) {
                  borderTopRightRadius = units.unit3;
                } else if (i % 2 === 0 && index === 7) {
                  borderTopRightRadius = units.unit3;
                }

                // bottom left
                else if (
                  i === this.state.plotPoints.length - 1 &&
                  index === 0
                ) {
                  borderBottomLeftRadius = units.unit4;
                } else if (i === 1 && index % 2 === 0) {
                  borderBottomLeftRadius = units.unit3;
                } else if (i === 3 && index % 2 === 0) {
                  borderBottomLeftRadius = units.unit3;
                } else if (i === 5 && index % 2 === 0) {
                  borderBottomLeftRadius = units.unit3;
                } else if (i === 7 && index % 2 === 0) {
                  borderBottomLeftRadius = units.unit3;
                } else if (i === 9 && index % 2 === 0) {
                  borderBottomLeftRadius = units.unit3;
                } else if (i === 11 && index % 2 === 0) {
                  borderBottomLeftRadius = units.unit3;
                } else if (i === 13 && index % 2 === 0) {
                  borderBottomLeftRadius = units.unit3;
                } else if (i === 15 && index % 2 === 0) {
                  borderBottomLeftRadius = units.unit3;
                }

                // bottom right
                else if (
                  i === this.state.plotPoints.length - 1 &&
                  index === row.length - 1
                ) {
                  borderBottomRightRadius = units.unit4;
                } else if (i === 1 && index === 1) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 3 && index === 1) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 5 && index === 1) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 7 && index === 1) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 9 && index === 1) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 11 && index === 1) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 13 && index === 1) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 15 && index === 1) {
                  borderBottomRightRadius = units.unit3;
                } else if (
                  i === this.state.plotPoints.length - 1 &&
                  index === row.length - 1
                ) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 1 && index === 3) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 3 && index === 3) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 5 && index === 3) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 7 && index === 3) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 9 && index === 3) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 11 && index === 3) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 13 && index === 3) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 15 && index === 3) {
                  borderBottomRightRadius = units.unit3;
                } else if (
                  i === this.state.plotPoints.length - 1 &&
                  index === row.length - 1
                ) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 1 && index === 5) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 3 && index === 5) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 5 && index === 5) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 7 && index === 5) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 9 && index === 5) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 11 && index === 5) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 13 && index === 5) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 15 && index === 5) {
                  borderBottomRightRadius = units.unit3;
                } else if (
                  i === this.state.plotPoints.length - 1 &&
                  index === row.length - 1
                ) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 1 && index === 7) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 3 && index === 7) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 5 && index === 7) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 7 && index === 7) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 9 && index === 7) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 11 && index === 7) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 13 && index === 7) {
                  borderBottomRightRadius = units.unit3;
                } else if (i === 15 && index === 7) {
                  borderBottomRightRadius = units.unit3;
                }

                // set initial plant styles
                let plantContainerTransform = null;
                let plantImageStyles = null;
                let plantTextStyles = null;
                let plantQueuedToMove = false;

                // if column has a plant {...}
                if (column.plant) {
                  // set the plant styles to scale based on quadrant size
                  plantContainerTransform = this.getPlantContainerTransform(
                    column.plant.id.quadrant_size,
                  );
                  plantImageStyles = this.getPlantImageStyles(
                    column.plant.id.quadrant_size,
                  );
                  plantTextStyles = this.getPlantTextStyles(
                    column.plant.id.quadrant_size,
                  );

                  // if selected plot point {...}
                  if (
                    this.state.selectedRowIndex === i &&
                    this.state.selectedColumnIndex === index
                  ) {
                    // if column is in the move queue {...}
                    if (column.moveQueue) {
                      // update plant queue status
                      plantQueuedToMove = true;
                    }
                  }
                }

                // determine if popover should render
                const renderPopover = this.renderPopover(row, column, i, index);

                // get days left to mature
                const daysLeft = column.plant?.id?.image ? calculateDaysToMature(column.plant) : 0;

                // get plant progress
                const totalDaysToMature = column.plant?.id?.days_to_mature;
                const currentDays = totalDaysToMature - daysLeft;
                let progress = (currentDays / totalDaysToMature) * 100;
                if (progress > 100) progress = 100;

                // render plot point
                return (
                  <View key={index}>
                    <Popover
                      placement={
                        column.plant && column.plant.id.quadrant_size > 1
                          ? 'floating'
                          : 'auto'
                      }
                      isVisible={renderPopover}
                      onRequestClose={() =>
                        this.selectPlotPoint(column, i, index)
                      }
                      from={
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.selectPlotPoint(column, i, index);
                          }}>
                          <View
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderTopLeftRadius: borderTopLeftRadius,
                              borderTopRightRadius: borderTopRightRadius,
                              borderBottomLeftRadius: borderBottomLeftRadius,
                              borderBottomRightRadius: borderBottomRightRadius,
                              width: 40,
                              height: 40,
                              backgroundColor: column.selected
                                ? colors.purple4
                                : colors.greenD10,
                              ...sqftBorder,
                            }}>
                            {/* hint */}
                            {index === 0 && i === 0 && this.renderHint()}

                            {/* plant container */}
                            {column.image && (
                              <>
                                <View
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: colors.white90,
                                    shadowColor: colors.greenD10,
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 1,
                                    shadowRadius: 2,
                                    borderRadius: this.determineBorderRadius(
                                      column.plant.id.quadrant_size,
                                    ),
                                    transform: plantContainerTransform,
                                  }}>
                                  <View
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <Animated.View
                                      style={{
                                        transform: plantQueuedToMove
                                          ? animatedStyle
                                          : [],
                                      }}>
                                      {/* plant image */}
                                      <Image
                                        source={{ uri: column.image }}
                                        style={plantImageStyles}
                                      />
                                    </Animated.View>

                                    {/* plant text */}
                                    {column.plant.id.quadrant_size > 1 && (
                                      <Paragraph
                                        style={{
                                          ...plantTextStyles,
                                          textTransform: 'capitalize',
                                          color:
                                            moment().diff(
                                              column.plant.dt_planted,
                                              'days',
                                            ) -
                                              column.plant.id.days_to_mature >=
                                              0
                                              ? colors.greenB
                                              : colors.purpleB,
                                          fontWeight:
                                            moment().diff(
                                              column.plant.dt_planted,
                                              'days',
                                            ) -
                                              column.plant.id.days_to_mature >=
                                              0
                                              ? 'bold'
                                              : 'normal',
                                        }}>
                                        {moment().diff(
                                          column.plant.dt_planted,
                                          'days',
                                        ) -
                                          column.plant.id.days_to_mature >=
                                          0
                                          ? 'Ready!'
                                          : column.plant.id.common_type.name}
                                      </Paragraph>
                                    )}
                                  </View>
                                  <View style={{
                                    position: 'absolute',
                                    bottom: '10%',
                                    left: '10%',
                                    height: '5%',
                                    width: '80%',
                                    backgroundColor: colors.greenD10,
                                    borderRadius: units.unit2
                                  }}>
                                    <View
                                      style={{
                                        height: '100%',
                                        width: `${progress.toFixed(2)}%`,
                                        minWidth: units.unit1,
                                        backgroundColor: colors.greenB,
                                        borderRadius: units.unit2
                                      }}>
                                    </View>
                                  </View>
                                </View>
                              </>
                            )}
                          </View>
                        </TouchableWithoutFeedback>
                      }>
                      {/* add button */}
                      {this.renderAddButton(column, i, index)}

                      {/* move button */}
                      {this.renderMoveButton(column)}

                      {/* info button */}
                      {this.renderInfoButton(column, i, index)}

                      {/* remove button */}
                      {this.renderRemoveButton()}
                    </Popover>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    );
  }

  determineBorderRadius(quadrantSize) {
    switch (quadrantSize) {
      case 1:
        return units.unit3 + units.unit2;
      case 4:
        return units.unit3;
      case 9:
        return units.unit2;
      case 16:
        return units.unit2;
      default:
        return 0;
    }
  }

  renderSavingIndicator(message) {
    switch (this.state.isSaving) {
      case true:
        return (
          <Text
            style={{
              textAlign: 'center',
              color: colors.greenE50,
            }}>
            Saving...
          </Text>
        );
      case false:
        return (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ textAlign: 'center', textTransform: 'capitalize' }}>
              {message}
            </Text>
            <Ionicons
              name={'checkmark'}
              color={colors.greenB}
              size={fonts.h2}
            />
          </View>
        );
      default:
        return <View></View>;
    }
  }

  renderBedInfo(serviceReport) {
    // if maintenance order {...}
    if (
      this.props.user.type === types.GARDENER &&
      (this.props.order.type === types.FULL_PLAN ||
        this.props.order.type === types.ASSISTED_PLAN)
    ) {
      return (
        <View>
          <Header style={{ marginBottom: units.unit3, marginLeft: units.unit4, textTransform: 'none' }}>
            {this.renderHelperText(serviceReport)}
          </Header>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: units.unit3,
              paddingHorizontal: units.unit4
            }}>
            <Paragraph style={{ ...fonts.label }}>
              Garden Bed #{this.props.bedId}
            </Paragraph>
            {this.props.serviceReport === types.NEW_PLANTS &&
              this.renderSavingIndicator('Saved Changes')}
            {(this.props.serviceReport === types.DEAD_PLANTS ||
              this.props.serviceReport === types.HARVESTED_PLANTS) && (
                <Button small text="Save" onPress={() => this.save()} />
              )}
          </View>
        </View>
      )
    } else { // for all other order types {...}
      let data = this.props.beds;
      if (this.props.user.type === types.GARDENER) {
        if (this.props.order.type === types.INITIAL_PLANTING) {
          data = this.props.drafts;
        } else if (this.props.order.type === types.CROP_ROTATION) {
          data = this.props.beds;
        }
      }

      return (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: units.unit4,
          }}>
          <Paragraph style={{ ...fonts.label }}>
            Garden Bed #{this.props.bedId}
          </Paragraph>
          {this.props.user.type === types.GARDENER && (
            <Paragraph style={{ ...fonts.label }}>
              {calculatePlantingProgress(
                data.find(d => d.key === this.props.bedId),
              )}
            </Paragraph>
          )}
        </View>
      );
    }
  }

  renderHeader() {
    const { isEditingName, bedName } = this.state;
    const { user } = this.props;

    if (user.type === types.CUSTOMER) {
      if (isEditingName) {
        // render edit inputs
        return (
          <View>
            <Input
              onChange={value => this.setState({ bedName: value })}
              value={bedName}
              placeholder="Bed Name"
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginBottom: units.unit3,
              }}>
              <TouchableOpacity
                onPress={() => this.changeBedName(this.state.bedName)}>
                <Ionicons
                  name={'checkmark'}
                  color={colors.purple0}
                  size={fonts.h2}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({ isEditingName: false })}>
                <Ionicons
                  name={'close'}
                  color={colors.purple0}
                  size={fonts.h2}
                />
              </TouchableOpacity>
            </View>
          </View>
        );
      } else {
        // render header
        return (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: units.unit4
            }}>
            <Header>
              {this.props.beds.find(bed => bed._id === this.props.bed._id).name}
            </Header>
            <TouchableOpacity
              onPress={() => this.setState({ isEditingName: true })}>
              <Ionicons
                name={'pencil'}
                color={colors.purple0}
                size={fonts.h3}
              />
            </TouchableOpacity>
          </View>
        );
      }
    } else if (user.type === types.GARDENER) {
      if (
        !this.props.drafts.find(draft => draft.key === this.props.bedId) &&
        !this.props.beds.find(bed => bed.key === this.props.bedId)
      ) {
        // render getting started helper text
        return (
          <Text
            style={{
              paddingVertical: units.unit4,
              textAlign: 'center',
              display:
                !this.props.drafts.find(
                  draft => draft.key === this.props.bedId,
                ) && !this.props.beds.find(bed => bed.key === this.props.bedId)
                  ? 'flex'
                  : 'none',
            }}>
            Tap on any square to get started
          </Text>
        );
      }
    } else {
      // render header
      return (
        <Header>
          {this.props.beds.find(bed => bed._id === this.props.bed._id).name}
        </Header>
      );
    }
  }

  getMapScale() {
    switch (this.props.columns) {
      case 12: // 6 ft width
        return {
          transform: [
            {
              scale: 0.7
            },
            {
              translateY: -70 * 5
            },
            {
              translateX: 0
            }
          ],
        }
      case 10: // 5 ft width
        return {
          transform: [
            {
              scale: 0.8
            },
            {
              translateY: -40 * 5
            },
            {
              translateX: 0
            }
          ],
        }
      case 8: // 4 ft width
        return {
          transform: [
            {
              scale: 1
            }
          ],
        }
      case 6: // 3 ft width
        return {
          transform: [
            {
              scale: 1
            }
          ],
        }
      case 4: // 2 ft width
        return {
          transform: [
            {
              scale: 1
            }
          ],
        }
      default:
        return {}
    }
  }

  render() {
    const {
      isLoading,
      plantMenuIsOpen,
      plantInfoIsOpen,
      selectedPlant,
      selectedPlotPoint,
      selectedRowIndex,
      selectedColumnIndex,
      vegetables,
      herbs,
      fruit,
      harvestMenuIsOpen,
      newPlantMenuIsOpen,
    } = this.state;

    const {
      user,
      order,
      bedId,
      beds,
      drafts,
      serviceReport,
      navigateToNotes,
      navigateToHarvestInstructions
    } = this.props;

    const mapScale = this.getMapScale();
    const bed = beds.find((b) => b.key === bedId);
    const draft = drafts.find((d) => d.key === bedId);
    const bedInfoMarginBottom = (draft?.width > 48 || bed?.width > 48) ? (units.unit6 + units.unit5) : units.unit4;

    return (
      <SafeAreaView
        forceInset={{ bottom: 'never' }}
        style={{
          flex: 1,
          width: '100%',
          overflow: 'visible'
        }}>
        <View style={{ overflow: 'visible' }}>
          <View style={{ overflow: 'visible' }}>
            {/* loading indicator (dynamically visible) */}
            <LoadingIndicator loading={isLoading} />

            {/* plant menu (modal) */}
            {vegetables && herbs && fruit && (
              <PlantMenu
                isOpen={plantMenuIsOpen}
                vegetables={vegetables}
                herbs={herbs}
                fruit={fruit}
                order={order}
                close={() => this.setState({ plantMenuIsOpen: false })}
                addPlant={async (p) => {

                  // set plant in bed
                  await this.setPlant(p);

                  if (order.type === types.CROP_ROTATION) {

                    // update bed
                    await this.props.updateBed(bed._id, { plot_points: this.state.plotPoints });

                    // get updated beds
                    await this.props.getBeds(`customer=${order.customer._id}`);
                  }
                }}
              />
            )}

            {/* new plant menu (modal) */}
            <NewPlantMenu
              isOpen={newPlantMenuIsOpen}
              close={() => this.setState({ newPlantMenuIsOpen: false })}
              addPlant={async p => {
                // show saving indicator
                this.setState({ isSaving: true });

                // set plant in bed
                await this.setPlant({
                  plant: {
                    id: p,
                  },
                  selectedPlants: [
                    {
                      id: p,
                    },
                  ],
                });

                // update bed
                await this.props.updateBed(bed._id, {
                  plot_points: this.state.plotPoints,
                });

                // get updated beds
                await this.props.getBeds(`customer=${order.customer._id}`);

                // hide saving indicator
                this.setState({ isSaving: false });
              }}
            />

            {/* harvest menu (bottom drawer) */}
            {selectedPlotPoint && serviceReport === types.HARVESTED_PLANTS && (
              <HarvestMenu
                isOpen={harvestMenuIsOpen}
                close={exitWithoutConfirming => {
                  this.setState({ harvestMenuIsOpen: false });
                  if (exitWithoutConfirming) {
                    this.selectPlotPoint(
                      selectedPlotPoint,
                      selectedRowIndex,
                      selectedColumnIndex,
                    );
                  }
                }}
                selectedPlotPoint={selectedPlotPoint}
                bedId={bedId}
                onConfirm={harvestInfo => {
                  this.addHarvestInfo(harvestInfo);
                }}
              />
            )}

            {/* plant info (bottom drawer) */}
            {selectedPlant && (
              <PlantInfo
                isOpen={plantInfoIsOpen}
                close={() => {
                  this.setState({ plantInfoIsOpen: false }, () => {
                    if (user.type === types.GARDENER) {
                      if (order.type === types.FULL_PLAN || order.type === types.ASSISTED_PLAN) {
                        this.selectPlotPoint(selectedPlotPoint, selectedRowIndex, selectedColumnIndex);
                      } else if (order.type === types.INITIAL_PLANTING) {
                        const publishedDraft = drafts.find((d) => d.key === this.props.bedId && d.published);
                        if (publishedDraft) {
                          this.selectPlotPoint(selectedPlotPoint, selectedRowIndex, selectedColumnIndex);
                        }
                      }
                    } else if (user.type === types.CUSTOMER) {
                      this.selectPlotPoint(selectedPlotPoint, selectedRowIndex, selectedColumnIndex);
                    }
                  });
                }}
                order={order}
                selectedPlant={selectedPlant}
                navigateToNotes={navigateToNotes}
                navigateToHarvestInstructions={navigateToHarvestInstructions}
              />
            )}

            <View
              style={{
                marginBottom: bedInfoMarginBottom
              }}>
              {/* id / stats */}
              {this.renderBedInfo(serviceReport)}

              {/* header */}
              {this.renderHeader()}
            </View>

            {/* garden map */}
            <ScrollView
              contentContainerStyle={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
              style={{
                overflow: 'visible',
                position: 'relative',
              }}>
              <View
                style={{
                  ...mapScale,
                  position: 'relative',
                  paddingTop: 8,
                  marginTop: 24,
                  overflow: 'visible'
                }}>

                {/* plot points */}
                {this.renderPlotPoints()}

                {/* vertical ruler */}
                <View
                  style={{
                    position: 'absolute',
                    flexDirection: 'row',
                    top: -8,
                    left: -8,
                    height: '100%',
                    width: 8,
                    overflow: 'visible',
                  }}>
                  <View style={{
                    marginTop: units.unit4,
                    borderBottomColor: colors.greenD25,
                    borderBottomWidth: 1,
                    display: 'flex',
                    flexGrow: 1,
                    width: '100%',
                    height: '100%',
                    justifyContent: 'space-between',
                    overflow: 'visible',
                  }}>
                    {/* rows */}
                    {this.state.plotPoints.map((row, i) => {
                      const text = (i % 2 === 0) ? <Paragraph style={{ width: 24, color: colors.greenD25, position: 'absolute', right: '150%', top: -8, overflow: 'visible', textAlign: 'right' }}>{i / 2}</Paragraph> : <></>;
                      return (
                        <View key={i} style={{ overflow: 'visible', backgroundColor: colors.greenD25, height: 1, width: 8, marginBottom: 39 }}>
                          {text}
                        </View>
                      )
                    })}
                    <View style={{ overflow: 'visible', height: 0, width: '100%' }}>
                      <Paragraph style={{ width: 24, color: colors.greenD25, position: 'absolute', right: '150%', top: -8, overflow: 'visible', textAlign: 'right' }}>
                        {this.state.plotPoints.length / 2}
                      </Paragraph>
                    </View>
                  </View>
                </View>

                {/* horizontal ruler */}
                <View
                  style={{
                    position: 'absolute',
                    flexDirection: 'row',
                    height: 8,
                    width: 40 * this.state.plotPoints[0]?.length || 8,
                    flex: 1,
                    top: 0,
                    left: 0,
                    justifyContent: 'space-between',
                    borderRightWidth: 1,
                    borderRightColor: colors.greenD25,
                    overflow: 'visible'
                  }}>
                  {/* columns */}
                  {this.state.plotPoints.map((row, index) => {
                    if (index === 0) {
                      return row.map((column, i) => {
                        const text = (i % 2 === 0) ? <Paragraph style={{ width: 16, textAlign: 'center', color: colors.greenD25, position: 'absolute', left: -8, top: -18, overflow: 'visible' }}>{i / 2}</Paragraph> : <></>;
                        return (
                          <View key={i} style={{ overflow: 'visible', backgroundColor: colors.greenD25, height: 8, width: 1, marginRight: 39 }}>
                            {text}
                          </View>
                        )
                      })
                    }
                  })}
                  <View style={{ overflow: 'visible', height: 0, width: '100%' }}>
                    <Paragraph style={{ width: 16, textAlign: 'center', color: colors.greenD25, position: 'absolute', left: -8, top: -18, overflow: 'visible' }}>
                      {this.state.plotPoints[0]?.length / 2}
                    </Paragraph>
                  </View>
                </View>

              </View>
            </ScrollView>


            {/* saving indicator (dynamically visible) */}
            {user.type === types.GARDENER &&
              (order.type === types.INITIAL_PLANTING ||
                order.type === types.CROP_ROTATION) && (
                <View style={{ marginTop: units.unit3 }}>
                  {this.renderSavingIndicator('Saved Draft')}
                </View>
              )}
          </View>

        </View>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    drafts: state.drafts,
    beds: state.beds,
    plantList: state.plantList
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createDraft,
      updateDraft,
      getDrafts,
      updateBed,
      getBeds,
      createPlantActivity,
    },
    dispatch,
  );
}

GardenMap = connect(mapStateToProps, mapDispatchToProps)(GardenMap);

export default GardenMap;

module.exports = GardenMap;
