// libaries
import React, { Component } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

// UI components
import Paragraph from '../UI/Paragraph';
import Radio from '../UI/Radio';
import CircularButton from '../UI/CircularButton';
import Header from '../UI/Header';
import Button from '../UI/Button';
import Label from '../UI/Label';
import { alert } from '../UI/SystemAlert';

// actions
import { getPlantActivities } from '../../actions/plantActivities/index';

// types
import types from '../../vars/types';

// styles
import colors from '../styles/colors';
import units from '../styles/units';

class HarvestMenu extends Component {

    state = {
        plantQty: 0,
        harvestType: types.PARTIAL_HARVEST
    }

    async componentDidMount() {
        const bed = this.props.beds.find((b) => b.key === this.props.bedId);

        // get plant activities
        await this.props.getPlantActivities(`type=${types.HARVESTED}&owner=${this.props.user._id}&customer=${this.props.selectedOrder.customer._id}&order=${this.props.selectedOrder._id}&plant=${this.props.selectedPlotPoint.plant.id._id}&bed=${bed._id}&key=${this.props.selectedPlotPoint.plant.key}`);
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
            harvest: this.state.harvestType
        })

        // close modal
        this.props.close();

        // reset plant qty
        this.setState({ plantQty: 0 });
    }

    render() {

        const {
            isOpen = false,
            close,
            selectedPlotPoint,
            plantActivities
        } = this.props;

        const { plantQty } = this.state;
        const lastHarvestDate = (plantActivities.length > 0) ? `Last harvested: ${moment(plantActivities[0].dt_created).format('MM/DD/YY')}` : 'No harvests found';

        return (
            <Modal
                animationType="slide"
                visible={isOpen}
                transparent={true}
            >
                <View
                    style={{
                        height: '60%',
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
                        <View style={{ paddingBottom: units.unit4, alignItems: 'center' }}>
                            <Label style={{ marginTop: units.unit3 }}>{lastHarvestDate}</Label>
                            <Label style={{ marginTop: units.unit3 }}>ID: {selectedPlotPoint.plant.key}</Label>
                        </View>

                        {/* question */}
                        <View style={{ paddingHorizontal: units.unit4 }}>
                            <Paragraph style={{ textAlign: 'center' }}>How much did you harvest from the selected plant?</Paragraph>
                        </View>
                    </View>

                    <View style={{ padding: units.unit4, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: units.unit3 }}>

                        {/* subtract button */}
                        <View style={{ alignSelf: 'center' }}>
                            <CircularButton
                                small
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
                            <Header >{plantQty}</Header>
                        </View>

                        {/* add button */}
                        <View style={{ alignSelf: 'center' }}>
                            <CircularButton
                                small
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

                    {/* radio buttons */}
                    <View style={{ padding: units.unit4, paddingTop: 0 }}>
                        <Radio
                            defaultValue="partial"
                            options={
                                [
                                    { name: 'Part of plant', value: types.PARTIAL_HARVEST, helperText: 'Plant was not ready to pull, kept in garden for additional harvests' },
                                    { name: 'Full plant', value: types.FULL_HARVEST, helperText: 'Plant reached end of life, final harvest was performed & plant removed' }
                                ]
                            }
                            onChange={(value) => this.setState({ harvestType: value })}
                        />
                    </View>

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