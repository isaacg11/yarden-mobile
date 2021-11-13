
import React, { Component } from 'react';
import { Linking, Text } from 'react-native';

class Link extends Component {

    render() {
        const { 
            text 
        } = this.props;
        
        return (
            <Text style={{color: 'blue'}} onPress={() => {

                // if a callback prop is passed in, run the function
                if(this.props.onPress) return this.props.onPress();

                // if a url is passed in, open to a new web page
                Linking.openURL(url);
            }}>{text}</Text>
        )
    }
}

module.exports = Link;