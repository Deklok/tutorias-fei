import React, {memo, Component } from 'react';
import logo from './logo.svg';
import Dashboard from './seguimiento/tutor/Dashboard';
import {useStyles} from './Styles';

const Home = memo(props=>{
	const classes = useStyles();
    return (
        <div className="App">
            <header className="App-header">
                <Dashboard
                	classes={classes}
                />
            </header>
        </div>
    );
});

export default Home;