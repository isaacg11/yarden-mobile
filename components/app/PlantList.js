import React, { Component } from 'react';
import { View, Image } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Divider from '../../components/UI/Divider';
import Paragraph from '../../components/UI/Paragraph';
import Collapse from '../../components/UI/Collapse';
import units from '../../components/styles/units';

class PlantList extends Component {

    state = {
        selectedPlants: []
    }

    renderPlants(plants) {
        let plantList = [];

        for (let item in plants) {
            plantList.push(plants[item])
        }

        const list = plantList.map((plant) => {
            return plant.map((p, index) => (
                <View key={index}>
                    <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5, marginBottom: units.unit5, display: (index < 1) ? null : 'none', color: '#737373' }}>{p.class.name} vegetables</Paragraph>
                    <View style={{ padding: units.unit5, flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ paddingRight: units.unit5, marginRight: units.unit5, borderRightColor: '#ddd', borderRightWidth: 1 }}>
                            <CheckBox
                                value={this.state[p.name]}
                                onValueChange={() => this.onSelect(p)}
                                boxType="square"
                            />
                        </View>
                        <Image
                            style={{ height: 75, width: 75, marginRight: units.unit5 }}
                            source={{
                                uri: p.image,
                            }}
                        />
                        <Paragraph>{p.name}</Paragraph>
                    </View>
                    <Divider />
                </View>
            ))
        })

        return list;
    }

    renderHerbs(herbs) {
        return herbs.map((h, index) => (
            <View key={index}>
                <View style={{ padding: units.unit5, flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ paddingRight: units.unit5, marginRight: units.unit5, borderRightColor: '#ddd', borderRightWidth: 1 }}>
                        <CheckBox
                            value={this.state[h.name]}
                            onValueChange={() => this.onSelect(h)}
                            boxType="square"
                        />
                    </View>
                    <Image
                        style={{ height: 75, width: 75, marginRight: units.unit5 }}
                        source={{
                            uri: h.image,
                        }}
                    />
                    <Paragraph>{h.name}</Paragraph>
                </View>
                <Divider />
            </View>
        ))
    }

    onSelect(plant) {
        // determine selection state
        let select = (!this.state[plant.name]) ? true : false;

        // set selection state
        this.setState({ [plant.name]: select });

        // set selected plants
        let selectedPlants = this.state.selectedPlants;

        // if deselecting {...}
        if(!select) {
            const index = selectedPlants.findIndex((p) => p.name === plant.name);
            selectedPlants.splice(index, 1);
        } else {
            // if selecting {...}
            selectedPlants.push(plant);
        }

        // return value
        this.props.onSelect(this.state.selectedPlants);
    }

    render() {

        const { selectedPlants } = this.state;
        const { 
            plants,
            title = 'Plant Selection'
        } = this.props;

        if (plants && plants.vegetables && plants.herbs && plants.fruit) {
            const vegetables = this.renderPlants(plants.vegetables);
            const herbs = this.renderHerbs(plants.herbs);
            const fruit = this.renderPlants(plants.fruit);

            return (
                <View style={{ backgroundColor: '#fff', padding: units.unit5, borderRadius: 5 }}>
                    <Paragraph style={{ fontWeight: 'bold', marginTop: units.unit5, marginBottom: units.unit5 }}>{title}</Paragraph>
                    <Paragraph style={{ marginBottom: units.unit6 }}>Select a minimum of 5 plants, and a maximum of 20</Paragraph>
                    <View style={{ paddingBottom: units.unit6 }}>
                        <Paragraph style={{ textAlign: 'center', fontWeight: 'bold', color: '#737373'}}>Selected: {selectedPlants.length}</Paragraph>
                    </View>
                    <Divider />
                    {(Object.keys(vegetables).length > 0) && (
                        <Collapse
                            title="Vegetables"
                            content={
                                vegetables
                            }
                        />
                    )}
                    {(herbs.length > 0) && (
                        <Collapse
                            title="Herbs"
                            content={
                                herbs
                            }
                        />
                    )}
                    {(Object.keys(fruit).length > 0) && (
                        <Collapse
                            title="Fruit"
                            content={
                                fruit
                            }
                        />
                    )}
                </View>
            )
        }

        return <Paragraph>Loading...</Paragraph>
    }
}

module.exports = PlantList;