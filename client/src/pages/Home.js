import React, { memo, Component } from 'react';
import Inicio from './registro/tutorado/SignInSide';
import Dashboard from './seguimiento/tutor/Dashboard';
import DashboardTutorado from './seguimiento/tutorado/DashboardTutorado';
import DashboardInicio from './registro/tutorado/DashboardInicio';
import DashboardFin from './registro/tutorado/DashboardFin';
import { useStyles, registryBlockStyles} from './Styles';
import { Route, Switch, Redirect } from 'react-router-dom';
import BlockRegistry from './registro/tutor/BlocksRegistry';
import { makeStyles } from '@material-ui/styles';

const CustomRoute = ({ ...rest}) => (
    <Route {...rest} render={(props) => (
        sessionStorage.getItem('token') == 'true'
        ? <Redirect to='/tutor' />
        : <Redirect to='/tutorado'/>
    )} />
)

const validate = ()=>{
    return sessionStorage.getItem('token') == 'true';
}

const Home = memo(props => {
    const [guard, setGuard] = React.useState(null);
    const classes = useStyles();
    const registryBlockClasses = registryBlockStyles();

    React.useEffect(()=>{
        var guard_aux = sessionStorage.getItem('token');
        if(guard_aux != null){
            setGuard(guard_aux);
        }
    });

    return (
        <div className="App">
            <header className="App-header">
                <Switch>
                    <CustomRoute path="/protected"/>
                    <Route exact path="/">
                        {guard == null ? <Inicio
                            classes={classes}
                            path={props.path}
                            history={props.history}
                        /> : <Redirect to={'/protected'}/>}
                    </Route>
                    <Route path='/tutor'>
                        {validate() ? <Dashboard
                        classes={classes}
                        path={props.path}
                        registryBlockClasses={registryBlockClasses}
                        /> : <Redirect to={'/'}/>}
                    </Route>
                    <Route exact path="/tutorado">
                        {guard != null ? <DashboardTutorado
                        classes={classes}
                        path={props.path}
                        /> : <Redirect to={'/'}/>}
                    </Route>
                    <Route path="/tutorado/dashboard-inicio">
                        {!validate() ?
                             <DashboardInicio classes={classes} />
                             : <Redirect to ={'/'} />
                         }
                    </Route>
                    <Route path="/tutorado/dashboard-fin">
                        {!validate() ?
                        <DashboardFin classes={classes} />
                        : <Redirect to={'/'} />
                    }
                    </Route>
                </Switch>
            </header>
        </div>
    );
});

export default Home;