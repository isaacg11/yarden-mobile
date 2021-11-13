
import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

class Collapse extends Component {

    state = {}

    componentDidMount() {
        if(this.props.open) {
            this.setState({isOpen: true});
        }
    }

    render() {

        const {
            title = 'View Details',
            content
        } = this.props;

        const {
            isOpen
        } = this.state;

        return (
            <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                <TouchableOpacity onPress={() => this.setState({ isOpen: !isOpen })}>
                    <View style={{ display: 'flex', flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: 'bold'}}>{title}</Text>
                        <Ionicons name={`caret-${(isOpen) ? 'up' : 'down' }-circle-outline`} size={30} style={{ alignSelf: 'flex-end' }} />
                    </View>
                </TouchableOpacity>
                {(isOpen) && (
                    <View>
                        {content}
                    </View>
                )}
            </View>
        )
    }
}

module.exports = Collapse;