// libraries
import React, { Component } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Header from '../components/UI/Header';
import Card from '../components/UI/Card';
import Paragraph from '../components/UI/Paragraph';
import Label from '../components/UI/Label';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';

class PlantSelectionType extends Component {

    setPlantSelectionType(label) {                            
        if(label === 'A') {

        } else if(label === 'B') {

        } else if(label === 'C') {

        }
    }

    render() {

        const plantSelectionTypes = [
            {
                label: 'A',
                description: 'Select the type of plants you want and set the quantity',
                difficulty: 'Easy'
            },
            {
                label: 'B',
                description: 'Select the type of plants you want, and let Yarden determine the quantity',
                difficulty: 'Easier'
            },
            {
                label: 'C',
                description: 'Select from a list of “Yarden signature gardens”',
                difficulty: 'Easiest'
            },
        ]

        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    width: '100%',
                }}>
                <View>
                    <View style={{ padding: units.unit3 + units.unit4 }}>

                        {/* header */}
                        <Header type="h4">
                            How would you like to select your plants?
                        </Header>

                        {/* options */}
                        <View style={{ height: '100%', marginTop: units.unit3 }}>
                            {plantSelectionTypes.map((plantSelectionType, index) => (
                                <TouchableOpacity key={index} onPress={() => this.setPlantSelectionType(plantSelectionType.label)}>
                                    <Card style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: units.unit4 }}>
                                        <View style={{ marginRight: units.unit6 }}>
                                            <View style={{ height: units.unit5, width: units.unit5, backgroundColor: colors.purpleB, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: units.unit6, marginBottom: units.unit3 }}>
                                                <Text style={{ fontWeight: 'bold', color: colors.white }}>{plantSelectionType.label}</Text>
                                            </View>
                                            <Paragraph style={{ marginBottom: units.unit3 }}>
                                                {plantSelectionType.description}
                                            </Paragraph>
                                            <Label>
                                                Difficulty: {plantSelectionType.difficulty}
                                            </Label>
                                        </View>
                                        <Ionicons
                                            name="chevron-forward"
                                            size={fonts.h3}
                                            color={colors.purpleB}
                                        />
                                    </Card>
                                </TouchableOpacity>
                            ))}

                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
    };
}

PlantSelectionType = connect(mapStateToProps, null)(PlantSelectionType);

export default PlantSelectionType;

module.exports = PlantSelectionType;
