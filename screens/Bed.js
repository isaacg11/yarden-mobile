
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Rectangle from '../components/app/Rectangle';
import units from '../components/styles/units';

class Bed extends Component {

    state = {
        bedNumber: 1
    }

    renderBed(bed, order) {
        switch (bed.shape.name) {
            case 'rectangle':
                return (
                    <Rectangle 
                        bed={bed} 
                        order={order} 
                    />
                )
            default:
                return <div></div>
        }
    }

    render() {
        const { isLoading } = this.state;
        const { bed, order } = this.props.route.params;

        return (
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
            }}>
                <ScrollView 
                    maximumZoomScale={10} 
                    minimumZoomScale={1}>
                    <View style={{ padding: units.unit3 + units.unit4 }}>

                        {/* loading indicator */}
                        <LoadingIndicator
                            loading={isLoading}
                        />

                        {/* garden bed */}
                        {this.renderBed(bed, order)}
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