import React, {memo, Component } from 'react';
import Dashboard from './seguimiento/tutor/Dashboard';
import DashboardTutorado from './seguimiento/tutorado/DashboardTutorado'
import {useStyles} from './Styles';

const Home = memo(props=>{
	const classes = useStyles();
    return (
        <div className="App">
            <header className="App-header">
                {/* <Dasboard */}
                <DashboardTutorado
                	classes={classes}
                    path={props.path}
                />
            </header>
        </div>
    );
});

export default Home;