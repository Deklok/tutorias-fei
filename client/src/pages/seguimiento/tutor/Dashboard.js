import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { mainListItems, secondaryListItems } from './listItems';
import Agenda from './Agenda';
import Tutorados from './Tutorados';
import TemasTutorado from './TemasTutorado';
import Feedback from './Feedback'
import axios from 'axios';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
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
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
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
}));

export default class Dashboard extends React.Component {
  /*const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [correo, setCorreo] = React.useState('');
  const [carrera, setCarrera] = React.useState('');

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  async function cargarDatos(){
    return axios.post('http://localhost:5000/api/miuv/datos', {user: 'zS16011721',
      pass: '************' });
  }

  cargarDatos()
  .then(result=>{
      setCorreo(result.data['correo']);
      setCarrera(result.data['carrera']);
  }).catch(console.log);
*/

  constructor(props){
    super(props);

    this.handleDrawerClose=this.handleDrawerClose.bind(this);
    this.handleDrawerOpen=this.handleDrawerOpen.bind(this);
    this.cargarDatos=this.cargarDatos.bind(this);
  }

  handleDrawerOpen = () => {
    this.setState(this.increment);
  };

  handleDrawerClose = () => {
    this.setState(this.decrement);
  }

  increment(state){
    return {state, open: true};
  }

  decrement(state){
    return {state, open:false};
  }

  cargarDatos = () => {
    return useStyles();
  }

    state={
    correo: '',
    carrera:'',
    open:false,
    classes: this.cargarDatos,
    fixedHeightPaper: clsx(useStyles.paper, useStyles.fixedHeight),
  }

  render(){
    return (
      <div className={this.state.classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={clsx(this.state.classes.appBar, this.state.open && useStyles.appBarShift)}>
          <Toolbar className={useStyles.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              className={clsx(useStyles.menuButton, this.state.open && useStyles.menuButtonHidden)}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={useStyles.title}>
              Tutorado {`${this.state.correo}, ${this.state.carrera}`}
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="#ffffff">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(useStyles.drawerPaper, !this.state.open && useStyles.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={useStyles.toolbarIcon}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>{mainListItems}</List>
          <Divider />
          <List>{secondaryListItems}</List>
        </Drawer>
        <main className={useStyles.content}>
          <div className={useStyles.appBarSpacer} />
          <Container maxWidth="lg" className={useStyles.container}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={3} lg={4}>
                <Paper className={this.state.fixedHeightPaper}>
                  <Feedback />
                </Paper>
              </Grid>
              {/* Chart */}
              <Grid item xs={12} md={3} lg={4}>
                <Paper className={this.state.fixedHeightPaper}>
                  <TemasTutorado />
                </Paper>
              </Grid>
              {/* Recent Tutorados */}
              <Grid item xs={12} md={6} lg={4}>
                <Paper className={useStyles.paper}>
                  <Tutorados />
                </Paper>
              </Grid>
            </Grid>
          </Container>
          <Copyright />
        </main>
      </div>
    );
  }
}
