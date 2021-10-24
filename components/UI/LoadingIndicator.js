
import React, { Component } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#FFF'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    }
});

class LoadingIndicator extends Component {

    render() {
        const {
            loading,
            message = 'Loading...'
        } = this.props;

        return (
            <Spinner
                visible={loading}
                textContent={message}
                textStyle={styles.spinnerTextStyle}
            />
        )
    }
}

module.exports = LoadingIndicator;