import React, {memo} from 'react';
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
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { mainListItems, secondaryListItems } from '../../seguimiento/tutor/DashboardOptions';
import axios from 'axios';
import Scheduler from './components/Scheduler';

const DashboardInicio = memo(props => {
  const classes = props.classes;
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
      pass: 'Barcelona_Benji2016' });
  }

  cargarDatos()
  .then(result=>{
      setCorreo(result.data['correo']);
      setCarrera(result.data['carrera']);
  }).catch(console.log);

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              Tutorado {`${correo}, ${carrera}`}
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
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>{mainListItems}</List>
          <Divider />
          <List>{secondaryListItems}</List>
        </Drawer>
        <main className={classes.content}>
        <div className={classes.appBarSpacer} />
         <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={12}>
            {/* Scheduler */}
              <Grid item xs={12} md={12} lg={12}>
               <div>
                  <Scheduler />
                </div>
              </Grid>
            </Grid>
          </Container>
        </main>
      </div>
    );
});

export default DashboardInicio;