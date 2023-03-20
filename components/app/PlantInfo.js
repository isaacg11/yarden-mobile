// libraries
import React, { Component } from 'react';
import { View, Modal, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

// UI components
import Header from '../UI/Header';
import Paragraph from '../UI/Paragraph';
import Button from '../UI/Button';

// actions
import {
    createToken,
    createCustomer,
    deleteCard,
    createCard,
} from '../../actions/cards/index';
import { updateUser } from '../../actions/user/index';

// helpers
import capitalize from '../../helpers/capitalize';

// styles
import units from '../styles/units';
import fonts from '../styles/fonts';
import colors from '../styles/colors';
import types from '../../vars/types';

class PlantInfo extends Component {

    state = {
        qty: 0
    };

    render() {
        const {
            user,
            selectedPlant,
            order,
            isOpen = false,
            close,
            navigateToNotes,
            navigateToHarvestInstructions
        } = this.props;

        return (
            <Modal
                animationType="slide"
                visible={isOpen}
                transparent={true}>
                <View
                    style={{
                        height: '60%',
                        marginTop: 'auto',
                        backgroundColor: colors.white,
                        borderTopColor: colors.purpleB,
                        borderTopWidth: 1
                    }}>
                    <View style={{ display: 'flex', alignItems: 'center' }}>

                        {/* close button */}
                        <TouchableOpacity
                            onPress={() => close()}>
                            <Ionicons
                                name={'remove-outline'}
                                color={colors.purpleB}
                                size={units.unit6}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ padding: units.unit4 }}>

                        {/* plant image */}
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: units.unit5}}>
                            <Image
                                source={{ uri: selectedPlant.id.image }}
                                style={{
                                    width: units.unit6 + units.unit5,
                                    height: units.unit6 + units.unit5,
                                    borderRadius: units.unit6,
                                }}
                            />
                        </View>

                        {/* header section */}
                        <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between' }}>
                            <Header
                                style={{
                                    ...fonts.header
                                }}>
                                {selectedPlant.id.name} {selectedPlant.id.common_type.name}
                            </Header>
                            {(user.type === types.GARDENER) && (order.type === types.FULL_PLAN || order.type === types.ASSISTED_PLAN) && (
                                <TouchableOpacity
                                    onPress={() => {
                                        navigateToNotes(selectedPlant);
                                        close();
                                    }}>
                                    <Ionicons
                                        name={'chatbubbles'}
                                        color={colors.purpleB}
                                        size={units.unit5}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* plant info */}
                        <View style={{ marginTop: units.unit3 }}>
                            <View style={{ marginBottom: units.unit3 }}>
                                <Paragraph style={{ fontStyle: 'italic', color: colors.purpleC }}>{selectedPlant.id.family_type.name} {selectedPlant.id.botanical_type.name}</Paragraph>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Paragraph style={{ fontWeight: 'bold', flex: 1 }}>
                                    Planted On
                                </Paragraph>
                                <Paragraph style={{ flex: 1 }}>
                                    {moment(selectedPlant.dt_planted).format('MM/DD/YYYY')}
                                </Paragraph>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Paragraph style={{ fontWeight: 'bold', flex: 1 }}>
                                    Harvest After
                                </Paragraph>
                                <Paragraph style={{ flex: 1 }}>
                                    {moment(selectedPlant.dt_planted).add(selectedPlant.id.days_to_mature, 'days').format('MM/DD/YYYY')}
                                </Paragraph>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Paragraph style={{ fontWeight: 'bold', flex: 1 }}>
                                    Category
                                </Paragraph>
                                <Paragraph style={{ flex: 1 }}>
                                    {capitalize(selectedPlant.id.category.name)}
                                </Paragraph>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Paragraph style={{ fontWeight: 'bold', flex: 1 }}>
                                    Growth Style
                                </Paragraph>
                                <Paragraph style={{ flex: 1 }}>
                                    {capitalize(selectedPlant.id.growth_style.name)}
                                </Paragraph>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Paragraph style={{ fontWeight: 'bold', flex: 1 }}>
                                    Season
                                </Paragraph>
                                <Paragraph style={{ flex: 1 }}>
                                    {capitalize(selectedPlant.id.season)}
                                </Paragraph>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Paragraph style={{ fontWeight: 'bold', flex: 1 }}>
                                    Partial Sun
                                </Paragraph>
                                <Paragraph style={{ flex: 1 }}>
                                    {selectedPlant.id.partial_sun ? "Yes" : "No"}
                                </Paragraph>
                            </View>
                        </View>

                        {/* harvest instructions button */}
                        <View style={{ marginTop: units.unit4 }}>
                            <Button
                                small
                                text="View Harvest Instructions"
                                variant="btn2"
                                onPress={() => {
                                    navigateToHarvestInstructions(selectedPlant);
                                    close();
                                }}
                            />
                        </View>

                    </View>
                </View>
            </Modal>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            createToken,
            createCustomer,
            updateUser,
            deleteCard,
            createCard,
        },
        dispatch,
    );
}

PlantInfo = connect(mapStateToProps, mapDispatchToProps)(PlantInfo);

export default PlantInfo;

module.exports = PlantInfo;
