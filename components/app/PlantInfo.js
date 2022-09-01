import React, { Component } from 'react';
import { View, Modal, Text, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Slider } from '@miblanchard/react-native-slider';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Collapse from '../UI/Collapse';
import Header from '../UI/Header';
import Paragraph from '../UI/Paragraph';
import Link from '../UI/Link';
import Label from '../UI/Label';
import {
    createToken,
    createCustomer,
    deleteCard,
    createCard,
} from '../../actions/cards/index';
import { updateUser } from '../../actions/user/index';
import capitalize from '../../helpers/capitalize';
import units from '../styles/units';
import fonts from '../styles/fonts';
import colors from '../styles/colors';

class PlantInfo extends Component {

    state = {
        qty: 0
    };

    render() {
        const {
            selectedPlant,
            isOpen = false,
            close,
        } = this.props;

        return (
            /* plant modal */
            <Modal
                animationType="slide"
                visible={isOpen}
                transparent={true}>
                <View
                    style={{
                        height: '40%',
                        marginTop: 'auto',
                        backgroundColor: colors.white,
                        borderTopColor: colors.purpleB,
                        borderTopWidth: 1
                    }}>
                    <View style={{ display: 'flex', alignItems: 'center' }}>
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
                        <Header
                            style={{
                                ...fonts.header
                            }}>
                            {selectedPlant.id.name} {selectedPlant.id.common_type.name}
                        </Header>
                        <View style={{ marginTop: units.unit3 }}>
                            <View style={{ marginBottom: units.unit3 }}>
                                <Paragraph style={{ fontStyle: 'italic', color: colors.purpleC }}>{selectedPlant.id.family_type.name} {selectedPlant.id.botanical_type.name}</Paragraph>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Paragraph style={{ fontWeight: 'bold', flex: 1 }}>
                                    Category
                                </Paragraph>
                                <Paragraph style={{ flex: 2 }}>
                                    {capitalize(selectedPlant.id.category.name)}
                                </Paragraph>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Paragraph style={{ fontWeight: 'bold', flex: 1 }}>
                                    Season
                                </Paragraph>
                                <Paragraph style={{ flex: 2 }}>
                                    {capitalize(selectedPlant.id.season)}
                                </Paragraph>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Paragraph style={{ fontWeight: 'bold', flex: 1 }}>
                                    Growth Style
                                </Paragraph>
                                <Paragraph style={{ flex: 2 }}>
                                    {capitalize(selectedPlant.id.growth_style.name)}
                                </Paragraph>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Paragraph style={{ fontWeight: 'bold', flex: 1 }}>
                                    Partial Sun
                                </Paragraph>
                                <Paragraph style={{ flex: 2 }}>
                                    {selectedPlant.id.partial_sun ? "Yes" : "No"}
                                </Paragraph>
                            </View>
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
