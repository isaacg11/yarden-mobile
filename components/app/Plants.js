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

class Plants extends Component {

    state = {
        plants: []
    }

    componentDidMount() {
        this.formatPlants();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.plants !== this.props.plants) {
            this.formatPlants();
        }
    }

    formatPlants() {
        let plants = [];
        let key = 0;
        let sortedPlants = separatePlantsByCommonType(this.props.plants);
        let plantList = [];
        for(let item in sortedPlants) {
            sortedPlants[item].forEach((plant) => plantList.push(plant));
        }

        plantList.forEach((plant) => {
            for (let i = 0; i < plant.qty; i++) {
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

    render() {

        const { plants } = this.state;
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
                                <Paragraph>{truncate(`${plant.id.name} ${plant.id.common_type.name}`, 15)}</Paragraph>
                            </View>
                            <TouchableOpacity
                                disabled={this.state[`${plant.key}`]}
                                onPress={() => onNavigateToSubstitution(plant)}>
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

function mapStateToProps(state) {
    return {
        beds: state.beds,
        drafts: state.drafts
    };
}

Plants = connect(mapStateToProps, null)(Plants);

export default Plants;

module.exports = Plants;