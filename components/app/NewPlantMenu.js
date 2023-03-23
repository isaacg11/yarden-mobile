// libaries
import React, { Component } from 'react';
import { Modal, TouchableOpacity, View, Image, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// UI components
import Link from '../UI/Link';
import Input from '../UI/Input';
import Header from '../UI/Header';
import SizeIndicator from '../UI/SizeIndicator';
import Card from '../UI/Card';

// actions
import { getPlants } from '../../actions/plants/index';

// styles
import colors from '../styles/colors';
import units from '../styles/units';
import fonts from '../styles/fonts';

class NewPlantMenu extends Component {

    state = {
        search: ''
    }

    async componentDidMount() {

        // get plants for current season
        await this.props.getPlants();
    }

    searchPlants(value) {
        this.setState({ search: value });
    }

    selectPlant(plant) {
        // add plant
        this.props.addPlant(plant);

        // close modal
        this.props.close();
    }

    renderNavbar() {
        return (
            <View style={{
                paddingHorizontal: units.unit4,
                marginTop: units.unit6,
                marginBottom: units.unit3
            }}>
                <Link
                    onPress={() => this.props.close()}
                    icon={
                        <Ionicons
                            name="chevron-back"
                            size={fonts.h3}
                            color={colors.purpleB}
                        />
                    }
                    text={'Back'}
                />
            </View>
        )
    }

    renderHeader() {
        return (
            <Header style={{ marginLeft: units.unit2 }}>Select Plant</Header>
        )
    }

    renderHelperText() {
        return (
            <Text style={{ marginLeft: units.unit2, marginTop: units.unit3 }}>Choose a plant from the list. If you cannot find the plant you want to add, please contact Yarden to get it added.</Text>
        )
    }

    renderSearchBar() {
        return (
            <View style={{ paddingHorizontal: units.unit3 }}>
                <Input
                    onChange={(value) => this.searchPlants(value)}
                    value={this.state.search}
                    placeholder="Search..."
                />
            </View>
        )
    }

    renderPlantMenu() {

        // filter by search
        const plants = this.props.plants.filter((data) => {
            if (data.common_type.name.toLowerCase().match(new RegExp(this.state.search))) {
                return true;
            }

            if (data.name.toLowerCase().match(new RegExp(this.state.search))) {
                return true;
            }
        })

        return (
            <View style={{ marginTop: units.unit2, backgroundColor: colors.greenE10 }}>
                {(plants.map((plant, index) => {
                    return (
                        <View key={index} style={{ paddingHorizontal: units.unit3, paddingVertical: units.unit2 }}>
                            <TouchableOpacity onPress={() => this.selectPlant(plant)}>
                                <Card style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Image
                                            source={{ uri: plant.common_type.image }}
                                            style={{
                                                height: units.unit5,
                                                width: units.unit5,
                                                marginRight: units.unit3,
                                                marginLeft: units.unit4
                                            }}
                                        />
                                        <View>
                                            <Text style={{ fontWeight: 'bold' }}>{plant.name}</Text>
                                            <Text style={{ ...fonts.label }}>{plant.common_type.name}</Text>
                                        </View>
                                    </View>
                                    <SizeIndicator size={plant.quadrant_size} />
                                </Card>
                            </TouchableOpacity>
                        </View>
                    )
                }))}
            </View>
        )
    }

    render() {
        const {
            isOpen = false
        } = this.props;

        return (
            <Modal
                animationType="slide"
                visible={isOpen}
                presentationStyle="fullScreen">
                <View style={{ height: '95%' }}>

                    {/* navbar */}
                    {this.renderNavbar()}

                    <View style={{ padding: units.unit3 }}>

                        {/* header */}
                        {this.renderHeader()}

                        {/* helper text */}
                        {this.renderHelperText()}

                        {/* search bar */}
                        {this.renderSearchBar()}

                        {/* plant menu */}
                        <KeyboardAwareScrollView>
                            {this.renderPlantMenu()}
                        </KeyboardAwareScrollView>
                    </View>
                </View>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        plants: state.plants
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getPlants
        },
        dispatch
    );
}

NewPlantMenu = connect(mapStateToProps, mapDispatchToProps)(NewPlantMenu);

export default NewPlantMenu;

module.exports = NewPlantMenu;