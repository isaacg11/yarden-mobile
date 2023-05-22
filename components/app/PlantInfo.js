// libraries
import React, { Component } from 'react';
import { View, Modal, TouchableOpacity, Image, Text } from 'react-native';
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
                        height: '55%',
                        marginTop: 'auto',
                        backgroundColor: colors.white,
                        borderTopColor: colors.purpleB,
                        borderTopWidth: 1
                    }}>
                    <View style={{ display: 'flex', alignItems: 'center' }}>

                        {/* close button */}
                        <TouchableOpacity
                            style={{ padding: 0, margin: 0, height: 50 }}
                            onPress={() => close()}>
                            <Ionicons
                                name={'remove-outline'}
                                color={colors.purpleB}
                                size={units.unit6}
                            />
                        </TouchableOpacity>
                    </View>
                    {(user.type === types.GARDENER) && (order.type === types.FULL_PLAN || order.type === types.ASSISTED_PLAN) && (
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                right: units.unit4,
                                top: units.unit4
                            }}
                            onPress={() => {
                                navigateToNotes(selectedPlant);
                                close();
                            }}>
                            <Ionicons
                                name={'create'}
                                color={colors.purpleB}
                                size={units.unit5}
                            />
                        </TouchableOpacity>
                    )}
                    <View style={{ paddingVertical: 0, paddingHorizontal: units.unit5 }}>

                        {/* plant image */}
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: units.unit3 }}>
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
                                    textAlign: 'center',
                                    width: '100%',
                                    ...fonts.header,
                                }}>
                                {selectedPlant.id.name} {selectedPlant.id.common_type.name}
                            </Header>
                        </View>

                        {/* plant info */}
                        <View>
                            <View style={{ marginBottom: units.unit5 }}>
                                <Text style={{ textAlign: 'center', fontStyle: 'italic', color: colors.purpleD50 }}>{selectedPlant.id.family_type.name} {selectedPlant.id.botanical_type.name}</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Paragraph style={{ flex: 1 }}>
                                    Planted On
                                </Paragraph>
                                <Text style={{ flex: 1, color: colors.greenD50 }}>
                                    {moment(selectedPlant.dt_planted).format('MM/DD/YYYY')}
                                </Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Paragraph style={{ flex: 1 }}>
                                    Harvest After
                                </Paragraph>
                                <Text style={{ flex: 1, color: colors.greenD50 }}>
                                    {moment(selectedPlant.dt_planted).add(selectedPlant.id.days_to_mature, 'days').format('MM/DD/YYYY')}
                                </Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Paragraph style={{ flex: 1 }}>
                                    Category
                                </Paragraph>
                                <Text style={{ flex: 1, color: colors.greenD50 }}>
                                    {capitalize(selectedPlant.id.category.name)}
                                </Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Paragraph style={{ flex: 1 }}>
                                    Growth Style
                                </Paragraph>
                                <Text style={{ flex: 1, color: colors.greenD50 }}>
                                    {capitalize(selectedPlant.id.growth_style.name)}
                                </Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Paragraph style={{ flex: 1 }}>
                                    Season
                                </Paragraph>
                                <Text style={{ flex: 1, color: colors.greenD50 }}>
                                    {capitalize(selectedPlant.id.season)}
                                </Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Paragraph style={{ flex: 1 }}>
                                    Partial Sun
                                </Paragraph>
                                <Text style={{ flex: 1, color: colors.greenD50 }}>
                                    {selectedPlant.id.partial_sun ? "Yes" : "No"}
                                </Text>
                            </View>
                        </View>

                        {/* harvest instructions button */}
                        <View style={{ marginTop: units.unit4 }}>
                            <Button
                                small
                                text="View Harvest Instructions"
                                variant="btn2"
                                style={{
                                    paddingVertical: units.unit4
                                }}
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
            deleteCard,
            createCard,
        },
        dispatch,
    );
}

PlantInfo = connect(mapStateToProps, mapDispatchToProps)(PlantInfo);

export default PlantInfo;

module.exports = PlantInfo;
