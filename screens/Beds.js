
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Header from '../components/UI/Header';
import Card from '../components/UI/Card';
import Paragraph from '../components/UI/Paragraph';
import formatDimensions from '../helpers/formatDimensions';
import units from '../components/styles/units';
import colors from '../components/styles/colors';

class Beds extends Component {

    state = {}

    render() {
        const { isLoading } = this.state;
        const beds = this.props.route.params.order.customer.garden_info.beds;
        const order = this.props.route.params.order;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
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
                        <View>                            
                            {/* garden beds list */}
                            {beds.map((bed, index) => (
                                <Card key={index} style={{ marginTop: units.unit4 }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Bed', { bed, order })}>
                                        <View
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}>
                                            <Paragraph style={{ fontWeight: 'bold' }}>
                                                ({bed.qty}) {formatDimensions(bed)} {bed.shape.name} bed{(bed.qty > 1 ? 's' : '')}
                                            </Paragraph>
                                            <Ionicons
                                                name="arrow-forward"
                                                size={30}
                                                color={colors.purpleB}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </Card>
                            ))}
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