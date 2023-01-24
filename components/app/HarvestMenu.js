// libaries
import React, { Component } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

// UI components
import Radio from '../UI/Radio';
import CircularButton from '../UI/CircularButton';
import Header from '../UI/Header';
import Button from '../UI/Button';
import Label from '../UI/Label';
import Dropdown from '../UI/Dropdown';
import { alert } from '../UI/SystemAlert';

// actions
import { getPlantActivities } from '../../actions/plantActivities/index';

// types
import types from '../../vars/types';

// helpers
import capitalize from '../../helpers/capitalize';

// styles
import colors from '../styles/colors';
import units from '../styles/units';

class HarvestMenu extends Component {

    state = {
        plantQty: 0,
        harvestType: types.PARTIAL_HARVEST,
        produceTypes: [],
        selectedProduceType: null
    }

    componentDidMount() {
        this.initHarvestMenu();
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevProps.isOpen !== this.props.isOpen) {
            if (this.props.isOpen) {
                this.initHarvestMenu();
            }
        }

        if (prevState.selectedProduceType !== this.state.selectedProduceType) {
            this.setState({
                plantQty: (this.state.selectedProduceType === types.HEAD) ? 1 : 0
            })
        }
    }

    async initHarvestMenu() {
        const bed = this.props.beds.find((b) => b.key === this.props.bedId);

        // get plant activities
        await this.props.getPlantActivities(`type=${types.HARVESTED}&owner=${this.props.user._id}&customer=${this.props.selectedOrder.customer._id}&order=${this.props.selectedOrder._id}&plant=${this.props.selectedPlotPoint.plant.id._id}&bed=${bed._id}&key=${this.props.selectedPlotPoint.plant.key}`);

        let produceTypes = [];

        if (this.props.selectedPlotPoint.plant.id.average_produce_weight > 0) {
            produceTypes.push({
                label: capitalize(this.props.selectedPlotPoint.plant.id.produce_type.name),
                value: this.props.selectedPlotPoint.plant.id.produce_type.name,
            });
        }

        if (this.props.selectedPlotPoint.plant.id.average_head_weight > 0) {
            produceTypes.push({
                label: 'Head',
                value: types.HEAD
            })
        }

        let selectedProduceType = produceTypes[0].value;
        const plantQty = (selectedProduceType === types.HEAD) ? 1 : this.state.plantQty;
        this.setState({
            produceTypes,
            selectedProduceType,
            plantQty
        });
    }

    add() {
        this.setState({ plantQty: this.state.plantQty + 1 });
    }

    subtract() {
        if (this.state.plantQty > 0) {
            this.setState({ plantQty: this.state.plantQty - 1 });
        }
    }

    confirm() {
        if (this.props.plantActivities.length > 0) {
            const lastHarvestDate = moment(this.props.plantActivities[0].dt_created).format('MM/DD/YY');
            const todaysDate = moment().format('MM/DD/YY');
            if (lastHarvestDate === todaysDate) {
                return alert(
                    'There was already a harvest recorded for this plant today. Do you still want to continue?',
                    'Duplicate Harvest',
                    () => this.setHarvest(),
                    true
                )
            }
        }

        this.setHarvest();
    }

    async setHarvest() {

        // run callback
        await this.props.onConfirm({
            column: this.props.selectedPlotPoint,
            qty: this.state.plantQty,
            harvest: this.state.harvestType,
            produceType: this.state.selectedProduceType
        })

        // close modal
        this.props.close();

        // reset plant qty
        this.setState({
            plantQty: 0,
            harvestType: types.PARTIAL_HARVEST
        });
    }

    render() {

        const {
            isOpen = false,
            close,
            selectedPlotPoint,
            plantActivities
        } = this.props;

        const {
            plantQty,
            produceTypes,
            selectedProduceType,
            harvestType
        } = this.state;

        const lastHarvestDate = (plantActivities.length > 0) ? `Last harvested: ${moment(plantActivities[0].dt_created).format('MM/DD/YY')}` : 'No harvests found';

        return (
            <Modal
                animationType="slide"
                visible={isOpen}
                transparent={true}
            >
                <View
                    style={{
                        height: '70%',
                        marginTop: 'auto',
                        backgroundColor: colors.white,
                        borderTopColor: colors.purpleB,
                        borderTopWidth: 1
                    }}
                >
                    <View style={{ display: 'flex', alignItems: 'center' }}>

                        {/* close button */}
                        <TouchableOpacity
                            onPress={() => close(true)}>
                            <Ionicons
                                name={'remove-outline'}
                                color={colors.purpleB}
                                size={units.unit6}
                            />
                        </TouchableOpacity>

                        {/* plant name */}
                        <View>
                            <Header>{selectedPlotPoint.plant.id.name} {selectedPlotPoint.plant.id.common_type.name}</Header>
                        </View>

                        {/* last harvest date */}
                        <View style={{ alignItems: 'center' }}>
                            <Label style={{ marginTop: units.unit3 }}>{lastHarvestDate}</Label>
                            <Label style={{ marginTop: units.unit3 }}>ID: {selectedPlotPoint.plant.key}</Label>
                        </View>
                    </View>

                    <View style={{ padding: units.unit4, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>

                        {/* subtract button */}
                        <View style={{ alignSelf: 'center' }}>
                            <CircularButton
                                small
                                disabled={(selectedProduceType === types.HEAD)}
                                variant="btn2"
                                icon={(<Ionicons
                                    name={'remove-outline'}
                                    color={colors.purpleB}
                                    size={fonts.h3}
                                />)}
                                onPress={() => this.subtract()}
                            />
                        </View>

                        {/* qty output */}
                        <View>
                            <Header >{(selectedProduceType === types.HEAD) ? 1 : plantQty}</Header>
                        </View>

                        {/* add button */}
                        <View style={{ alignSelf: 'center' }}>
                            <CircularButton
                                small
                                disabled={(selectedProduceType === types.HEAD)}
                                variant="btn2"
                                icon={(<Ionicons
                                    name={'add'}
                                    color={colors.purpleB}
                                    size={fonts.h3}
                                />)}
                                onPress={() => this.add()}
                            />
                        </View>
                    </View>

                    {/* produce type */}
                    <View style={{ paddingHorizontal: units.unit4, width: '100%', marginBottom: units.unit5 }}>
                        <Dropdown
                            label="Produce Type"
                            value={selectedProduceType}
                            onChange={value => {
                                this.setState({ 
                                    selectedProduceType: value,
                                    harvestType: (value === types.HEAD) ? types.FULL_HARVEST : harvestType
                                });
                            }}
                            options={produceTypes}
                        />
                    </View>

                    {/* radio buttons */}
                    {(selectedProduceType !== types.HEAD) && (
                        <View style={{ padding: units.unit4, paddingTop: 0 }}>
                            <Radio
                                defaultValue="partial"
                                options={
                                    [
                                        { name: 'Part of plant', value: types.PARTIAL_HARVEST, helperText: 'Plant was not ready to pull, kept in garden for additional harvests' },
                                        { name: 'Full plant', value: types.FULL_HARVEST, helperText: 'Plant reached end of life, final harvest was performed & plant removed' }
                                    ]
                                }
                                onChange={(value) => this.setState({
                                    harvestType: value
                                })}
                            />
                        </View>
                    )}

                    {/* continue button */}
                    <View style={{ paddingHorizontal: units.unit4, paddingBottom: units.unit5 }}>
                        <Button
                            disabled={plantQty < 1}
                            text="Confirm"
                            onPress={() => this.confirm()}
                        />
                    </View>

                </View>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        plantActivities: state.plantActivities,
        selectedOrder: state.selectedOrder,
        beds: state.beds
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getPlantActivities
        },
        dispatch,
    );
}

HarvestMenu = connect(mapStateToProps, mapDispatchToProps)(HarvestMenu);

export default HarvestMenu;

module.exports = HarvestMenu;