import React, { memo, Component } from 'react';
import Inicio from './registro/tutorado/SignInSide';
import Dashboard from './seguimiento/tutor/Dashboard';
import Dashboard2 from './seguimiento/tutorado/DashboardTutorado';
import DashboardTutorado from './seguimiento/tutorado/DashboardTutorado'
import { useStyles } from './Styles';
import { Route, Switch, Redirect } from 'react-router-dom';
import BlockRegistry from './registro/tutor/BlocksRegistry';

const Home = memo(props => {
    const classes = useStyles();
    return (
        <div className="App">
            <header className="App-header">
                <Switch>
                    <Route exact path="/">
                        <Inicio
                            classes={classes}
                            path={props.path}
                        />
                    </Route>
                    <Route path="/tutorado">
                        <DashboardTutorado
                            classes={classes}
                            path={props.path}
                        />
                    </Route>
                    <Route path="/tutor">
                        <Dashboard
                            classes={classes}
                            path={props.path}
                        />
                    </Route>
                    <Switch>
                        <Route exact path="/registro-bloques">
                            <BlockRegistry classes={classes} />
                        </Route>
                    </Switch>
                </Switch>
            </header>
        </div>
    );
});

export default Home;