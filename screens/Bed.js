// libraries
import React, { Component } from 'react';
import { Modal, View, ScrollView, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// UI components
import { BlurView } from '@react-native-community/blur';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import Button from '../components/UI/Button';
import Rectangle from '../components/app/Rectangle';

// actions
import { sendEmail } from '../actions/emails/index';

// styles
import units from '../components/styles/units';
import colors from '../components/styles/colors';
import types from '../vars/types';

class Bed extends Component {
  state = {
    bedNumber: 1,
    paywallModalIsOpen: false
  };

  componentDidMount() {

    // if customer and no plan id found {...}
    if (this.props.user.type === types.CUSTOMER && !this.props.user.payment_info.plan_id) {

      // show paywall modal
      this.setState({
        paywallModalIsOpen: true
      })
    }
  }

  async initSubscription() {

    // format email
    const newSubscriptionRequest = {
      email: 'isaac.grey@yardengarden.com',
      subject: `Yarden - (ACTION REQUIRED) New membership request`,
      label: 'Membership Request',
      body: (
        '<p>Hello <b>Yarden HQ</b>,</p>' +
        '<p style="margin-bottom: 15px;">A new membership request has been submitted by <u>' + this.props.user.email + '</u>, please contact the lead to finalize the request.</p>'
      )
    }

    // send email
    await this.props.sendEmail(newSubscriptionRequest);

    this.setState({
      requestSubmitted: true
    })
  }

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
              this.props.navigation.navigate('Notes', { selectedPlant, bedId })
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
    const {
      isLoading,
      paywallModalIsOpen,
      requestSubmitted
    } = this.state;
    const {
      bed,
      order,
      bedId,
      serviceReport
    } = this.props.route.params;

    return (
      <View
        maximumZoomScale={10}
        minimumZoomScale={1}
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex'
        }}>
        <ScrollView
          style={{
            paddingTop: units.unit3,
            overflow: 'visible',
            flex: 1,
          }}>
          {/* loading indicator */}
          <LoadingIndicator loading={isLoading} />

          {/* garden bed map */}
          {this.renderMap(bed, order, bedId, serviceReport)}
        </ScrollView>

        {/* paywall modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={paywallModalIsOpen}>
          <BlurView style={styles.blurContainer} blurType="dark" blurAmount={10} />
          <View style={styles.messageContainer}>
            <View style={{
              backgroundColor: colors.white,
              padding: units.unit5,
              borderRadius: units.unit4,
              width: 325
            }}>
              <View style={styles.overlayContainer}>
                <BlurView style={styles.blurContainer} blurType="light" blurAmount={10} />
              </View>
              {(requestSubmitted) ? (
                <View style={{ marginTop: units.unit5 }}>
                  <Text style={{ color: colors.purpleB, textAlign: 'center', fontSize: units.unit5 }}>٩(^‿^)۶</Text>
                  <Text style={{ color: colors.greenD50, fontSize: 12, marginTop: units.unit4, textAlign: 'center' }}>Thanks! We got your message and will contact you soon.</Text>
                </View>
              ) : (
                <View style={{ marginTop: units.unit5 }}>
                  <Text style={{ textAlign: 'center', fontSize: units.unit5 }}>{'\uD83E\uDD28'}</Text>
                  <Text style={{ color: colors.purpleB, textAlign: 'center', fontSize: units.unit5 }}>{' '}{'<) .)>'}</Text>
                  <Text style={{ color: colors.purpleB, textAlign: 'center', fontSize: units.unit5 }}>{'   '}{'|  \\_'}</Text>
                  <Text style={{ color: colors.greenD50, fontSize: 12, marginTop: units.unit4, textAlign: 'center' }}>Not so fast! You've got to subscribe to get past me.</Text>
                </View>
              )}
              {(requestSubmitted) ? (
                <View style={{ marginTop: units.unit5 }}>
                  <Button
                    text="Dashboard"
                    variant="button"
                    onPress={() => this.props.navigation.navigate('Dashboard')}
                  />
                </View>
              ) : (
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: units.unit5 }}>
                  <Button
                    text="Back"
                    variant="btn5"
                    onPress={() => {
                      this.setState({ paywallModalIsOpen: false });
                      this.props.navigation.navigate('Dashboard')
                    }}
                  />
                  <Button
                    text="Get Started"
                    variant="button"
                    onPress={() => this.initSubscription()}
                  />
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  messageContainer: {
    position: 'absolute',
    top: '30%',
    backgroundColor: 'transparent',
    paddingLeft: units.unit5,
    paddingRight: units.unit4 + units.unit4,
  },
});

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      sendEmail
    },
    dispatch,
  );
}

Bed = connect(mapStateToProps, mapDispatchToProps)(Bed);

export default Bed;

module.exports = Bed;
