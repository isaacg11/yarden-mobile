
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Header from '../components/UI/Header';
import Card from '../components/UI/Card';
import Paragraph from '../components/UI/Paragraph';
import Button from '../components/UI/Button';
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';
import formatDimensions from '../helpers/formatDimensions';

class Beds extends Component {

    state = {}

    getBedStyles(bed) {
        switch (bed.shape.name) {
            case 'rectangle':
                return {
                    margin: 20,
                    height: 150,
                    borderWidth: 1,
                    borderColor: colors.purpleB,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            default:
                return <View></View>
        }
    }

    renderBeds(bed) {
        const order = this.props.route.params.order;
        let rows = [];
        let columns = [];

        for (let i = 0; i < bed.qty; i++) {
            columns.push(bed);
        }

        const size = 2;

        while (columns.length > 0)
            rows.push(columns.splice(0, size));

        let bedId = 0;

        return rows.map((row, i) => {
            return (
                <View key={i} style={{ display: 'flex', flexDirection: 'row' }}>
                    {row.map((column, index) => {
                        bedId += 1;
                        return (
                            <TouchableOpacity
                                style={{
                                    flex: row.length / 2,
                                    paddingHorizontal: units.unit4
                                }} key={index} onPress={() => this.props.navigation.navigate('Bed', { bed, order })}>
                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: units.unit2 }}>
                                    <Paragraph style={{ ...fonts.label }}>
                                        Bed Id: {bedId}
                                    </Paragraph>
                                    <Paragraph style={{ ...fonts.label }}>
                                        50%
                                    </Paragraph>
                                </View>
                                <Card style={{ marginBottom: units.unit4 + units.unit3, alignItems: 'center' }}>
                                    <Image
                                        source={{ uri: 'https://yarden-garden.s3.us-west-1.amazonaws.com/mobile/raised-bed-01.png' }}
                                        style={{
                                            width: 100,
                                            height: 100
                                        }}
                                    />
                                    <View>
                                        <Paragraph style={{ ...fonts.label, marginTop: units.unit0 }}>
                                            {formatDimensions(column)}
                                        </Paragraph>
                                    </View>
                                </Card>

                            </TouchableOpacity>
                        )
                    })}
                </View>
            )
        })
    }

    render() {
        const { isLoading } = this.state;
        const beds = this.props.route.params.order.customer.garden_info.beds;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
                backgroundColor: colors.greenE10
            }}>
                <ScrollView>
                    <View style={{ padding: units.unit3 + units.unit4 }}>
                        {/* loading indicator */}
                        <LoadingIndicator
                            loading={isLoading}
                        />

                        <Header type="h4" style={{ marginBottom: units.unit5 }}>
                            Garden Beds
                        </Header>
                        <Text>Tap on any garden bed to get started. Each bed is marked with a number that corresponds to the real-life garden bed.</Text>
                        <View style={{ marginTop: units.unit4 }}>
                            {/* garden beds list */}
                            {beds.map((bed, index) => (
                                <View key={index} style={{ marginTop: units.unit4 }}>
                                    {this.renderBeds(bed)}
                                </View>
                            ))}

                            <Button
                                icon={<Ionicons
                                    name={'save'}
                                    color={colors.purpleB}
                                    size={fonts.h2}
                                />}
                                text="Save"
                                variant="button"
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

Beds = connect(mapStateToProps, null)(Beds);

export default Beds;

module.exports = Beds;