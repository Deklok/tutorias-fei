import React, { memo } from 'react';
import Inicio from './registro/tutorado/LogIn';
import Dashboard from './seguimiento/tutor/Dashboard';
import DashboardTutorado from './seguimiento/tutorado/DashboardTutorado';
import DashboardInicio from './registro/tutorado/DashboardInicio';
import DashboardFin from './registro/tutorado/DashboardFin';
import { useStyles} from './Styles';
import {registryBlockStyles} from './RegistryStyles'
import { Route, Switch, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import utilities from '../utilities';

const cookies = new Cookies();

const CustomRoute = ({ ...rest}) => (
    <Route {...rest} render={(props) => (
        utilities.splitCookie(cookies.get('token')).session == 'true'
        ? <Redirect to='/tutor' />
        : <Redirect to='/tutorado'/>
    )} />
)

const tutorAccess = ()=>{
    return cookieExist() && utilities.splitCookie(cookies.get('token')).session == 'true';
}

const pupilAccess = ()=> {
    return cookieExist() && utilities.splitCookie(cookies.get('token')).session == 'false';
}

const cookieExist = ()=> {
    if (cookies.get('token') != undefined) {
        return true;
    } else {
        return false;
    }
}

const Home = memo(props => {
    const [guard, setGuard] = React.useState(null);
    const classes = useStyles();
    const registryBlockClasses = registryBlockStyles();

    React.useEffect(()=>{
        var guard_aux = cookieExist();
        console.log(guard_aux);
        if(guard_aux != null){
            setGuard(guard_aux);     
        } 
    }, []);

    const Logout = () =>{
        setGuard(null);
        cookies.remove('token');
        return <Redirect to={'/'} />;
    }

    return (
        <div className="App">
            <header className="App-header">
                <Switch>
                    <CustomRoute path="/protected"/>
                    <Route exact path="/">
                        {!guard ? <Inicio
                            classes={classes}
                            path={props.path}
                            history={props.history}
                        /> : <Redirect to={'/protected'}/>}
                    </Route>
                    <Route path='/tutor'>
                        {tutorAccess() ? <Dashboard
                        classes={classes}
                        path={props.path}
                        registryBlockClasses={registryBlockClasses}
                        /> : <Redirect to={'/tutorado'}/>}
                    </Route>
                    <Route exact path="/tutorado">
                        {pupilAccess() ? <DashboardTutorado
                        classes={classes}
                        path={props.path}
                        /> : <Redirect to={'/'}/>}
                    </Route>
                    <Route path="/tutorado/dashboard-inicio">
                        {pupilAccess() ?
                             <DashboardInicio classes={classes} />
                             : <Redirect to ={'/'} />
                         }
                    </Route>
                    <Route path="/tutorado/dashboard-fin">
                        {pupilAccess() ?
                        <DashboardFin classes={classes} />
                        : <Redirect to={'/'} />
                    }
                    </Route>
                    <Route exact path = "/logout">
                        {!guard ? <Logout /> : <Redirect to={'/'} />}
                    </Route>
                </Switch>
            </header>
        </div>
    );
});

export default Home;