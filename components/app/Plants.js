// libraries
import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import CheckBox from '@react-native-community/checkbox';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Paragraph from '../UI/Paragraph';

// helpers
import truncate from '../../helpers/truncate';
import separatePlantsByCommonType from '../../helpers/separatePlantsByCommonType';

// styles
import units from '../styles/units';
import colors from '../styles/colors';
import types from '../../vars/types';

class Plants extends Component {

    state = {
        plants: []
    }

    componentDidMount() {
        this.formatPlants();
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.plants !== this.props.plants
        ) {
            this.formatPlants();
        }
    }

    formatPlants() {
        let plants = [];
        let key = 0;
        let sortedPlants = separatePlantsByCommonType(this.props.plants);
        let plantList = [];
        for (let item in sortedPlants) {
            sortedPlants[item].forEach((plant) => plantList.push(plant));
        }

        plantList.forEach((plant) => {
            const completed = plant.completed;
            for (let i = 0; i < plant.qty; i++) {
                key += 1;
                let formattedPlant = {
                    ...plant,
                    key
                };

                if (i < completed) {
                    formattedPlant.checked = true;
                }

                plants.push(formattedPlant);
            }
        })

        this.setState({ plants });
    }

    async onSelect(plant) {

        // determine selection state
        let select = !plant.checked;

        let plants = this.props.plants;
        plants.forEach((p) => {
            if (p.id._id === plant.id._id) {

                // increment / decrement completed total
                const val = (select) ? 1 : -1;
                p.completed = p.completed += val;
            }

            // set as id string before saving
            p.id = p.id._id;
        });

        const plantCategory = plant.id.category.name;
        let updatedPlantList = {};
        if (plantCategory === types.VEGETABLE) updatedPlantList.vegetables = plants;
        if (plantCategory === types.CULINARY_HERB) updatedPlantList.herbs = plants;
        if (plantCategory === types.FRUIT) updatedPlantList.fruit = plants;            

        // run callback
        this.props.onSelectPlant(updatedPlantList);
    }

    render() {
        const {
            plants,
        } = this.state;
        const { onNavigateToSubstitution } = this.props;

        return (
            <View>

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
                                    value={plant.checked}
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
                                <Paragraph>
                                    {truncate(`${plant.id.name} ${plant.id.common_type.name}`, 20)}
                                </Paragraph>
                            </View>
                            <TouchableOpacity
                                disabled={plant.checked}
                                onPress={() => onNavigateToSubstitution(plant)}>
                                <Ionicons
                                    name="swap-horizontal-outline"
                                    size={units.unit4}
                                    color={(plant.checked) ? colors.purple4 : colors.purpleB}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        beds: state.beds,
        drafts: state.drafts,
        plantList: state.plantList
    };
}

Plants = connect(mapStateToProps, null)(Plants);

export default Plants;

module.exports = Plants;