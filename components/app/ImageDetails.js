import React, {Component} from 'react';
import {View, Modal, Image} from 'react-native';
import Link from '../UI/Link';
import Paragraph from '../UI/Paragraph';
import units from '../../components/styles/units';

class ImageDetails extends Component {
  render() {
    const {isOpen = false, url, close} = this.props;

    return (
      <View>
        {/* image details modal start */}
        <Modal
          animationType="slide"
          visible={isOpen}
          presentationStyle="fullScreen">
          <View style={{marginTop: units.unit7}}>
            <View style={{padding: units.unit5}}>
              <Link text="Back" onPress={() => close()} />
              <Paragraph
                style={{
                  fontSize: fonts.h3,
                  marginBottom: units.unit6,
                  marginTop: units.unit5,
                }}>
                Image Details
              </Paragraph>
              <Image source={{uri: url}} style={{width: '100%', height: 200}} />
            </View>
          </View>
        </Modal>
        {/* image details modal end */}
      </View>
    );
  }
}

module.exports = ImageDetails;
