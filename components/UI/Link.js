
import React, { Component } from 'react';
import { Linking } from 'react-native';
import Paragraph from './Paragraph';

class Link extends Component {

    render() {
        const { 
            text 
        } = this.props;
        
        return (
            <Paragraph style={{color: 'blue'}} onPress={() => {

                // if a callback prop is passed in, run the function
                if(this.props.onPress) return this.props.onPress();

                // if a url is passed in, open to a new web page
                Linking.openURL(url);
            }}>{text}</Paragraph>
        )
    }
}

module.exports = Link;