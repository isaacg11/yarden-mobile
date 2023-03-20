// libraries
import React, { Component } from 'react';
import { View, SafeAreaView, ScrollView, Text } from 'react-native';

// UI components
import Header from '../components/UI/Header';
import Label from '../components/UI/Label';
import Paragraph from '../components/UI/Paragraph';
import Divider from '../components/UI/Divider';

// vars
import vars from '../vars/index';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class HarvestInstructions extends Component {

    state = {
        instructions: []
    }

    componentDidMount() {
        this.setState({
            instructions: vars.harvest_instructions[`${this.props.route.params.selectedPlant.id.produce_type.name}`]
        })
    }

    render() {

        const { instructions } = this.state;
        const { selectedPlant } = this.props.route.params;

        return (
            <SafeAreaView>
                <ScrollView style={{ backgroundColor: colors.greenE10, height: '100%', paddingHorizontal: units.unit4, paddingVertical: units.unit4 }}>
                    <View style={{ marginBottom: units.unit5 }}>

                        <View style={{ display: 'flex', alignItems: 'center' }}>

                            {/* header */}
                            <Header>Harvest Instructions</Header>

                            {/* plant info */}
                            <Label style={{ marginTop: units.unit4 }}>Plant</Label>
                            <Paragraph style={{ textTransform: 'capitalize' }}>{selectedPlant.id.name} {selectedPlant.id.common_type.name}</Paragraph>
                            <Divider style={{ marginTop: units.unit5 }} />
                        </View>

                        {/* harvest instructions */}
                        {instructions.map((instruction, index) => (
                            <Text
                                key={index}
                                style={{ marginTop: units.unit5 }}>
                                ({index + 1}) {instruction}
                            </Text>
                        ))}

                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default HarvestInstructions;

