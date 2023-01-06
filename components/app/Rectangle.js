
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import GardenMap from '../../screens/GardenMap';

class Rectangle extends Component {

    state = {}

    render() {

        const {
            bed, 
            bedId,
            order,
            serviceReport,
            onNavigateBack,
            navigateToNotes
        } = this.props;

        const measurements = 2;
        const rows = (bed.length / 12) * measurements;
        const columns = (bed.width / 12) * measurements;

        return (
            <View>

                {/* garden map */}
                <GardenMap
                    bed={bed}
                    bedId={bedId}
                    rows={rows}
                    columns={columns}
                    order={order}
                    serviceReport={serviceReport}
                    onNavigateBack={onNavigateBack}
                    navigateToNotes={navigateToNotes}
                />
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

Rectangle = connect(mapStateToProps, null)(Rectangle);

export default Rectangle;

module.exports = Rectangle;