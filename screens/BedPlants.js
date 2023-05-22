// libraries
import React, { Component } from 'react';
import { ScrollView, SafeAreaView, View, Image, Text } from 'react-native';
import { connect } from 'react-redux';

// UI components
import Header from '../components/UI/Header';
import Paragraph from '../components/UI/Paragraph';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Label from '../components/UI/Label';

// helpers
import calculateDaysToMature from '../helpers/calculateDaysToMature';
import capitalize from '../helpers/capitalize';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class BedPlants extends Component {

    state = {
        plants: []
    }

    componentDidMount() {

        let list = [];
        this.props.route.params.bed.plot_points.forEach((row) => {
            row.forEach((column) => {
                if (column.image) {
                    list.push({
                        plant: column.plant,
                        qty: 1
                    });
                }
            })
        })

        let plants = [];

        // Iterate over the original array
        list.forEach(function (item) {

            // Find the index of the item in the result array
            let index = plants.findIndex(function (element) {
                return element.plant.id._id === item.plant.id._id;
            });

            if (index !== -1) {
                // If the item already exists in the result array, add the quantity
                plants[index].qty += item.qty;
            } else {
                // If the item doesn't exist, push a new object to the result array
                plants.push({ plant: item.plant, qty: item.qty });
            }
        });

        plants.sort(function (a, b) {
            return calculateDaysToMature(a.plant) - calculateDaysToMature(b.plant);
        });

        this.setState({
            plants
        })
    }

    render() {

        const {
            isLoading,
            plants
        } = this.state;

        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    width: '100%',
                    backgroundColor: colors.greenD5,
                }}>
                <ScrollView>
                    <View style={{ padding: units.unit3 + units.unit4 }}>

                        {/* loading indicator */}
                        <LoadingIndicator loading={isLoading} />

                        <View>
                            <Header
                                type="h4"
                                style={{
                                    marginBottom: units.unit4,
                                }}>
                                Plant List
                            </Header>

                            <View>
                                <View style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                    <Label style={{ fontWeight: 'bold', flex: 2, }}>Plant</Label>
                                    <Label style={{ fontWeight: 'bold', flex: 1, marginLeft: units.unit6 }}>Harvest</Label>
                                </View>
                                {plants.map((p, index) => (
                                    <View key={index}>
                                        <View
                                            key={index}
                                            style={{
                                                paddingVertical: units.unit3,
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }}>

                                            <View style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                flex: 2,
                                                paddingRight: units.unit5
                                            }}>
                                                <Image
                                                    source={{
                                                        uri: p.plant.id.image,
                                                    }}
                                                    style={{
                                                        width: units.unit5 + units.unit3,
                                                        height: units.unit5 + units.unit3,
                                                        borderRadius: units.unit3,
                                                        marginRight: units.unit3
                                                    }}
                                                />
                                                <View style={{ paddingVertical: units.unit3 }}>
                                                    <Paragraph>({p.qty}) {capitalize(p.plant.id.name)} {capitalize(p.plant.id.common_type.name)}</Paragraph>
                                                </View>
                                            </View>
                                            <Text style={{ flex: 1, marginLeft: units.unit5, color: colors.greenD50 }}>{calculateDaysToMature(p.plant)} days left</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        beds: state.beds,
    };
}

BedPlants = connect(mapStateToProps)(BedPlants);

export default BedPlants;

module.exports = BedPlants;
