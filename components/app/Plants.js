import React, { Component } from 'react';
import { View, Image } from 'react-native';
import Paragraph from '../UI/Paragraph';
import units from '../styles/units';

class Plants extends Component {

    render() {

        const { plants } = this.props;

        return (
            <View>
                {plants.map((plant, index) => (
                    <View key={index}>
                        <View
                            style={{
                                paddingTop: units.unit4,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            {/* <Image
                                style={{
                                    height: units.unit6,
                                    width: units.unit6,
                                    marginRight: units.unit4,
                                    borderRadius: units.unit3,
                                }}
                                source={{
                                    uri: plant.image,
                                }}
                            /> */}
                            <Paragraph>{plant.id.name} {plant.id.common_type.name}</Paragraph>
                        </View>
                    </View>
                ))}
            </View>
        )
    }
}

module.exports = Plants;