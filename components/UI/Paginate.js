
import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Paragraph from './Paragraph';

class Paginate extends Component {

    state = {}

    render() {

        const {
            page,
            limit,
            total,
            onPaginate
        } = this.props;

        return (
            <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 5 }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => onPaginate('back')}>
                        <Ionicons name="arrow-back" size={30} color={(page > 1) ? null : "#fff"} />
                    </TouchableOpacity>
                    <Paragraph style={{ fontWeight: 'bold' }}>{page} / {Math.ceil(total / limit)}</Paragraph>
                    <TouchableOpacity onPress={() => onPaginate('forward')}>
                        <Ionicons name="arrow-forward" size={30} color={(page === Math.ceil(total / limit)) ? "#fff" : null}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

module.exports = Paginate;