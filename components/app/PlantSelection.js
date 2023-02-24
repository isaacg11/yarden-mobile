// libaries
import React, { Component } from 'react';
import { View, Image, Text } from 'react-native';
import { connect } from 'react-redux';

// UI components
import Paragraph from '../UI/Paragraph';

// helpers
import separatePlantsByCommonType from '../../helpers/separatePlantsByCommonType';
import capitalize from '../../helpers/capitalize';

// styles
import units from '../styles/units';
import colors from '../styles/colors';

class PlantSelection extends Component {

    renderPlants(plants) {
        let plantList = [];

        for (let item in plants) {
            plantList.push(plants[item]);
        }

        const list = plantList.map(plant => {
            return plant.map((p, index) => (
                <View key={index}>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        display: index < 1 ? null : 'none'
                    }}>
                        <Paragraph
                            style={{
                                fontWeight: 'bold',
                                marginTop: units.unit5,
                                marginBottom: units.unit4,
                                color: colors.greenE75,
                            }}>
                            {capitalize(p.id.common_type.name)}
                        </Paragraph>
                        <Image
                            style={{
                                height: units.unit5,
                                width: units.unit5,
                                marginRight: units.unit4,
                                borderRadius: units.unit3,
                                marginLeft: units.unit4
                            }}
                            source={{
                                uri: p.id.common_type.image,
                            }}
                        />
                    </View>
                    <View
                        style={{
                            paddingVertical: units.unit4,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                        <View
                            style={{
                                paddingRight: units.unit4,
                                marginRight: units.unit4,
                                paddingVertical: units.unit4,
                                display: 'flex',
                                flexDirection: 'row',
                            }}>
                            <Image
                                style={{
                                    height: units.unit6,
                                    width: units.unit6,
                                    borderRadius: units.unit3,
                                    marginRight: units.unit4
                                }}
                                source={{
                                    uri: p.id.image,
                                }}
                            />
                            <View>
                                <Paragraph style={{ marginBottom: units.unit3, marginTop: units.unit2 }}>{capitalize(p.id.name)}</Paragraph>
                                <Text>Qty: {p.qty}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            ));
        });

        return list;
    }

    render() {
        const { plants } = this.props;
        const plantGroups = separatePlantsByCommonType(plants);
        const plantSelection = this.renderPlants(plantGroups);

        return (
            <View>
                {plantSelection}
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

PlantSelection = connect(mapStateToProps, null)(PlantSelection);

export default PlantSelection;

module.exports = PlantSelection;