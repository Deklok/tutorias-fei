import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';

class App extends Component {
  render() {
    const App = () => (
      <div>
        <Home />
      </div>
    )
    return (
      <Switch>
        <App />
      </Switch>
    );
  }
}

export default App;
