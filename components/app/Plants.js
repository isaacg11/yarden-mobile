// libraries
import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Paragraph from '../UI/Paragraph';
import SubstitutionMenu from '../app/SubstitutionMenu';

// styles
import units from '../styles/units';
import colors from '../styles/colors';

class Plants extends Component {

    state = {
        plants: []
    }

    componentDidMount() {
        let plants = [];
        let key = 0;
        this.props.plants.forEach((plant) => {
            for(let i = 0; i < plant.qty; i++) {
                key += 1;
                plants.push({
                    ...plant,
                    key
                });
            }
        })

        this.setState({ plants });
    }

    onSelect(plant) {
        // determine selection state
        let select = !this.state[`${plant.key}`] ? true : false;

        // set selection state
        this.setState({ [`${plant.key}`]: select });
    }

    substitutePlant(substitute) {
        let plants = this.state.plants;

        let plantIndex = plants.findIndex((plant) => plant.key === substitute.key);

        plants.splice(plantIndex, 1, substitute);

        this.setState({ plants });
    }

    render() {

        const { 
            substitutionMenuIsOpen, 
            selectedPlant, 
            plants 
        } = this.state;

        return (
            <View>

                {/* substitution menu (dynamically visible) */}
                <SubstitutionMenu 
                    selectedPlant={selectedPlant}
                    isOpen={substitutionMenuIsOpen}
                    close={() => this.setState({ substitutionMenuIsOpen: false})}
                    onConfirm={(plant) => this.substitutePlant(plant)}
                />

                {/* helper text */}
                <Text style={{ marginVertical: units.unit3 }}>Mark off each plant as you pick it up from the nursery. If you can't find a certain varietal, substitute it by tapping the arrow button next to the plant.</Text>

                {/* plant list */}
                {plants.map((plant, index) => (
                    <View key={index}>
                        <View
                            style={{
                                paddingTop: units.unit4,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                            <View style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <CheckBox
                                    value={this.state[`${plant.key}`]}
                                    onValueChange={() => this.onSelect(plant)}
                                    boxType="square"
                                    tintColor={colors.purpleB}
                                    onTintColor={colors.green0}
                                    onCheckColor={colors.green0}
                                    onFillColor={colors.purpleB}
                                />
                                <Image
                                    style={{
                                        height: units.unit5,
                                        width: units.unit5,
                                        marginRight: units.unit4,
                                        borderRadius: units.unit3,
                                        marginLeft: units.unit4
                                    }}
                                    source={{
                                        uri: plant.id.common_type.image,
                                    }}
                                />
                                <Paragraph>{plant.id.name} {plant.id.common_type.name}</Paragraph>
                            </View>
                            <TouchableOpacity 
                                disabled={this.state[`${plant.key}`]}
                                onPress={() => {
                                        this.setState({
                                            selectedPlant: plant
                                        }, () => {
                                            this.setState({
                                                substitutionMenuIsOpen: true
                                            })
                                        })
                                    }
                                }>
                                <Ionicons
                                    name="swap-horizontal-outline"
                                    size={units.unit4}
                                    color={(this.state[`${plant.key}`]) ? colors.purple4 : colors.purpleB}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        )
    }
}

module.exports = Plants;