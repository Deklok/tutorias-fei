import React, { memo, Component } from 'react';
import Inicio from './registro/tutorado/SignInSide';
import Dashboard from './seguimiento/tutor/Dashboard';
import DashboardTutorado from './seguimiento/tutorado/DashboardTutorado';
import DashboardInicio from './registro/tutorado/DashboardInicio';
import DashboardFin from './registro/tutorado/DashboardFin';
import { useStyles } from './Styles';
import { Route, Switch, Redirect } from 'react-router-dom';
import BlockRegistry from './registro/tutor/BlocksRegistry';
import { makeStyles } from '@material-ui/styles';

const registryBlockStyles = makeStyles(theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: '100%',
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        margin: theme.spacing(2),
        marginTop: 10,
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    registryBox: {
        marginTop: 30,
        marginRight: 'auto',
        marginLeft: 'auto',
        width: '60%',
    },
    blockList: {
        marginTop: 30,
        marginRight: 'auto',
        marginLeft: 'auto',
        width: '60%',
        ['@media (max-width:767px)']:{
            marginLeft: 15,
            width: '40%',
        }
    },
    blockCell: {
        ['@media (max-width: 767px)']:{
            width: '20%',
            margin: 0,
            padding: 5,
        }
    },
    root: {
        padding: theme.spacing(3, 2),
    },
    button: {
        margin: theme.spacing(1),
        width: "95%",
    },
    careerField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '95%',
    },
    timeField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '46.5%',
        ['@media (max-width:780px)']: {
            width: '95%',
        },
    },
    
}));

const CustomRoute = ({ ...rest}) => (
    <Route {...rest} render={(props) => (
        sessionStorage.getItem('token') == true
        ? <Redirect to='/tutor' />
        : <Redirect to='/pupil'/>
    )} />
)

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
                    <Route exact path="/">
                        {guard == null ? <Inicio
                            classes={classes}
                            path={props.path}
                            history={props.history}
                        /> : <Redirect to={'/protected'}/>}
                    </Route>
                    <Route exact path="/tutor">
                        {guard != null ? <Dashboard
                        classes={classes}
                        path={props.path}
                        /> : <Redirect to={'/'}/>}
                    </Route>
                    <Route exact path="/pupil">
                        {guard != null ? <DashboardTutorado
                        classes={classes}
                        path={props.path}
                        /> : <Redirect to={'/'}/>}
                    </Route>
                    <CustomRoute path="/protected"/>
                    <Route exact path="/registro-bloques">
                        <BlockRegistry classes={registryBlockClasses} />
                    </Route>
                    <Route exact path="/dashboard-inicio">
                        <DashboardInicio classes={classes} />
                    </Route>
                    <Route exact path="/dashboard-fin">
                        <DashboardFin classes={classes} />
                    </Route>
                </Switch>
            </header>
        </div>
    );
});

export default Home;