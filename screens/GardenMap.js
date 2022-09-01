
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PlantMenu from '../components/app/PlantMenu';
import PlantInfo from '../components/app/PlantInfo';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Header from '../components/UI/Header';
import Paragraph from '../components/UI/Paragraph';
import CircularButton from '../components/UI/CircularButton';
import { alert } from '../components/UI/SystemAlert';
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';
import generateUID from '../helpers/generateUID';

class GardenMap extends Component {

    state = {
        plotPoints: []
    }

    componentDidMount() {

        // show loading indicator
        this.setState({ isLoading: true });

        // set initial plot points list
        let plotPoints = [];

        // set initial plot points id
        let plotPointId = 0;

        // iterate by the number of quadrant rows
        for (let i = 0; i < this.props.route.params.quadrant.rows; i++) {

            // set initial row value
            let row = [];

            // iterate by the number of quadrant columns
            for (let j = 0; j < this.props.route.params.quadrant.columns; j++) {

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

        // set plants
        const vegetables = this.props.route.params.order.customer.garden_info.vegetables;
        const herbs = this.props.route.params.order.customer.garden_info.herbs;
        const fruit = this.props.route.params.order.customer.garden_info.fruit;

        // update UI
        this.setState({
            isLoading: false,
            plotPoints,
            vegetables,
            herbs,
            fruit
        });
    }

    selectPlotPoint(plotPoint) {

        // if a plant is queued to move {...}
        if (this.state.plantQueuedToMove) {

            // move plant
            return this.movePlant(plotPoint);
        }

        // get plot points
        let plotPoints = this.state.plotPoints;

        // set initial current position
        let currentPosition = -1;

        // set initial selected index
        let selectedIndex = 0;

        // set initial diff
        let diff = 0;

        // iterate through plot points
        plotPoints.forEach((row) => {

            // iterate through rows
            row.forEach((column) => {

                // increment current position
                currentPosition += 1;

                // if column id matches plot point id {...}
                if (column.id === plotPoint.id) {

                    // if column plant {...}
                    if (column.plant) {

                        // set selected index
                        selectedIndex = (currentPosition + (column.plant.id.quadrant_size - diff));
                    }

                    // set selected status
                    column.selected = !column.selected;
                } else {

                    // selected index {...}
                    if (selectedIndex) {

                        // if current position index is less than selected index {...}
                        if (
                            currentPosition < selectedIndex
                        ) {

                            // set selected status
                            column.selected = !column.selected;

                        } else {

                            // if column anchor does not match plot point anchor {...}
                            if (
                                // (column.plant && plotPoint.plant) &&
                                (column.anchor !== plotPoint.anchor)
                            ) {

                                // set selected status
                                column.selected = false;
                            }
                        }
                    } else {

                        // if column anchor matches plot point anchor {...}
                        if (
                            (column.plant && plotPoint.plant) &&
                            (column.anchor === plotPoint.anchor)
                        ) {

                            // increment diff
                            diff += 1;

                            // set selected status
                            column.selected = !column.selected;

                        } else {
                            // set selected status
                            column.selected = false;
                        }
                    }
                }
            })
        })

        // update UI
        this.setState({
            plotPoints,
            selectedPlotPoint: plotPoint
        });
    }

    async setExistingGroups(p) {
        // get plot points
        let plotPoints = this.state.plotPoints;

        // set initial existing groups
        let existingGroups = 0;

        for (let i = 0; i < plotPoints.length; i++) {
            for (let j = 0; j < plotPoints[i].length; j++) {
                let column = plotPoints[i][j];

                if (column.plant) {

                    // if column plant id matches selected plant id {...}
                    if (column.plant.id._id === p.plant.id._id) {
                        existingGroups += 1;
                    }
                }
            }
        }

        return existingGroups;
    }

    async addPlant(p) {

        // get quadrant size
        const quadrantSize = p.additionalQty * p.plant.id.quadrant_size;

        // get plot points
        let plotPoints = this.state.plotPoints;

        // set initial selected plot point
        let selectedPlotPoint = null;

        // set initial column index
        let columnIndex = -1;

        // set initial anchor
        let anchor = null;

        // set initial group number
        let groupNumber = 0;

        const existingGroups = await this.setExistingGroups(p);

        groupNumber += (existingGroups / p.plant.id.quadrant_size);

        // iterate through plot points
        plotPoints.forEach((row) => {

            // iterate through rows
            row.forEach((column) => {

                // increment row index
                columnIndex += 1;

                // if selected column found {...}
                if (column.selected) {

                    // set selected plot point
                    selectedPlotPoint = columnIndex;

                    // set selected status
                    column.selected = false;
                }

                // if selectedPlotPoint has been set {...}
                if (selectedPlotPoint !== null) {

                    // if row index is less than selected plot point index plus quadrant size {...}
                    if (columnIndex < (selectedPlotPoint + quadrantSize)) {

                        // set plant
                        column.plant = p.plant;
                    }

                    // if plant exists in column {...}
                    if (column.plant) {
                        const index = columnIndex;
                        const quadrantSize = p.plant.id.quadrant_size;
                        const selectedIndex = selectedPlotPoint;
                        const diffIndex = (index - selectedIndex);
                        const newPlantInstance = (diffIndex / quadrantSize);
                        const isNewInstance = Math.floor(newPlantInstance) == newPlantInstance;

                        // if new instance of plant {...}
                        if (isNewInstance) {

                            // set anchor
                            anchor = generateUID();

                            // set group number
                            groupNumber += 1;
                        }

                        // set anchor
                        column.anchor = anchor;
                        column.group = groupNumber;
                        column.image = column.plant.id.common_type.image;
                    }
                }
            })
        })

        // update UI
        this.setState({
            plotPoints
        }, () => {
            this.updatePlantedList(p.plant, p.additionalQty);
        });
    }

    updatePlantedList(p, qty) {

        // set initial plant category
        let plantCategory = null;

        // determine category
        if(p.id.category.name === 'vegetable') {
            plantCategory = 'vegetables';
        } else if(p.id.category.name === 'herb') {
            plantCategory = 'herbs';
        } else if(p.id.category.name === 'fruit') {
            plantCategory = 'fruit';
        }

        // get plants by category
        let plants = this.state[`${plantCategory}`];

        // iterate through plants
        plants.forEach((plant) => {

            // if matching plant is found {...}
            if(plant.id._id === p.id._id) {

                // calculate new planted value
                let currentPlanted = plant.planted ? plant.planted : 0;

                // set new planted value
                plant.planted = currentPlanted + qty;
            }
        })

        // update UI
        this.setState({
            [`${plantCategory}`]: plants
        })
    }

    removePlant() {

        // set initial plant value
        let p = null;

        // get plot points
        let plotPoints = this.state.plotPoints;

        // iterate through plot points
        plotPoints.forEach((row) => {

            // iterate through rows
            row.forEach((column) => {

                // if column is selected {...}
                if (column.selected) {

                    // set plant
                    p = column.plant;

                    // reset column (removes plant)
                    column.id = column.id;
                    column.plant = null;
                    column.selected = false;
                    delete column.moveQueue;
                    delete column.anchor;
                    delete column.group;
                    delete column.image;
                }
            })
        })

        // update UI
        this.setState({
            plotPoints
        }, () => {
            this.updatePlantedList(p, -1);
        });
    }

    addPlantToMoveQueue(c) {

        // if plot point has a plant {...}
        if (c.plant) {

            // get plot points
            let plotPoints = this.state.plotPoints;

            let plantQueuedToMove = false;

            // iterate through plot points
            plotPoints.forEach((row) => {

                // iterate through rows
                row.forEach((column) => {

                    // if column is selected {...}
                    if (column.anchor === c.anchor) {

                        // set move queue
                        column.moveQueue = !column.moveQueue;

                        plantQueuedToMove = (column.moveQueue) ? c : false;

                    } else {

                        // set move queue
                        column.moveQueue = false;
                    }
                })
            })

            // update UI
            this.setState({
                plotPoints,
                plantQueuedToMove
            });
        }
    }

    movePlant(plotPoint) {

        // if no plant is located in selected plot point {...}
        if (!plotPoint.plant) {

            // get plot points
            let plotPoints = this.state.plotPoints;

            // set selected plot point
            const selectedPlotPoint = (plotPoint.id - 1);

            // get plant queued to move
            const plantQueuedToMove = this.state.plantQueuedToMove;

            // set initial column index
            let columnIndex = -1;

            // iterate through plot points
            plotPoints.forEach((row) => {

                // iterate through rows
                row.forEach((column) => {

                    // increment column index
                    columnIndex += 1;

                    // if column is selected {...}
                    if ((columnIndex >= selectedPlotPoint) && (columnIndex < (selectedPlotPoint + plantQueuedToMove.plant.id.quadrant_size))) {

                        // set column info
                        column.id = column.id;
                        column.plant = plantQueuedToMove.plant;
                        column.anchor = plantQueuedToMove.anchor;
                        column.group = plantQueuedToMove.group;
                        column.image = plantQueuedToMove.image;
                    }
                })
            })

            // update UI
            this.setState({
                plotPoints,
                plantQueuedToMove: null
            });

            // remove queued plants
            this.removeQueuedPlants();
        }
    }

    removeQueuedPlants() {

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
                    delete column.anchor;
                    delete column.group;
                    delete column.image;
                }
            })
        })

        // update UI
        this.setState({
            plotPoints
        });
    }

    getPlantInfo() {

        // set initial selected plant
        let selectedPlant = null;

        // get plot points
        let plotPoints = this.state.plotPoints;

        // iterate through plot points
        plotPoints.forEach((row) => {

            // iterate through rows
            row.forEach((column) => {

                // if column is selected {...}
                if (column.selected) {

                    // set selected plant
                    selectedPlant = column.plant;
                }
            })
        })

        this.setState({
            plantInfoIsOpen: true,
            selectedPlant
        });
    }

    renderPlotPoints() {
        return (
            <View>
                {/* rows */}
                {this.state.plotPoints.map((row, i) => {
                    return (
                        <View key={i} style={{ display: 'flex', flexDirection: 'row' }}>
                            {/* columns */}
                            {row.map((column, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => this.selectPlotPoint(column)}
                                    onLongPress={() => this.addPlantToMoveQueue(column)}>
                                    <View
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: 60,
                                            height: 60,
                                            borderWidth: 1,
                                            borderColor: (column.moveQueue) ? 'blue' : 'black',
                                            backgroundColor: (column.selected) ? 'yellow' : 'white'
                                        }}>
                                        {column.image && (
                                            <Image
                                                source={{ uri: column.image }}
                                                style={{
                                                    width: 50,
                                                    height: 50,
                                                }}
                                            />
                                        )}

                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )
                })}
            </View>
        )
    }

    render() {
        const {
            isLoading,
            plantMenuIsOpen,
            plantInfoIsOpen,
            selectedPlant,
            selectedPlotPoint,
            vegetables,
            herbs,
            fruit
        } = this.state;
        const selectedQuadrant = this.props.route.params.quadrant.selectedQuadrant;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <ScrollView>
                    <View style={{ padding: units.unit3 + units.unit4 }}>

                        {/* loading indicator */}
                        <LoadingIndicator
                            loading={isLoading}
                        />

                        {/* plant menu */}
                        {vegetables && herbs && fruit && (
                            <PlantMenu
                                isOpen={plantMenuIsOpen}
                                vegetables={vegetables}
                                herbs={herbs}
                                fruit={fruit}
                                close={() => this.setState({ plantMenuIsOpen: false })}
                                addPlant={(plant) => this.addPlant(plant)}

                            />
                        )}

                        {/* plant info */}
                        {(selectedPlant) && (
                            <PlantInfo
                                isOpen={plantInfoIsOpen}
                                selectedPlant={selectedPlant}
                                close={() => this.setState({ plantInfoIsOpen: false })}
                            />
                        )}

                        {/* page header */}
                        <Header type="h4">
                            Section {selectedQuadrant}
                        </Header>
                        <Paragraph style={{ marginBottom: units.unit5, marginTop: units.unit3 }}>
                            Tap on any plot point to add a new plant. Long press to move a plant to another location.
                        </Paragraph>

                        {/* garden map */}
                        <View style={{ display: 'flex', alignSelf: 'center' }}>
                            {this.renderPlotPoints()}
                        </View>

                        {/* buttons */}
                        <View style={{ marginTop: units.unit5, display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                            <CircularButton
                                variant="btn2"
                                icon={
                                    <Ionicons
                                        name={'add'}
                                        color={colors.purpleB}
                                        size={fonts.h3}
                                    />
                                }
                                onPress={() => {
                                    if(selectedPlotPoint.plant) {
                                        alert('Your selected plot point already has a plant. If you want to start a different plant, delete the current plant and try again.');
                                    } else {
                                        this.setState({ plantMenuIsOpen: true });
                                    }
                                }}
                            />
                            <CircularButton
                                style={{ marginLeft: units.unit3 }}
                                variant="btn2"
                                icon={
                                    <Ionicons
                                        name={'trash'}
                                        color={colors.purpleB}
                                        size={fonts.h3}
                                    />
                                }
                                onPress={() => this.removePlant()}
                            />
                            <CircularButton
                                style={{ marginLeft: units.unit3 }}
                                variant="btn2"
                                icon={
                                    <Ionicons
                                        name={'information-outline'}
                                        color={colors.purpleB}
                                        size={fonts.h3}
                                    />
                                }
                                onPress={() => this.getPlantInfo()}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

GardenMap = connect(mapStateToProps, null)(GardenMap);

export default GardenMap;

module.exports = GardenMap;