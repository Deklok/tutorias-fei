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
import Banner from './components/Banner'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Agenda from '../components/Agenda'
import TemasTutorado from '../components/TemasTutorado'
import axios from 'axios';
import Cookies from 'universal-cookie';
import utilities from '../../../utilities';
import { Switch, Route } from "react-router-dom";

const cookies = new Cookies();

const DashboardTutorado = memo(props => {
  const classes = props.classes;
  const [open, setOpen] = React.useState(true);
  const [matricula, setMatricula] = React.useState('');
  const [nombre, setNombre] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [carrera, setCarrera] = React.useState('');

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  function logout() {
    console.log("Loggin out");
    cookies.remove('token');
    window.location.reload();
  }

  async function cargarDatos() {
    var user = utilities.splitCookie(cookies.get('token')).id;
    var token = utilities.splitCookie(cookies.get('token')).token;
    var role = utilities.splitCookie(cookies.get('token')).session;
    return axios.post('http://localhost:5000/api/db/pupilData', {
      studentId: user
    },
    {
      headers: { Authorization: token + ";" + role }
    });
  }

  const test = `## Segunda Tutoría del Semestre\n#### April 1, 2020 by [@elrevo](https://twitter.com/elrevo)
  Estimados tutorados

  El motivo de este correo es para recordarles que la 2a tutoría se llevará a cabo el día de mañana en los siguientes horarios

  9:00 am a 11:30 am  Atención a estudiantes de Ingeniería de Software

  11:30 am a 14:30 pm Atención a estudiantes de Redes y Servicios de Cómputo

  Les recuerdo a los tutorados de nuevo ingreso que traigan lo que es encargué en la primera tutoría. Los temas que vamos a platicar mañana son:

  - Resultados de los primeros parciales
  - Comentarios previos a la acreditación de la LIS
  - Detectar problemas académicos que podamos atender a tiempo
  - Asuntos generales.

  Cualquier cosa estoy a sus órdenes

  Saludos
  `

  cargarDatos()
    .then(result => {
      console.log(result);
      setNombre(result.data[0][0]['name']);
      setCarrera(result.data[0][0]['careerName']);
      setMatricula(result.data[0][0]['studentId']);
      setEmail(result.data[0][0]['email']);
    }).catch(console.log);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {matricula} {nombre}, Carrera: {carrera}, contacto: {email}
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Tooltip title="Cerrar Sesión">
            <IconButton onClick={logout} color="inherit" label="Cerrar">
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Banner classes={classes} estado={false} />
          <Grid container spacing={3}>
            {/* Agenda */}
            <Grid item xs={12} sm={8} lg={8} id="agenda">
              <Typography variant="h6" gutterBottom>
                Agenda
		            </Typography>
              <Divider />
              <Agenda className={classes.markdown}>
                {test}
              </Agenda>
            </Grid>
            {/* Temas Tutorado */}
            <Grid item xs={12} sm={4} lg={4}>
              <Paper elevation={0} className={classes.sidebarAboutBox}>
                <TemasTutorado />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
});

export default DashboardTutorado;
