import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Divider from '../../components/UI/Divider';
import Collapse from '../../components/UI/Collapse';

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
                    <Text style={{ fontWeight: 'bold', marginTop: 12, marginBottom: 12, display: (index < 1) ? null : 'none', color: '#737373' }}>{p.class.name} vegetables</Text>
                    <View style={{ padding: 12, flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ paddingRight: 12, marginRight: 12, borderRightColor: '#ddd', borderRightWidth: 1 }}>
                            <CheckBox
                                value={this.state[p.name]}
                                onValueChange={() => this.onSelect(p)}
                                boxType="square"
                            />
                        </View>
                        <Image
                            style={{ height: 75, width: 75, marginRight: 12 }}
                            source={{
                                uri: p.image,
                            }}
                        />
                        <Text>{p.name}</Text>
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
                <View style={{ padding: 12, flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ paddingRight: 12, marginRight: 12, borderRightColor: '#ddd', borderRightWidth: 1 }}>
                        <CheckBox
                            value={this.state[h.name]}
                            onValueChange={() => this.onSelect(h)}
                            boxType="square"
                        />
                    </View>
                    <Image
                        style={{ height: 75, width: 75, marginRight: 12 }}
                        source={{
                            uri: h.image,
                        }}
                    />
                    <Text>{h.name}</Text>
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

        const { plants } = this.props;
        const { selectedPlants } = this.state;

        if (plants && plants.vegetables && plants.herbs && plants.fruit) {
            const vegetables = this.renderPlants(plants.vegetables);
            const herbs = this.renderHerbs(plants.herbs);
            const fruit = this.renderPlants(plants.fruit);

            return (
                <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                    <Text style={{ fontWeight: 'bold', marginTop: 12, marginBottom: 12 }}>Plant Selection</Text>
                    <Text style={{ marginBottom: 25 }}>Select a minimum of 5 plants, and a maximum of 20</Text>
                    <View style={{ paddingBottom: 25 }}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: '#737373'}}>Selected: {selectedPlants.length}</Text>
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

        return <Text>Loading...</Text>
    }
}

module.exports = PlantList;