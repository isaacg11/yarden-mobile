
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Header from '../components/UI/Header';
import Paragraph from '../components/UI/Paragraph';
import Rectangle from '../components/app/Rectangle';
import formatDimensions from '../helpers/formatDimensions';
import capitalize from '../helpers/capitalize';
import units from '../components/styles/units';

class Bed extends Component {

    state = {
        bedNumber: 1
    }

    renderBed(bed) {
        switch(bed.shape.name) {
            case 'rectangle':
                return <Rectangle bed={bed} onPress={(q) => this.onPressQuadrant(q)} />
            default:
                return <div></div>
        }
    }

    onPressQuadrant(selectedQuadrant) {

        // set selected quadrant
        this.setState({ selectedQuadrant });

        // get bed
        const bed = this.props.route.params.bed;

        // get order
        const order = this.props.route.params.order;

        // set quadrant details
        const rows = (bed.length / 12);
        const columns = (bed.width / 12);
        this.props.navigation.navigate('Garden Map', { 
            quadrant: {
                rows,
                columns,
                selectedQuadrant
            },
            order
        });
    }

    render() {
        const { isLoading, bedNumber } = this.state;
        const bed = this.props.route.params.bed;

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

                        <Header type="h4">
                            Garden Bed {bedNumber} of {bed.qty}
                        </Header>
                        <Paragraph style={{ marginBottom: units.unit5, marginTop: units.unit3 }}>
                            {capitalize(bed.shape.name)} {formatDimensions(bed)}
                        </Paragraph>
                        <View>
                            {this.renderBed(bed)}
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

Bed = connect(mapStateToProps, null)(Bed);

export default Bed;

module.exports = Bed;