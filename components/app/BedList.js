// libraries
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// UI components
import Label from '../UI/Label';
import Card from '../UI/Card';

// helpers
import formatDimensions from '../../helpers/formatDimensions';

// styles
import units from '../styles/units';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

class BedList extends Component {

    render() {

        const { beds } = this.props;

        const styles = {
            borderColor: colors.greenD10,
            borderWidth: 1,
            borderRadius: units.unit3,
            padding: units.unit4,
            marginBottom: units.unit4,
            minHeight: units.unit6
        }

        if (beds.length < 1) {
            return (
                <View>
                    <View style={{ ...styles }}>
                        <Text style={{ color: colors.greenD25 }}>Your garden beds will appear here when they're ready</Text>
                    </View>
                    <View style={{ ...styles }}></View>
                    <View style={{ ...styles }}></View>
                </View>
            )
        } else {
            return beds.map((bed, index) => (
                <View key={index}>
                    <TouchableOpacity 
                        onPress={() => this.props.onSelect({
                            bed: bed, 
                            bedId: bed.key
                        })}>
                        <Card style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: units.unit4,
                            padding: units.unit4,
                            paddingVertical: units.unit3,
                            backgroundColor: colors.white
                        }}>
                            <View style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <View>
                                    <Image
                                        source={{
                                            uri: 'https://yarden-garden.s3.us-west-1.amazonaws.com/mobile/raised-bed-01.png',
                                        }}
                                        style={{
                                            marginTop: -units.unit4 - units.unit3,
                                            marginRight: units.unit4,
                                            width: units.unit6 + units.unit4,
                                            height: units.unit6 + units.unit4,
                                        }}
                                    />
                                </View>
                                <View>
                                    <Text
                                        style={{
                                            fontSize: fonts.h3,
                                            fontFamily: fonts.default,
                                            color: colors.greenD75
                                        }}>
                                        "{bed.name}"
                                    </Text>
                                    <Label>{formatDimensions(bed)}</Label>
                                    <Label>Garden #{bed.key}</Label>
                                </View>
                            </View>
                            <View>
                                <Ionicons
                                    name={'chevron-forward-outline'}
                                    color={colors.purpleB}
                                    size={fonts.h2} />
                            </View>
                        </Card>
                    </TouchableOpacity>
                </View>
            ))
        }
    }
}

function mapStateToProps(state) {
    return {
        conversations: state.conversations,
        user: state.user,
        beds: state.beds
    };
}

BedList = connect(mapStateToProps, null)(BedList);

export default BedList;

module.exports = BedList;
