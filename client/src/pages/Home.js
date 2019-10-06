import React, { Component } from 'react';
import logo from './logo.svg';
import Dashboard from './seguimiento/tutor/Dashboard'

class Home extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <Dashboard/>
                </header>
            </div>
        );
    }
}

export default Home;