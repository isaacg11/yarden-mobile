// libraries
import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// UI components
import Button from '../components/UI/Button';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Header from '../components/UI/Header';
import PlantList from '../components/app/PlantList';
import PlantAvailability from '../components/app/PlantAvailability';

// helpers
import getSeason from '../helpers/getSeason';
import setPlants from '../helpers/setPlants';
import calculatePlotPoints from '../helpers/calculatePlotPoints';
import combinePlants from '../helpers/combinePlants';

// actions
import { getPlants } from '../actions/plants/index';
import { updateUser } from '../actions/user/index';
import { getOrders } from '../actions/orders/index';

// styles
import units from '../components/styles/units';

class Garden extends Component {
  state = {
    selectedPlants: [],
    progress: 0,
  };

  async componentDidMount() {

    // show loading indicator
    this.setState({ isLoading: true });

    // set current season
    const season = getSeason();
    // const season = 'fall';

    // get all plants associated with the current season
    await this.props.getPlants(`season=${season}`);

    // set plants
    const plants = setPlants(this.props.plants);

    // update UI
    this.setState({
      vegetables: plants.vegetables,
      herbs: plants.herbs,
      fruit: plants.fruit,
      isLoading: false,
    });
  }

  async next() {

    // set garden plants
    const plants = setPlants(this.state.selectedPlants);

    // set plants
    const vegetables = plants.vegetables;
    const fruit = plants.fruit;
    const herbs = plants.herbs;

    // if crop rotation {...}
    if (this.props.route.params.isCropRotation) {
      // show loading indicator
      this.setState({ isLoading: true });

      // combine plants from selection
      const combinedPlants = combinePlants([{ vegetables, herbs, fruit }]);

      // update garden info
      await this.updateGardenInfo(
        combinedPlants.vegetables,
        combinedPlants.herbs,
        combinedPlants.fruit,
      );

      // get updated orders, to update the order.customer.garden_info which is used to determine if a CR selection has been made or not
      await this.props.getOrders(`status=pending`);

      // hide loading indicator
      this.setState({ isLoading: false });

      // navigate to plants selected confirmation
      this.props.navigation.navigate('Plants Selected');
    } else {
      // combine quote and plants
      let quoteAndPlants = {
        ...{ vegetables, herbs, fruit },
        ...{ quoteTitle: this.props.route.params.title },
      };

      // combine quote and plants
      const params = {
        ...this.props.route.params,
        ...{ plantSelections: [quoteAndPlants] },
        ...{ isCheckout: true },
      };

      // if user already has maintenance plan selected {...}
      if (
        this.props.user.garden_info?.maintenance_plan && 
        this.props.user.garden_info?.maintenance_plan !== 'none') {
        // navigate to checkout
        this.props.navigation.navigate('Checkout', params);
      } else {
        // navigate to plan enrollment
        this.props.navigation.navigate('Enrollment', params);
      }
    }
  }

  async updateGardenInfo(vegetables, herbs, fruit) {
    let gardenInfo = {
      vegetables,
      herbs,
      fruit,
    };

    // if user has garden info {...}
    if (this.props.user.garden_info) {
      // if user already has a maintenance plan, set plan
      if (this.props.user.garden_info.maintenance_plan)
        gardenInfo.maintenance_plan =
          this.props.user.garden_info.maintenance_plan;

      // if user already has beds, set beds
      if (this.props.user.garden_info.beds)
        gardenInfo.beds = this.props.user.garden_info.beds;

      // if user already has accessories, set accessories
      if (this.props.user.garden_info.accessories)
        gardenInfo.accessories = this.props.user.garden_info.accessories;
    }

    // if user selected a new plan, set plan
    if (this.props.route.params.plan)
    gardenInfo.maintenance_plan = this.props.route.params.plan;

    // update user with garden info
    await this.props.updateUser(null, { gardenInfo });
  }

  setPlotPoints() {
    const selectedPlants = this.state.selectedPlants;
    const beds = this.props.route.params.isCropRotation
      ? this.props.user.garden_info.beds
      : this.props.route.params.line_items.beds;
    let allowablePlotPoints = 0;
    let usedPlotPoints = 0;

    if (selectedPlants.length > 0) {
      selectedPlants.forEach(plant => {
        usedPlotPoints += plant.quadrant_size * (plant.qty ? plant.qty : 1);
      });
    }

    beds.forEach(bed => {
      allowablePlotPoints += calculatePlotPoints(bed) * bed.qty;
    });

    // NOTE: Added buffer (10%) to allow room for different sizes. Do not remove!
    // Author - Isaac G. 2/28/23
    const buffer = parseInt((allowablePlotPoints * 0.1).toFixed(0));

    allowablePlotPoints = allowablePlotPoints - buffer;

    return {
      usedPlotPoints,
      allowablePlotPoints,
    };
  }

  render() {
    const { selectedPlants, progress, isLoading } = this.state;
    const plotPoints = this.setPlotPoints();
    const { allowablePlotPoints, usedPlotPoints } = plotPoints;
    const { user } = this.props;
    const isCropRotation = this.props.route.params.isCropRotation;
    const beds = isCropRotation
      ? user.garden_info.beds
      : this.props.route.params.line_items.beds;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
        }}>
        <ScrollView>
          <View style={{ padding: units.unit3 + units.unit4 }}>

            {/* loading indicator */}
            <LoadingIndicator loading={isLoading} />

            {/* header */}
            <Header type="h4">
              {isCropRotation ? 'Crop Rotation' : 'Garden Setup'}
            </Header>

            <View style={{ padding: 0 }}>
              {/* plant list */}
              <View style={{ marginBottom: units.unit3 }}>
                <PlantList
                  allowablePlotPoints={allowablePlotPoints}
                  usedPlotPoints={usedPlotPoints}
                  plants={this.state}
                  selectedPlants={selectedPlants}
                  beds={beds}
                  onSelect={(selectedPlants, progress) =>
                    this.setState({
                      selectedPlants,
                      progress,
                    })
                  }
                />
              </View>

              {/* plant availability */}
              <PlantAvailability />

              {/* navigation button */}
              <View style={{ marginTop: units.unit4 }}>
                <Button
                  text="Continue"
                  variant="primary"
                  disabled={progress < 100}
                  onPress={() => this.next()}
                />
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
    plants: state.plants,
    orders: state.orders
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPlants,
      updateUser,
      getOrders
    },
    dispatch,
  );
}

Garden = connect(mapStateToProps, mapDispatchToProps)(Garden);

export default Garden;

module.exports = Garden;
