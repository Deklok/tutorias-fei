import React, { memo } from 'react';
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
import { mainListItems, secondaryListItems } from './DashboardOptions';
import Agenda from './elements/Agenda';
import Tutorados from './elements/Tutorados';
import TemasTutorado from './elements/TemasTutorado';
import Feedback from './elements/Feedback'
import CurrentTutorado from './elements/CurrentTutorado'
import NextTutorado from './elements/NextTutorado'
import axios from 'axios';

const Dashboard = memo(props => {
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

  async function cargarDatos() {
    return axios.post('http://localhost:5000/api/miuv/datos', {
      user: 'zS16011721',
      pass: 'Barcelona_Benji2016'
    });
  }

  const test = "## Primera Tutoría del Semestre\n#### April 1, 2020 by [@revo](https://twitter.com/elrevo)\n\nWhy do we use it? **esto está en negritas** It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English...\n\n![image](https://images.unsplash.com/photo-1502759683299-cdcd6974244f?auto=format&fit=crop&w=440&h=220&q=60)"

  cargarDatos()
    .then(result => {
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
            <Badge badgeContent={4} color="error">
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
          <Grid container spacing={3} justify="flex-end">
            {/* Tutoria Controles */}
            <Grid item xs={12} md={8} lg={8}>
              <CurrentTutorado />
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <NextTutorado />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            {/* Agenda */}
            <Grid item xs={12} md={4} lg={5}>
              <Typography variant="h6" gutterBottom>
                Agenda
                </Typography>
              <Divider />
              <Agenda className={classes.markdown}>
                {test}
              </Agenda>
            </Grid>
            {/* Temas Tutorado */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper elevation={0} className={classes.sidebarAboutBox}>
                <TemasTutorado />
              </Paper>
            </Grid>
            {/* Recent Tutorados */}
            <Grid item xs={12} md={4} lg={4}>
              <Paper className={classes.paper}>
                <Tutorados />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
});

export default Dashboard;
