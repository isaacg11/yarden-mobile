
// libraries
import React, { Component } from 'react';
import {
    SafeAreaView,
    View,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    Text,
    Animated
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Popover from 'react-native-popover-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    PinchGestureHandler,
    PanGestureHandler,
    State
} from 'react-native-gesture-handler';

// UI components
import PlantMenu from '../components/app/PlantMenu';
import PlantInfo from '../components/app/PlantInfo';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Paragraph from '../components/UI/Paragraph';
import { alert } from '../components/UI/SystemAlert';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';

// actions
import { createDraft, updateDraft, getDrafts } from '../actions/drafts/index';

// helpers
import calculatePlantingProgress from '../helpers/calculatePlantingProgress';

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
            { useNativeDriver: false }
        );
    }

    state = {
        plotPoints: [],
        optionsMenuIsOpen: false,
        animatedStyle: [],
        scale: 1
    }

    translateX = Animated.Value;
    translateY = Animated.Value;
    lastOffset = { x: 0, y: 0 };
    onGestureEvent = (event) => { return };

    componentDidMount() {

        // show loading indicator
        this.setState({ isLoading: true });

        // set initial plot points list
        let plotPoints = [];

        // set initial plot points id
        let plotPointId = 0;

        // iterate rows
        for (let i = 0; i < this.props.rows; i++) {

            // set initial row value
            let row = [];

            // iterate columns
            for (let j = 0; j < this.props.columns; j++) {

                // set plot point id
                plotPointId += 1;

                // set row
                row.push({
                    id: plotPointId,
                    plant: null,
                    selected: false
                })
            }

            // set plot points
            plotPoints.push(row);
        }

        // if drafts are found {...}
        if (this.props.drafts.length > 0) {

            // check for match
            const match = this.props.drafts.find((draft) => draft.key === this.props.bedId);

            // if draft key matches selected bed id {...}
            if (match) {

                // set plot points using draft
                plotPoints = match.plot_points;
            }
        }

        // set plants
        const vegetables = this.props.order.customer.garden_info.vegetables;
        const herbs = this.props.order.customer.garden_info.herbs;
        const fruit = this.props.order.customer.garden_info.fruit;

        // update UI
        this.setState({
            isLoading: false,
            plotPoints,
            vegetables,
            herbs,
            fruit
        });
    }

    selectPlotPoint(plotPoint, selectedRowIndex, selectedColumnIndex) {

        // if a plant is queued to move {...}
        if (this.state.plantQueuedToMove) {

            // move plant
            return this.movePlant(plotPoint, selectedRowIndex, selectedColumnIndex);
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
                    if ((plotPoint.plant.id._id === column.plant.id._id) && (plotPoint.group === column.group)) {

                        // set selected status
                        column.selected = !column.selected;
                    }
                } else {
                    if (rowIndex === selectedRowIndex && columnIndex === selectedColumnIndex) {
                        // set selected status
                        column.selected = !column.selected;
                    }

                }
            })
        })

        // update UI
        this.setState({
            plotPoints,
            selectedRowIndex,
            selectedColumnIndex,
            selectedPlotPoint: (plotPoint.selected) ? plotPoint : null
        });
    }

    async addPlant(p) {

        // get render info
        const renderInfo = await this.getRenderInfo(
            p,
            this.state.selectedRowIndex,
            this.state.selectedColumnIndex
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
                        rows += (spaces < renderInfo.width) ? 0 : 1;

                        // increment combined spaces
                        combinedSpaces += spaces;
                    }
                }

                // if combined spaces is enough to render the plant {...}
                if ((combinedSpaces >= renderInfo.quadrantSize) && (rows === renderInfo.height)) {

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
                return alert(`There is not enough space available to plant (${p.selectedPlants.length}) "${p.plant.id.common_type.name}"`);
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
                                    groupNumber = (lastGroupId + 1);
                                } else {
                                    // increment group number
                                    groupNumber += 1;
                                }
                            }

                            // set group
                            plotPoints[i][j].group = groupNumber;

                            // set plant
                            plotPoints[i][j].plant = p.selectedPlants[0];

                            // check to see if quadrant size is 1 {...}
                            if ((planted === 0) && (renderInfo.quadrantSize === 1)) {

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
                        xIndexes.forEach((indice) => {
                            if (indice === j) {
                                allowedIndex = true;
                            }
                        });

                        // if index is allowed to render {...}
                        if (allowedIndex) {

                            // if number of planted plot points is less than the plant's quadrant size {...}
                            if (planted < (renderInfo.quadrantSize * p.selectedPlants.length)) {

                                // check to see if rendering last plant of group
                                const isLastPlantOfGroup = ((planted + 1) % renderInfo.quadrantSize) === 0;

                                // check to see if there is only 1 plant quadrant to render
                                const isOnlyOneQuadrant = (renderInfo.quadrantSize === 1);

                                // set the index of the plants being added
                                let plantIndex = p.selectedPlants.length > 1 ? (selectionIndex) : 0;

                                // if there is only 1 quadrant
                                if (isOnlyOneQuadrant) plantIndex += 1;

                                // if end of plant, update selection index
                                if (isLastPlantOfGroup) selectionIndex += 1;

                                // set plant
                                plotPoints[i][j].plant = p.selectedPlants[plantIndex];

                                // if there is only 1 quadrant to render OR if the last plant of a group is being rendered {...}
                                if (
                                    isOnlyOneQuadrant ||
                                    isLastPlantOfGroup) {

                                    // add image           
                                    plotPoints[i][j].image = p.plant.id.common_type.image;
                                }

                                // if 2nd plant group or greater {...}
                                if ((planted >= renderInfo.quadrantSize)) {

                                    // if rendering new plant group {...}
                                    if ((planted % renderInfo.quadrantSize) === 0) {

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

        this.setState({
            plotPoints,
            selectedPlotPoint: null
        }, () => {
            this.updatePlantedList();
        });
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
        const lastGroup = (uniqueGroups.length < 1) ? 0 : Math.max(...uniqueGroups);

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
                    const shape = sqrt % 1 === 0 ? "square" : "rectangle";

                    // get dimensions
                    const height = shape === "square" ? sqrt * plotPoint.selectedPlants.length : Math.floor(sqrt) * plotPoint.selectedPlants.length;
                    const width = shape === "square" ? sqrt : plant.quadrant_size / 2;

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
                        diff < height ? selectedRowIndex - (height - diff) : selectedRowIndex;

                    return {
                        x: xIndex,
                        y: yIndex,
                        width: width,
                        height: height,
                        quadrantSize: plant.quadrant_size,
                        columnWidth: columnWidth,
                        shape: shape
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
                        xIndexes.forEach((indice) => {
                            if (indice === j) {
                                allowedIndex = true;
                            }
                        });
                        // if index is allowed to render {...}
                        if (allowedIndex) {

                            // if planted is less than total quadrant size {...}
                            if (planted < (renderInfo.quadrantSize * plotPoint.selectedPlants.length)) {

                                // if plant already occupies designated space {...}
                                if (
                                    plotPoints[i][j].plant
                                ) {
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

        // show saving indicator
        this.setState({ isSaving: true });

        // check for match
        const match = this.props.drafts.find((draft) => draft.key === this.props.bedId);

        // if draft key matches selected bed id {...}
        if (match) {

            // update draft
            await this.props.updateDraft(match._id, {
                plot_points: this.state.plotPoints
            })

            // get updated drafts
            await this.props.getDrafts(`order=${this.props.order._id}`);
        } else {
            // create a new draft
            await this.props.createDraft({
                key: this.props.bedId,
                order: this.props.order._id,
                plot_points: this.state.plotPoints,
                width: this.props.bed.width,
                length: this.props.bed.length,
                height: this.props.bed.height,
                shape: this.props.bed.shape._id
            })

            // get new drafts
            await this.props.getDrafts(`order=${this.props.order._id}`);
        }

        // hide saving indicator
        this.setState({ isSaving: false });
    }

    removePlant() {

        // get plot points
        let plotPoints = this.state.plotPoints;

        // iterate through plot points
        plotPoints.forEach((row) => {

            // iterate through rows
            row.forEach((column) => {

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
            })
        })

        // update UI
        this.setState({
            plotPoints,
            selectedPlotPoint: null
        }, () => {
            this.updatePlantedList();
        });
    }

    addPlantToMoveQueue(p) {

        // get plot points
        let plotPoints = this.state.plotPoints;

        // set plant queued to move
        const plantQueuedToMove = p;

        // iterate through rows
        plotPoints.forEach((row) => {

            // iterate through columns
            row.forEach((column) => {

                // set selected status
                column.selected = false;

                // if column is selected {...}
                if (column.group === p.group && column.plant.id._id === p.plant.id._id) {

                    // set move queue
                    column.moveQueue = true;

                } else {

                    // set move queue
                    column.moveQueue = false;
                }
            })
        })

        // update UI
        this.setState({
            plotPoints,
            plantQueuedToMove,
            selectedPlotPoint: null
        }, () => {
            this.startShake();
        });
    }

    async movePlant(plotPoint, selectedRowIndex, selectedColumnIndex) {

        // check to see if there's already a plant in the target plot point {...}
        if (plotPoint.plant) {

            // if selected plot point plant is the same as plant that is queued to move {...}
            if ((plotPoint.group === this.state.plantQueuedToMove.group) && (plotPoint.plant.id._id === this.state.plantQueuedToMove.plant.id._id)) {

                // cancel function
                return;
            } else {
                // render warning
                return alert('There is already a plant in that location, please select another space.');
            }
        } else {

            // update selected x and y positions
            this.setState({
                selectedRowIndex,
                selectedColumnIndex
            }, async () => {

                // get plant to move
                const plantToMove = this.state.plantQueuedToMove.plant;

                // remove queued plants
                await this.removeQueuedPlants();

                // add new plants
                await this.addPlant({ selectedPlants: [plantToMove], plant: plantToMove });

                // update UI
                this.setState({
                    plantQueuedToMove: null
                }, () => {
                    // stop plant animation
                    Animated.timing(this.shakeAnimation).stop();
                })
            })
        }
    }

    async removeQueuedPlants() {

        // get plot points
        let plotPoints = this.state.plotPoints;

        // iterate through plot points
        plotPoints.forEach((row) => {

            // iterate through rows
            row.forEach((column) => {

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
            })
        })

        // update UI
        this.setState({
            plotPoints,
        });
    }

    getPlantContainerTransform(quadrantSize) {
        switch (quadrantSize) {
            case 1:
                return [
                    { scale: 0.9 },
                    { translateX: 0 },
                    { translateY: 0 },
                ];
            case 4:
                return [
                    { scale: 1.8 },
                    { translateX: -10.25 },
                    { translateY: -10.25 },
                ];
            case 9:
                return [
                    { scale: 2.85 },
                    { translateX: -14 },
                    { translateY: -14 },
                ];
            case 16:
                return [
                    { scale: 3.75 },
                    { translateX: -16 },
                    { translateY: -15.5 },
                ];
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
                    transform: [
                        { scale: 1.2 },
                        { translateX: 0 },
                        { translateY: 7 }
                    ],
                };
            case 4:
                return {
                    width: 20,
                    height: 20,
                    transform: [
                        { scale: 0.5 },
                        { translateX: 0 },
                        { translateY: 15 }
                    ],
                };
            case 9:
                return {
                    width: 20,
                    height: 20,
                    transform: [
                        { scale: 0.3 },
                        { translateX: 0 },
                        { translateY: 30 }
                    ],
                };
            case 16:
                return {
                    width: 20,
                    height: 20,
                    transform: [
                        { scale: 0.25 },
                        { translateX: 0 },
                        { translateY: 35 }
                    ],
                };
            default:
                return {};
        }
    }

    getPlantTextStyles(quadrantSize) {
        switch (quadrantSize) {
            case 1:
                return {
                    transform: [
                        { scale: this.state.scale },
                    ],
                };
            case 4:
                return {
                    transform: [
                        { scale: this.getTextScale((this.state.scale > 1.2 ? 0.40 : 0.45)) },
                        { translateY: this.getTextTranslateY(0) },
                    ],
                };
            case 9:
                return {
                    transform: [
                        { scale: this.getTextScale(0.28) },
                        { translateY: this.getTextTranslateY(-10) },
                    ],
                    width: 200,
                    textAlign: "center"
                };
            case 16:
                return {
                    transform: [
                        { scale: this.getTextScale(0.22) },
                        { translateY: this.getTextTranslateY(-20) }
                    ],
                    width: 200,
                    textAlign: "center"
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
                    useNativeDriver: true
                }),
                Animated.timing(this.shakeAnimation, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true
                }),
            ])
        ).start()
    }

    getSqFtBorder(row, column, rowsLength) {
        let leftSqX = false;
        let rightSqX = false;
        let topSqY = false;
        let border = {};
        const lastPlotPointY = (row === (rowsLength - 1));

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
                    borderTopColor: "white",
                    borderTopWidth: 3,
                    borderBottomColor: "white",
                    borderBottomWidth: 1,
                    borderRightColor: "white",
                    borderRightWidth: 1,
                    borderRightStyle: "dotted",
                    borderLeftColor: "white",
                    borderLeftWidth: 1.5,
                }
            } else if (rightSqX) {
                border = {
                    borderTopColor: "white",
                    borderTopWidth: 3,
                    borderBottomColor: "white",
                    borderBottomWidth: 1,
                    borderRightColor: "white",
                    borderRightWidth: 1.5,
                    borderLeftColor: "none",
                    borderLeftWidth: 0,
                }
            }
        } else {
            if (leftSqX) {
                border = {
                    borderTopColor: "none",
                    borderTopWidth: 0,
                    borderBottomColor: (lastPlotPointY) ? "white" : "none",
                    borderBottomWidth: (lastPlotPointY) ? 3 : 0,
                    borderRightColor: "white",
                    borderRightWidth: 1,
                    borderLeftColor: "white",
                    borderLeftWidth: 1.5,
                }
            } else if (rightSqX) {
                border = {
                    borderTopColor: "none",
                    borderTopWidth: 0,
                    borderBottomColor: (lastPlotPointY) ? "white" : "none",
                    borderBottomWidth: (lastPlotPointY) ? 3 : 0,
                    borderRightColor: "white",
                    borderRightWidth: 1.5,
                    borderLeftColor: "none",
                    borderLeftWidth: 0,
                }
            }
        }

        return border;
    }

    handlePinch(e) {
        const scale = e.nativeEvent.scale;
        if (scale > 1 && scale < 1.5) {
            this.setState({ scale: e.nativeEvent.scale });
        }
    }

    handlePan(e) {
        this.onGestureEvent(e);
    }

    onHandlerStateChange = (event) => {

        // if change to panning state {...}
        if (event.nativeEvent.oldState === State.ACTIVE) {

            // get x, y coordinates
            const x = event.nativeEvent.translationX;
            const y = event.nativeEvent.translationY;

            // get direction
            const leftToRight = (x > 0);
            const rightToLeft = (x < 0);
            const upToDown = (y > 0);
            const downToUp = (y < 0);

            // get current scale
            const scale = this.state.scale;

            // set initial offset
            let xOffset = 0;
            let yOffset = 0;

            // if user is pulling from left to right {...}
            if (leftToRight) {

                if (scale > 1.1 && scale < 1.2) {
                    xOffset = 10;
                } else if (scale > 1.2 && scale < 1.3) {
                    xOffset = 20;
                } else if (scale > 1.3 && scale < 1.4) {
                    xOffset = 30;
                } else if (scale > 1.4 && scale < 1.5) {
                    xOffset = 40;
                }
            } else if (rightToLeft) { // if user is pulling from right to left
                if (scale > 1.1 && scale < 1.2) {
                    xOffset = -10;
                } else if (scale > 1.2 && scale < 1.3) {
                    xOffset = -20;
                } else if (scale > 1.3 && scale < 1.4) {
                    xOffset = -30;
                } else if (scale > 1.4 && scale < 1.5) {
                    xOffset = -40;
                }
            }

            // if user is pulling from top to bottom {...}
            if (upToDown) {
                if (scale > 1.1 && scale < 1.2) {
                    yOffset = 20;
                } else if (scale > 1.2 && scale < 1.3) {
                    yOffset = 30;
                } else if (scale > 1.3 && scale < 1.4) {
                    yOffset = 90;
                } else if (scale > 1.4 && scale < 1.5) {
                    yOffset = 90;
                }
            } else if (downToUp) { // if user is pulling from bottom to top {...}
                if (scale > 1.1 && scale < 1.2) {
                    yOffset = -100;
                } else if (scale > 1.2 && scale < 1.3) {
                    yOffset = -100;
                } else if (scale > 1.3 && scale < 1.4) {
                    yOffset = -120;
                } else if (scale > 1.4 && scale < 1.5) {
                    yOffset = -120;
                }
            }

            // set last offset
            this.lastOffset.x += event.nativeEvent.translationX;
            this.lastOffset.y += event.nativeEvent.translationY;

            // set x offset
            this.translateX.setOffset(xOffset);
            this.translateX.setValue(0);

            // set y offset
            this.translateY.setOffset(yOffset);
            this.translateY.setValue(0);
        }
    };

    renderPlotPoints() {

        // get interpolated value for queued plant animation
        const interpolated = this.shakeAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: ["-5deg", "5deg"],
        });

        // set animated style
        const animatedStyle = [{ rotate: interpolated }];

        return (
            <PinchGestureHandler
                onGestureEvent={(e) => this.handlePinch(e)}>
                <PanGestureHandler
                    onGestureEvent={(e) => this.handlePan(e)}
                    onHandlerStateChange={this.onHandlerStateChange}>
                    <Animated.View
                        style={{
                            transform: [
                                { scale: this.state.scale },
                                { translateX: this.translateX },
                                { translateY: this.translateY },
                            ],
                        }}>
                        {/* rows */}
                        {this.state.plotPoints.map((row, i) => {
                            return (
                                <View key={i} style={{ display: 'flex', flexDirection: 'row' }}>

                                    {/* columns */}
                                    {row.map((column, index) => {

                                        // set border style
                                        const sqftBorder = this.getSqFtBorder(i, index, this.state.plotPoints.length, row.length);

                                        // set initial plant styles
                                        let plantContainerTransform = null;
                                        let plantImageStyles = null;
                                        let plantTextStyles = null;
                                        let plantQueuedToMove = false;

                                        // if column has a plant {...}
                                        if (column.plant) {

                                            // set the plant styles to scale based on quadrant size
                                            plantContainerTransform = this.getPlantContainerTransform(column.plant.id.quadrant_size);
                                            plantImageStyles = this.getPlantImageStyles(column.plant.id.quadrant_size);
                                            plantTextStyles = this.getPlantTextStyles(column.plant.id.quadrant_size);

                                            // if selected plot point {...}
                                            if (this.state.selectedRowIndex === i && this.state.selectedColumnIndex === index) {

                                                // if column is in the move queue {...}
                                                if (column.moveQueue) {

                                                    // update plant queue status
                                                    plantQueuedToMove = true;
                                                }
                                            }
                                        }

                                        // render plot point
                                        return (
                                            <View key={index}>
                                                <Popover
                                                    placement={(column.plant && column.plant.id.quadrant_size > 1) ? 'floating' : 'auto'}
                                                    isVisible={column.selected && (column.id === ((i * row.length) + (index + 1)))}
                                                    onRequestClose={() => this.selectPlotPoint(column, i, index)}
                                                    from={(
                                                        <TouchableWithoutFeedback onPress={() => {
                                                            this.selectPlotPoint(column, i, index);
                                                        }}>
                                                            <View
                                                                style={{
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    width: 40,
                                                                    height: 40,
                                                                    backgroundColor: (column.selected) ? colors.purple4 : colors.greenD10,
                                                                    ...sqftBorder
                                                                }}>
                                                                {(index === 0 && i === 0 && !(this.props.drafts.find((draft) => draft.key === this.props.bedId))) && (
                                                                    <View style={{
                                                                        backgroundColor: colors.green0,
                                                                        borderRadius: 10
                                                                    }}>
                                                                        <Ionicons
                                                                            name={'add'}
                                                                            color={colors.purple0}
                                                                            size={fonts.h3}
                                                                        />
                                                                    </View>
                                                                )}
                                                                {column.image && (
                                                                    <>
                                                                        <View style={{
                                                                            position: 'absolute',
                                                                            top: 0,
                                                                            left: 0,
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            backgroundColor: colors.white50,
                                                                            transform: plantContainerTransform,
                                                                        }
                                                                        }>
                                                                            <View
                                                                                style={{
                                                                                    width: '100%',
                                                                                    height: '100%',
                                                                                    display: 'flex',
                                                                                    justifyContent: 'center',
                                                                                    alignItems: 'center',
                                                                                }}>
                                                                                <Animated.View style={{ transform: plantQueuedToMove ? animatedStyle : [] }}>
                                                                                    <Image
                                                                                        source={{ uri: column.image }}
                                                                                        style={plantImageStyles}
                                                                                    />
                                                                                </Animated.View>
                                                                                <Text
                                                                                    style={plantTextStyles}>
                                                                                    {column.plant.id.quadrant_size > 1 && column.plant.id.common_type.name}
                                                                                </Text>
                                                                            </View>
                                                                        </View>
                                                                    </>
                                                                )}
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                    )}>
                                                    <TouchableOpacity
                                                        style={{
                                                            display: (this.state.selectedPlotPoint && this.state.selectedPlotPoint.plant) ? 'none' : 'flex'
                                                        }}
                                                        onPress={async () => {
                                                            // if plant already in selected plot point {...}
                                                            if (this.state.selectedPlotPoint.plant) {

                                                                // render warning
                                                                alert('The selected space already has a plant. If you want to replace with a different plant, delete the current plant and try again.');
                                                            } else {

                                                                // de-select plot point
                                                                await this.selectPlotPoint(column, i, index);

                                                                // NOTE: Must set timeout to allow the popover animiation to finish
                                                                setTimeout(() => {

                                                                    // update UI
                                                                    this.setState({ plantMenuIsOpen: true });
                                                                }, 500)
                                                            }
                                                        }
                                                        }>
                                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: units.unit3 }}>
                                                            <Ionicons
                                                                name={'add'}
                                                                color={colors.purpleB}
                                                                size={fonts.h3}
                                                            />
                                                            <Text style={{ fontWeight: 'bold', color: colors.purpleB, marginLeft: units.unit2 }}>Add</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={{
                                                            display: (this.state.selectedPlotPoint && this.state.selectedPlotPoint.plant) ? 'flex' : 'none'
                                                        }}
                                                        onPress={() => this.addPlantToMoveQueue(column)}>
                                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: units.unit3 }}>
                                                            <Ionicons
                                                                name={'move-outline'}
                                                                color={colors.purpleB}
                                                                size={fonts.h3}
                                                            />
                                                            <Text style={{ fontWeight: 'bold', color: colors.purpleB, marginLeft: units.unit2 }}>Move</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={{
                                                            display: (this.state.selectedPlotPoint && this.state.selectedPlotPoint.plant) ? 'flex' : 'none'
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
                                                                    selectedPlant: selectedPlant
                                                                });
                                                            }, 500)
                                                        }}>
                                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: units.unit3 }}>
                                                            <Ionicons
                                                                name={'information-circle-outline'}
                                                                color={colors.purpleB}
                                                                size={fonts.h3}
                                                            />
                                                            <Text style={{ fontWeight: 'bold', color: colors.purpleB, marginLeft: units.unit2 }}>Info</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={{
                                                            display: (this.state.selectedPlotPoint && this.state.selectedPlotPoint.plant) ? 'flex' : 'none'
                                                        }}
                                                        onPress={() => this.removePlant()}>
                                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: units.unit3 }}>
                                                            <Ionicons
                                                                name={'trash-outline'}
                                                                color={colors.purpleB}
                                                                size={fonts.h3}
                                                            />
                                                            <Text style={{ fontWeight: 'bold', color: colors.purpleB, marginLeft: units.unit2 }}>Remove</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </Popover>
                                            </View>
                                        )
                                    })}
                                </View>
                            )
                        })}
                    </Animated.View>
                </PanGestureHandler>
            </PinchGestureHandler>
        )
    }

    renderSavingIndicator() {
        switch (this.state.isSaving) {
            case true:
                return (
                    <Text style={{ textAlign: 'center', marginTop: units.unit3, color: colors.greenE50 }}>Saving...</Text>
                )
            case false:
                return (
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', marginTop: units.unit3 }}>Saved Draft</Text>
                        <Ionicons
                            name={'checkmark'}
                            color={colors.greenB}
                            size={fonts.h2}
                        />
                    </View>
                )
            default:
                return <View></View>
        }
    }

    render() {
        const {
            isLoading,
            plantMenuIsOpen,
            plantInfoIsOpen,
            selectedPlant,
            vegetables,
            herbs,
            fruit
        } = this.state;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <ScrollView>
                    <View>

                        {/* loading indicator (dynamically visible) */}
                        <LoadingIndicator
                            loading={isLoading}
                        />

                        {/* plant menu (dynamically visible) */}
                        {vegetables && herbs && fruit && (
                            <PlantMenu
                                isOpen={plantMenuIsOpen}
                                vegetables={vegetables}
                                herbs={herbs}
                                fruit={fruit}
                                close={() => this.setState({ plantMenuIsOpen: false })}
                                addPlant={async (p) => {

                                    // get render info
                                    const renderInfo = await this.getRenderInfo(
                                        p,
                                        this.state.selectedRowIndex,
                                        this.state.selectedColumnIndex
                                    );

                                    // get available plot points
                                    const availablePlotPoints = await this.getAvailablePlotPoints();

                                    // set initial available plot point count
                                    let availablePlotPointCount = 0;

                                    // increment count based on available plot points
                                    availablePlotPoints.forEach((row) => availablePlotPointCount += row.length);

                                    // if total quadrant size area is greater than spaces available {...}
                                    if ((renderInfo.quadrantSize * p.selectedPlants.length) > availablePlotPointCount) {
                                        // show error
                                        return alert(`There is not enough space available to plant (${p.selectedPlants.length}) "${p.plant.id.common_type.name}"`);
                                    } else {

                                        // add plant
                                        this.addPlant(p);
                                    }
                                }}
                            />
                        )}

                        {/* plant info (dynamically visible) */}
                        {(selectedPlant) && (
                            <PlantInfo
                                isOpen={plantInfoIsOpen}
                                selectedPlant={selectedPlant}
                                close={() => this.setState({ plantInfoIsOpen: false })}
                            />
                        )}

                        {/* helper text */}
                        <Text style={{
                            paddingHorizontal: units.unit4,
                            paddingBottom: units.unit3,
                            textAlign: 'center',
                            color: !(this.props.drafts.find((draft) => draft.key === this.props.bedId)) ? '#000' : '#fff'
                        }}>
                            Tap on any square to get started
                        </Text>

                        {/* id / stats */}
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: units.unit4, marginBottom: units.unit3 }}>
                            <Paragraph style={{ ...fonts.label }}>Bed Id: {this.props.bedId}</Paragraph>
                            <Paragraph style={{ ...fonts.label }}>{calculatePlantingProgress(this.props.drafts.find((draft) => draft.key === this.props.bedId))}</Paragraph>
                        </View>

                        {/* garden map */}
                        <View style={{ display: 'flex', alignSelf: 'center' }}>
                            {this.renderPlotPoints()}
                        </View>

                        {/* saving indicator */}
                        <View>
                            {this.renderSavingIndicator()}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        drafts: state.drafts,
        beds: state.beds
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            createDraft,
            updateDraft,
            getDrafts
        },
        dispatch,
    );
}

GardenMap = connect(mapStateToProps, mapDispatchToProps)(GardenMap);

export default GardenMap;

module.exports = GardenMap;