// libraries
import React, { Component } from 'react';
import { View, Modal, Text, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// UI components
import Header from '../UI/Header';
import Link from '../UI/Link';
import Dropdown from '../UI/Dropdown';
import Button from '../UI/Button';

// actions
import {
    createToken,
    createCustomer,
    deleteCard,
    createCard,
} from '../../actions/cards/index';
import { updateUser } from '../../actions/user/index';
import { getPlants } from '../../actions/plants/index';

// styles
import units from '../styles/units';
import fonts from '../styles/fonts';
import colors from '../styles/colors';
import card from '../styles/card';

class SubstitutionMenu extends Component {

    state = {
        qty: 0,
        plants: []
    };

    async componentDidUpdate(prevProps) {
        if (prevProps.isOpen !== this.props.isOpen) {
            if (this.props.selectedPlant) {
                const plants = await this.props.getPlants(`common_type=${this.props.selectedPlant.id.common_type._id}`, true);

                let dropdownFormatData = [];

                plants.forEach((plant) => {

                    if (`${plant.name} ${plant.common_type.name}` !== `${this.props.selectedPlant.id.name} ${this.props.selectedPlant.id.common_type.name}`) {
                        dropdownFormatData.push({
                            label: `${plant.name} ${plant.common_type.name}`,
                            value: plant
                        })
                    }
                })

                this.setState({ plants: dropdownFormatData });
            }
        }
    }

    confirm() {
        const newPlant = {
            id: this.state.substitutePlant,
            key: this.props.selectedPlant.key,
            qty: this.props.selectedPlant.qty
        }

        this.props.onConfirm(newPlant);

        this.props.close();
    }

    render() {

        const { plants, substitutePlant } = this.state;

        const {
            selectedPlant,
            isOpen = false,
            close,
        } = this.props;

        if (selectedPlant) {
            return (
                /* plant modal */
                <Modal
                    animationType="slide"
                    presentationStyle="fullScreen"
                    visible={isOpen}>
                    <View
                        style={{
                            height: '100%',
                            backgroundColor: colors.greenE10,
                            paddingVertical: units.unit6,
                            paddingHorizontal: units.unit4 + units.unit3,
                            paddingBottom: units.unit6
                        }}>
                        <Link
                            icon={
                                <Ionicons
                                    name="chevron-back"
                                    size={fonts.h3}
                                    color={colors.purpleB}
                                />
                            }
                            text={'Back'}
                            onPress={() => close()}
                        />

                        {/* header */}
                        <Header
                            style={{
                                ...fonts.header,
                                paddingTop: units.unit2,
                                paddingBottom: units.unit4,
                            }}>
                            Substitute Plant
                        </Header>

                        {/* selected plant */}
                        <View
                            style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'stretch',
                                flexDirection: 'row',
                                marginBottom: units.unit5,
                            }}>
                            <View style={{width: '45%'}}>
                                <Text style={{ ...fonts.label }}>Selected Plant</Text>
                                <View
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        ...card,
                                        paddingHorizontal: units.unit4,
                                        flexGrow: 1
                                    }}>
                                    <Image
                                        style={{
                                            height: units.unit5,
                                            width: units.unit5,
                                            borderRadius: units.unit3,
                                            marginTop: units.unit3
                                        }}
                                        source={{
                                            uri: selectedPlant.id.common_type.image,
                                        }}
                                    />
                                    <Text style={{
                                        ...fonts.header,
                                        fontSize: fonts.h4,
                                        color: colors.purpleB,
                                        width: '100%',
                                        lineHeight: fonts.h4,
                                        textAlign: 'center'
                                    }}>
                                        {selectedPlant ? `${selectedPlant.id.name} ${selectedPlant.id.common_type.name}` : null}
                                    </Text>
                                    <Text style={{ ...fonts.small, color: colors.greenD50 }}>
                                        {selectedPlant.id.botanical_type.name}
                                    </Text>
                                </View>
                            </View>

                            {/* arrow */}
                            <View style={{ marginTop: fonts.h4, display: 'flex', justifyContent: 'center' }}>
                                <Ionicons
                                    name="arrow-forward"
                                    size={fonts.h1}
                                    color={colors.greenA}
                                />
                            </View>

                            {/* new plant */}
                            <View style={{width: '45%'}}>
                                <Text style={{ ...fonts.label }}>New Plant</Text>
                                <View
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        ...card,
                                        paddingHorizontal: units.unit4,
                                        flexGrow: 1
                                    }}>
                                    <Image
                                        style={{
                                            height: units.unit5,
                                            width: units.unit5,
                                            borderRadius: units.unit3,
                                            marginTop: units.unit3
                                        }}
                                        source={{
                                            uri: selectedPlant.id.common_type.image,
                                        }}
                                    />
                                    <Text
                                        style={{
                                            ...fonts.header,
                                            fontSize: fonts.h4,
                                            color: colors.purpleB,
                                            width: '100%',
                                            lineHeight: fonts.h4,
                                            textAlign: 'center'
                                        }}>
                                        {substitutePlant ? `${substitutePlant.name} ${substitutePlant.common_type.name}` : 'Plant Name'}
                                    </Text>
                                    <Text
                                        style={{
                                            ...fonts.small, color: colors.greenD50 
                                        }}>
                                        {substitutePlant ? `${substitutePlant.botanical_type.name}` : 'Botanical Type'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* plant selection */}
                        <Dropdown
                            label="Plants"
                            onChange={value => this.setState({ substitutePlant: value })}
                            options={plants}
                            placeholder="Choose a new varietal"
                        />

                        {/* confirm button */}
                        <Button
                            disabled={!substitutePlant}
                            style={{ marginTop: units.unit4 }}
                            text="Confirm Change"
                            onPress={() => this.confirm()}
                            icon={(
                                <Ionicons
                                    name="checkmark"
                                    size={units.unit4}
                                    color={colors.purpleB}
                                />
                            )}
                        />
                    </View>
                </Modal>
            );
        } else {
            return <View></View>
        }
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
            getPlants
        },
        dispatch,
    );
}

SubstitutionMenu = connect(mapStateToProps, mapDispatchToProps)(SubstitutionMenu);

export default SubstitutionMenu;

module.exports = SubstitutionMenu;
