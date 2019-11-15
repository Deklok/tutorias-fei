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

const tutorAccess = (exist)=>{
    return exist && utilities.splitCookie(cookies.get('token')).session == 'true';
}

const pupilAccess = (exist)=> {
    return exist && utilities.splitCookie(cookies.get('token')).session == 'false';
}

const cookieExist = ()=> {
    if (cookies.get('token') != undefined) {
        var cookie = utilities.splitCookie(cookies.get('token'));
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
    });

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
                        {tutorAccess(guard) ? <Dashboard
                        classes={classes}
                        path={props.path}
                        registryBlockClasses={registryBlockClasses}
                        /> : <Redirect to={'/'}/>}
                    </Route>
                    <Route exact path="/tutorado">
                        {pupilAccess(guard) ? <DashboardTutorado
                        classes={classes}
                        path={props.path}
                        /> : <Redirect to={'/'}/>}
                    </Route>
                    <Route path="/tutorado/dashboard-inicio">
                        {pupilAccess(guard) ?
                             <DashboardInicio classes={classes} />
                             : <Redirect to ={'/'} />
                         }
                    </Route>
                    <Route path="/tutorado/dashboard-fin">
                        {pupilAccess(guard) ?
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