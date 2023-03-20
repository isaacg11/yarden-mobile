import React, {Component} from 'react';
import {SafeAreaView, View, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Rectangle from '../components/app/Rectangle';
import units from '../components/styles/units';

class Bed extends Component {
  state = {
    bedNumber: 1,
  };

  renderMap(bed, order, bedId, serviceReport) {
    switch (bed.shape.name) {
      case 'rectangle':
        return (
          <Rectangle
            bed={bed}
            order={order}
            bedId={bedId}
            serviceReport={serviceReport}
            onNavigateBack={() => this.props.navigation.goBack()}
            navigateToNotes={selectedPlant =>
              this.props.navigation.navigate('Notes', {selectedPlant, bedId})
            }
            navigateToHarvestInstructions={selectedPlant =>
              this.props.navigation.navigate('Harvest Instructions', {
                selectedPlant,
              })
            }
          />
        );
      default:
        return <View></View>;
    }
  }

  render() {
    const {isLoading} = this.state;
    const {bed, order, bedId, serviceReport} = this.props.route.params;

    return (
      <View
        style={{
          flex: 1,
          width: '100%',
        }}>
        <ScrollView maximumZoomScale={10} minimumZoomScale={1}>
          <View
            style={{
              paddingHorizontal: units.unit3 + units.unit4,
              paddingTop: units.unit3,
            }}>
            {/* loading indicator */}
            <LoadingIndicator loading={isLoading} />

            {/* garden bed map */}
            {this.renderMap(bed, order, bedId, serviceReport)}
          </View>
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

Bed = connect(mapStateToProps, null)(Bed);

export default Bed;

module.exports = Bed;
