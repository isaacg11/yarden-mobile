import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingIndicator from '../UI/LoadingIndicator';
import Paragraph from '../UI/Paragraph';
import Card from '../UI/Card';
import {getProductCategories} from '../../actions/productCategories/index';
import capitalize from '../../helpers/capitalize';
import units from '../../components/styles/units';
import colors from '../styles/colors';

class ProductCategories extends Component {
  state = {};

  async componentDidMount() {
    // show loading indicator
    this.setState({isLoading: true});

    // get product categories
    await this.props.getProductCategories();

    // hide loading indicator
    this.setState({isLoading: false});
  }

  render() {
    const {productCategories, onPress, user} = this.props;

    const {isLoading} = this.state;

    // check to see if customer already has garden beds
    const customerHasGarden = user.garden_info && user.garden_info.beds;

    return (
      <View>
        {/* loading indicator */}
        <LoadingIndicator loading={isLoading} />

        {/* product categories */}
        {productCategories.map((category, index) => {
          // if "garden beds" or "potted plants" category and customer does not have garden yet {...}
          if (
            (category.name === 'garden beds' ||
              category.name === 'potted plants') &&
            !customerHasGarden
          ) {
            // render nothing
            return <View key={index}></View>;
          }

          // render category
          return (
            <Card key={index} style={{marginTop: units.unit4}}>
              <TouchableOpacity onPress={() => onPress(category)}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Paragraph style={{fontWeight: 'bold'}}>
                    {capitalize(category.name)}
                  </Paragraph>
                  <Ionicons
                    name="arrow-forward"
                    size={30}
                    color={colors.purpleB}
                  />
                </View>
              </TouchableOpacity>
            </Card>
          );
        })}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    productCategories: state.productCategories,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getProductCategories,
    },
    dispatch,
  );
}

ProductCategories = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductCategories);

export default ProductCategories;

module.exports = ProductCategories;
