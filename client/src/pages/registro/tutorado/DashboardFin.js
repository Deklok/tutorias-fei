import React, { memo } from 'react';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Indicacion from './components/Indicacion'
import NotificationsIcon from '@material-ui/icons/Notifications';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Horario from './components/Horario';
import TemasTutorado from './components/TemasTutorado';
import Cookies from 'universal-cookie';
import utilities from '../../../utilities';

const DashboardFin = memo(props => {
  const classes = props.classes;
  const [matricula, setMatricula] = React.useState('');
  const [nombre, setNombre] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [carrera, setCarrera] = React.useState('');
  const [status, setStatus] = React.useState('');

  async function getStatus(){
    var user = utilities.splitCookie(cookies.get('token')).id;
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getSessionStatus',{
      idPupil: user
    });
  }

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const cookies = new Cookies();
  var cookie = cookies.get('token');
  var username;
  if (cookie) {
    username = utilities.splitCookie(cookie).id;
  }

  async function cargarDatos() {
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/pupilData', {
      studentId: username,
    });
  }

  const indicaciones = "## Primera Tutoría del Semestre\n#### April 1, 2020 by [@elrevo](https://twitter.com/elrevo)\n\nWhy do we use it? **esto está en negritas** It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English...\n\n![image](https://images.unsplash.com/photo-1502759683299-cdcd6974244f?auto=format&fit=crop&w=440&h=220&q=60)"

  cargarDatos()
    .then(result => {
      setNombre(result.data[0][0]['name']);
      setCarrera(result.data[0][0]['careerName']);
      setMatricula(result.data[0][0]['studentId']);
      setEmail(result.data[0][0]['email']);
    }).catch(console.log);
    
  getStatus()
  .then(result => {
    if(result.data[0][0] == undefined){
      setStatus(undefined);
    }else{
      setStatus(result.data[0][0]['status']);
    }
  }).catch(console.log);
  
  function redireccion(){
    console.log(status);
    if(status == undefined){
      window.location.href = "/tutorado/sesiones";
    } else if (status == 3){
      window.location.href = "/tutorado";
    }
  }

  window.addEventListener("load", redireccion());

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
            <IconButton color="inherit" label="Cerrar" href="/logout">
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Indicacion classes={classes} idPupil={username}/>
          <Grid container spacing={3}>
            {/* Agenda */}
            <Grid item xs={12} sm={8} lg={7} id="horario">
              <Typography variant="h6" gutterBottom>
                Agenda
		            </Typography>
              <Divider />
              <Horario className={classes.markdown}
                idPupil = {username}
              />
            </Grid>
            {/* Temas Tutorado */}
            <Grid item xs={12} sm={4} lg={5}>
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

export default DashboardFin;