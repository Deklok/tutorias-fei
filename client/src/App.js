import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { RouterGuard } from "react-router-guard";
import Home from './pages/Home';
import auth from './auth';

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
        />
      </Switch>
    );
  }
}

export default App;
