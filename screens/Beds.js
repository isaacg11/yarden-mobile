// libraries
import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Header from '../components/UI/Header';
import Card from '../components/UI/Card';
import Paragraph from '../components/UI/Paragraph';
import Button from '../components/UI/Button';
import ProgressIndicator from '../components/UI/ProgressIndicator';
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import fonts from '../components/styles/fonts';
import {alert} from '../components/UI/SystemAlert';

// actions
import {getDrafts} from '../actions/drafts/index';
import {createBed, updateBed} from '../actions/beds/index';

// helpers
import calculatePlantingProgress from '../helpers/calculatePlantingProgress';
import formatDimensions from '../helpers/formatDimensions';
import formatMenuData from '../helpers/formatMenuData';
import getPlantedList from '../helpers/getPlantedList';
import capitalize from '../helpers/capitalize';

class Beds extends Component {
  state = {};

  componentDidMount() {
    const order = this.props.route.params.order;

    // get garden bed drafts associated with order
    this.props.getDrafts(`order=${order._id}`);
  }

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
          justifyContent: 'center',
        };
      default:
        return <View></View>;
    }
  }

  save() {
    // show loading indicator
    this.setState({isLoading: true});

    // if no beds {...}
    if (this.props.beds.length < 1) {
      let createBeds = [];
      const drafts = this.props.drafts;

      // iterate through drafts
      drafts.forEach(draft => {
        const newBed = {
          customer: this.props.route.params.order.customer._id,
          key: draft.key,
          plot_points: draft.plot_points,
          width: draft.width,
          length: draft.length,
          height: draft.height,
          shape: draft.shape,
        };

        createBeds.push(
          new Promise(async resolve => {
            // create bed
            await this.props.createBed(newBed);
            resolve();
          }),
        );
      });

      // create beds
      Promise.all(createBeds).then(() => {
        // redirect user to "planted" screen
        this.props.navigation.navigate('Planted');

        // hide loading indicator
        this.setState({isLoading: false});
      });
    } else {
      let updateBeds = [];
      const drafts = this.props.drafts;

      // iterate through drafts
      drafts.forEach(draft => {
        const bed = this.props.beds.find(bed => bed.key === draft.key);
        const updatedBed = {
          plot_points: draft.plot_points,
        };

        updateBeds.push(
          new Promise(async resolve => {
            // create bed
            await this.props.updateBed(bed._id, updatedBed);
            resolve();
          }),
        );
      });

      // update beds
      Promise.all(updateBeds).then(() => {
        // hide loading indicator
        this.setState({isLoading: false});

        // show success message
        alert('Your changes to the garden beds have been saved.', 'Success!');
      });
    }
  }

  renderProgress(progress, label) {
    // render UI
    return (
      <View style={{marginBottom: units.unit3}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: units.unit3,
          }}>
          <Text style={{...fonts.label, marginRight: units.unit3}}>
            Planted
          </Text>
          <Text style={{...fonts.label, textAlign: 'center'}}>{label}</Text>
        </View>
        <ProgressIndicator progress={progress} />
      </View>
    );
  }

  renderBeds(bed) {
    const order = this.props.route.params.order;
    let rows = [];
    let columns = [];

    for (let i = 0; i < bed.qty; i++) {
      columns.push(bed);
    }

    const size = 2;

    while (columns.length > 0) rows.push(columns.splice(0, size));

    return rows.map((row, i) => {
      return (
        <View
          key={i}
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexBasis: 0.5,
          }}>
          {row.map((column, index) => {
            let width = 2;
            let base = width * i;
            let bedId = base + index + 1;
            return (
              <TouchableOpacity
                style={{
                  paddingLeft: index % 2 === 0 ? 0 : units.unit3 + units.unit2,
                  paddingRight: index % 2 === 0 ? units.unit3 + units.unit2 : 0,
                  display: 'flex',
                  justifyContent: 'center',
                  width: '50%',
                }}
                key={index}
                onPress={() =>
                  this.props.navigation.navigate('Bed', {bed, order, bedId})
                }>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: units.unit2,
                  }}>
                  <Paragraph style={{...fonts.label}}>#{bedId}</Paragraph>
                  <Paragraph style={{...fonts.label}}>
                    {calculatePlantingProgress(
                      this.props.drafts.find(draft => draft.key === bedId),
                    )}
                  </Paragraph>
                </View>
                <Card
                  style={{
                    marginBottom: units.unit4,
                    alignItems: 'center',
                  }}>
                  <Image
                    source={{
                      uri: 'https://yarden-garden.s3.us-west-1.amazonaws.com/mobile/raised-bed-01.png',
                    }}
                    style={{
                      width: 100,
                      height: 100,
                    }}
                  />
                  <View style={{display: 'flex', alignItems: 'center'}}>
                    <Paragraph
                      style={{
                        maxWidth: '100%',
                        textAlign: 'center',
                        color: colors.purpleB,
                        fontSize: fonts.h4,
                      }}>
                      {/* TODO: if user hasn't changed the name of the garden show this, otherwise show the name of the garden */}
                      {'Garden #'}
                      {`${bedId}`}
                    </Paragraph>
                    <Paragraph
                      style={{
                        ...fonts.label,
                        marginTop: units.unit0,
                        textAlign: 'center',
                      }}>
                      {formatDimensions(column)}
                    </Paragraph>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    });
  }

  render() {
    const {isLoading} = this.state;
    const {drafts, beds} = this.props;
    const {garden_info} = this.props.route.params.order.customer;

    // set initial total plants value
    let totalPlants = 0;

    // calculate total plants
    garden_info.vegetables.forEach(vegetable => (totalPlants += vegetable.qty));
    garden_info.herbs.forEach(herb => (totalPlants += herb.qty));
    garden_info.fruit.forEach(fr => (totalPlants += fr.qty));

    // set initial complete plants value
    let completePlants = 0;

    // set initial pending plants
    let pendingPlants = 0;

    // set initial progress value
    let progress = 0;

    const rows = formatMenuData(
      garden_info.vegetables,
      garden_info.herbs,
      garden_info.fruit,
    );
    const planted = getPlantedList(drafts);

    // if drafts exist {...}
    if (drafts.length > 0) {
      rows.forEach(column => {
        // check drafts for plant
        const plantIsSaved = planted.find(plant => plant.key === column.key);

        // if plant is saved {...}
        if (plantIsSaved) {
          completePlants += 1;
        } else {
          pendingPlants += 1;
        }
      });
    } else {
      pendingPlants = totalPlants;
    }

    // set progress
    progress =
      pendingPlants === 0
        ? 100
        : (completePlants / (pendingPlants + completePlants)) * 100;

    // set label
    const label = `${completePlants} / ${pendingPlants + completePlants}`;
    const order = this.props.route.params.order;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: colors.greenE10,
        }}>
        <ScrollView>
          <View style={{padding: units.unit3 + units.unit4}}>
            {/* loading indicator */}
            <LoadingIndicator loading={isLoading} />

            {/* header */}
            <Header type="h4">Garden Beds</Header>

            <Text style={{marginTop: units.unit2}}>
              {capitalize(
                `${order.customer.first_name} ${order.customer.last_name}`,
              )}
            </Text>
            <Text>{capitalize(`${order.customer.address}`)}</Text>
            <Text>
              {capitalize(`${order.customer.city}`)},{' '}
              <Text style={{textTransform: 'uppercase'}}>
                {order.customer.state}
              </Text>{' '}
              {order.customer.zip_code}
            </Text>

            {/* helper text */}
            {beds.length < 1 && (
              <View
                style={{
                  marginTop: units.unit3,
                  paddingTop: units.unit3,
                  borderTopWidth: 1,
                  borderTopColor: colors.greenD10,
                }}>
                <Text style={{color: colors.greenE50}}>
                  Tap on any garden bed to get started. Each bed is marked with
                  a number that corresponds to the real-life garden bed.
                </Text>
              </View>
            )}

            <View>
              {/* progress indicator */}
              {beds.length < 1 && this.renderProgress(progress, label)}

              {/* garden beds list */}
              {garden_info.beds.map((bed, index) => (
                <View key={index} style={{marginTop: units.unit4}}>
                  {this.renderBeds(bed)}
                </View>
              ))}

              {/* save button */}
              <Button
                icon={
                  <Ionicons
                    name="share"
                    size={fonts.h3}
                    color={colors.purpleB}
                  />
                }
                disabled={progress < 100 ? true : false}
                text="Publish Garden"
                variant="button"
                onPress={() => this.save()}
              />
              <Text style={{color: colors.greenD75, marginTop: units.unit4}}>
                Tapping the "Publish Garden" button will make your garden layout
                visible to the customer.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    drafts: state.drafts,
    beds: state.beds,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getDrafts,
      createBed,
      updateBed,
    },
    dispatch,
  );
}

Beds = connect(mapStateToProps, mapDispatchToProps)(Beds);

export default Beds;

module.exports = Beds;
