import React, { Component } from 'react';
import Error from '../../screens/Error';
import RNRestart from 'react-native-restart';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error) {
        console.log(error);
        throw new Error(error);
    }

    render() {
        if (this.state.hasError) {
            // fallback UI 
            return <Error restart={() => RNRestart.Restart()} />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;