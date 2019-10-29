import React, {memo, Component } from 'react';
import Inicio from './registro/tutorado/SignInSide';
import Dashboard from './seguimiento/tutor/Dashboard';
import Dashboard2 from './registro/tutorado/Dashboard';
import DashboardTutorado from './seguimiento/tutorado/DashboardTutorado'
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
                        //Aqui cuando se haga la integración en lugar de ser tutor será la pantalla de login
                        <Redirect to="/tutor" />
                    </Route>
                    <Route path="/tutorado">
                        <DashboardTutorado
                            classes={classes}
                            path={props.path}
                        />
                    </Route>
                    <Route path="/tutor">
                        <Dashboard2
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