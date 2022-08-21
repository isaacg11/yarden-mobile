
import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';

class Rectangle extends Component {

    render() {

        const { onPress } = this.props;

        return (
            <View>
                <View style={{ display: 'flex', flexDirection: 'row', alignSelf: 'center' }}>
                    <TouchableOpacity 
                        onPress={() => onPress(1)}
                        style={{ width: '50%', height: 250, borderColor: 'black', borderWidth: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <View>
                            <Text>Section 1</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => onPress(2)}
                        style={{ width: '50%', height: 250, borderColor: 'black', borderWidth: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <View>
                            <Text>Section 2</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View 
                    style={{ display: 'flex', flexDirection: 'row', alignSelf: 'center' }}>
                    <TouchableOpacity 
                        onPress={() => onPress(3)}
                        style={{ width: '50%', height: 250, borderColor: 'black', borderWidth: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <View>
                            <Text>Section 3</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => onPress(4)}
                        style={{ width: '50%', height: 250, borderColor: 'black', borderWidth: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <View>
                            <Text>Section 4</Text>
                        </View>
                    </TouchableOpacity>
                </View>
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