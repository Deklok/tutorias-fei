import React, {memo, Component } from 'react';
import Inicio from './registro/tutorado/SignInSide';
import Dashboard from './seguimiento/tutor/Dashboard';
import DashboardInicio from './registro/tutorado/DashboardInicio';
import DashboardTutorado from './seguimiento/tutorado/DashboardTutorado';
import DashboardFin from './registro/tutorado/DashboardFin';
import {useStyles} from './Styles';
import { Route, Switch, Redirect } from 'react-router-dom';

const Home = memo(props=>{
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
                        <Redirect to="/" />
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
                    <Route exact path="/dashboardinicio">
                        <DashboardInicio 
                            classes={classes}
                            path={props.path}
                        />
                    </Route>
                    <Route exact path="/dashboardfin">
                        <DashboardFin 
                            classes={classes}
                            path={props.path}
                        />
                    </Route>
                </Switch>
            </header>
        </div>
    );
});

export default Home;