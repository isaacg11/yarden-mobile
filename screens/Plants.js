// libraries
import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Header from '../components/UI/Header';
import Dropdown from '../components/UI/Dropdown';
import Divider from '../components/UI/Divider';
import Paragraph from '../components/UI/Paragraph';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';

// helpers
import getSeason from '../helpers/getSeason';
import capitalize from '../helpers/capitalize';

// vars
import types from '../vars/types';
const {FALL, SPRING, VEGETABLE, CULINARY_HERB, FRUIT} = types;

const activeStyles = {
  paddingVertical: units.unit1,
  paddingHorizontal: units.unit3 + units.unit1,
  color: colors.purpleB,
  backgroundColor: colors.purpleC25,
  fontWeight: 'bold',
  borderRadius: units.unit2,
  overflow: 'hidden', // Ensures that the content is clipped within the rounded borders
};

const inactiveStyles = {
  paddingVertical: units.unit1,
  paddingHorizontal: units.unit4,
  color: colors.purpleB,
  backgroundColor: colors.white,
  fontWeight: 'bold',
};

const Plants = props => {
  const defaultSeason = getSeason();
  const [season, setSeason] = useState(defaultSeason);
  const [plantCategory, setPlantCategory] = useState(VEGETABLE);
  const {plantSelection} = props.route.params;
  const plants =
    season === SPRING
      ? plantSelection.spring_plants
      : plantSelection.fall_plants;

  const plantsFavorites =
    season === SPRING
      ? plantSelection.spring_favorites
      : plantSelection.fall_favorites;

  const plantsFilteredByCategory = plants.filter(
    plant => plant.primary.category.name === plantCategory,
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: '100%',
      }}>
      <View
        style={{padding: units.unit3 + units.unit4, marginBottom: units.unit5}}>
        {/* header */}
        <Header type="h4">Garden Plants</Header>

        {/* season dropdown */}
        <View style={{marginTop: units.unit3}}>
          <Dropdown
            label="Season"
            value={season}
            onChange={value => setSeason(value)}
            options={[
              {label: capitalize(FALL), value: FALL},
              {label: capitalize(SPRING), value: SPRING},
            ]}
          />
        </View>

        {/* plant category tabs */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingVertical: units.unit3,
            marginVertical: units.unit4,
          }}>
          <TouchableOpacity onPress={() => setPlantCategory(VEGETABLE)}>
            <Text
              style={
                plantCategory === VEGETABLE ? activeStyles : inactiveStyles
              }>
              Vegetables
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPlantCategory(CULINARY_HERB)}>
            <Text
              style={
                plantCategory === CULINARY_HERB ? activeStyles : inactiveStyles
              }>
              Herbs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPlantCategory(FRUIT)}>
            <Text
              style={plantCategory === FRUIT ? activeStyles : inactiveStyles}>
              Fruit
            </Text>
          </TouchableOpacity>
        </View>
        <Divider />

        {/* plant selection */}
        <ScrollView>
          <View style={{paddingBottom: units.unit7 + units.unit3}}>
            {plantsFilteredByCategory.map((p, index) => (
              <View key={index}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{
                      height: units.unit5,
                      width: units.unit5,
                      marginRight: units.unit4,
                      borderRadius: units.unit3,
                      marginLeft: units.unit4,
                    }}
                    source={{
                      uri: p.image,
                    }}
                  />
                  <Paragraph
                    style={{
                      fontWeight: 'bold',
                      marginTop: units.unit4,
                      marginBottom: units.unit4,
                      color: colors.greenE75,
                    }}>
                    {capitalize(p.name)}
                  </Paragraph>
                  {plantsFavorites.find(
                    plantsFavorite => plantsFavorite._id === p._id,
                  ) && (
                    <View style={{marginLeft: units.unit3}}>
                      <Ionicons
                        name="star"
                        size={units.unit4}
                        color={colors.purpleB}
                      />
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Plants;
