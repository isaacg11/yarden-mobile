import React, { Component } from 'react';
import { View } from 'react-native';
import Header from '../UI/Header';
import Paragraph from '../UI/Paragraph';
import Collapse from '../UI/Collapse';
import colors from '../../components/styles/colors';
import units from '../../components/styles/units';
import fonts from '../../components/styles/fonts';
import capitalize from '../../helpers/capitalize';

class PlantInfoPanel extends Component {

    render() {

        const {
            selectedPlant
        } = this.props;

        return (
            <Collapse
                title={selectedPlant ? selectedPlant.id.common_type.name : 'Selection'}
                content={(
                    <View style={{ borderColor: colors.purpleB, borderWidth: 1, padding: units.unit3, borderRadius: units.unit2 }}>
                        <View style={{ padding: units.unit4 }}>
                            <Header
                                style={{
                                    ...fonts.header
                                }}>
                                {selectedPlant ? `${selectedPlant.id.name} ${selectedPlant.id.common_type.name}` : 'No Selection'}
                            </Header>
                            <View style={{ marginTop: units.unit3 }}>
                                <View style={{ marginBottom: units.unit3 }}>
                                    <Paragraph style={{ fontStyle: 'italic', color: colors.purpleC }}>{selectedPlant ? `${selectedPlant.id.family_type.name} ${selectedPlant.id.botanical_type.name}` : 'None'}</Paragraph>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Paragraph style={{ fontWeight: 'bold', flex: 1 }}>
                                        Category
                                    </Paragraph>
                                    <Paragraph style={{ flex: 1 }}>
                                        {selectedPlant ? capitalize(selectedPlant.id.category.name) : 'None'}
                                    </Paragraph>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Paragraph style={{ fontWeight: 'bold', flex: 1 }}>
                                        Season
                                    </Paragraph>
                                    <Paragraph style={{ flex: 1 }}>
                                        {selectedPlant ? capitalize(selectedPlant.id.season) : 'None'}
                                    </Paragraph>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Paragraph style={{ fontWeight: 'bold', flex: 1 }}>
                                        Days to Mature
                                    </Paragraph>
                                    <Paragraph style={{ flex: 1 }}>
                                        {selectedPlant ? selectedPlant.id.days_to_mature : 'None'}
                                    </Paragraph>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Paragraph style={{ fontWeight: 'bold', flex: 1 }}>
                                        Growth Style
                                    </Paragraph>
                                    <Paragraph style={{ flex: 1 }}>
                                        {selectedPlant ? capitalize(selectedPlant.id.growth_style.name) : 'None'}
                                    </Paragraph>
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Paragraph style={{ fontWeight: 'bold', flex: 1 }}>
                                        Partial Sun
                                    </Paragraph>
                                    <Paragraph style={{ flex: 1 }}>
                                        {selectedPlant ? selectedPlant.id.partial_sun ? "Yes" : "No" : "None"}
                                    </Paragraph>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            />
        )
    }
}

module.exports = PlantInfoPanel;