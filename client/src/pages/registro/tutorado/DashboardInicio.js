import React, {memo} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import NotificationsIcon from '@material-ui/icons/Notifications';
import axios from 'axios';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';
import Schedule from './components/Scheduler';
import { notifications } from '../../pushOneSignal';
import Cookies from 'universal-cookie';
import utilities from '../../../utilities';
import { Redirect } from 'react-router-dom';

const DashboardInicio = memo(props => {
  const classes = props.classes;
  const [matricula, setMatricula] = React.useState('');
  const [nombre, setNombre] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [carrera, setCarrera] = React.useState('');
  const [bloque, setBloque] = React.useState('');
  const [inicioBloque, setInicioBloque] = React.useState('');
  const [finBloque, setFinBloque] = React.useState('');
  const [lugar, setLugar] = React.useState('');
  const [fecha, setFecha] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [mainTutorado, setRouteMainTutorado] = React.useState(false);
  const [agendTutorado, setRouteAgendTutorado] = React.useState(false);
  const [logout, setRouteLogout] = React.useState(false);
  const [career, setIdCareer] = React.useState('');
  const [tutorship, setIdTutorship] = React.useState('');

  const redirectToMainTutorado = () => {
    setRouteMainTutorado(true);
    setRouteAgendTutorado(false);
  }
  
  const redirectToAgendTutorado = () => {
    setRouteMainTutorado(false);
    setRouteAgendTutorado(true);
  }

  const redirectToLogout = () => {
    setRouteLogout(true);
  }
  
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

  async function obtenerTutoria(){
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getTutorship',{
      idTutorship: 28
    });
  }
  
  async function getStatus(){
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getSessionStatus',{
      idPupil: username
    });
  }
  
  async function obtenerIDs() {
    var user = utilities.splitCookie(cookies.get('token')).id;
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getcareerBlock', {
      idPupil: user,
    });
  }
  
  obtenerIDs()
  .then(result => {
    setIdCareer(result.data[0][0]['idCareer']);
    setIdTutorship(result.data[0][0]['idTutorship']);
  }).catch(console.log);

  var idCareer = 5;
  var idTutorship = 28;
  
  async function obtenerBloque(){
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getOneBlock',{
      idCareer: idCareer,
      idTutorship: idTutorship
    });
  }
  
  React.useEffect(()=>{
    obtenerBloque()
      .then(result => {
      if(result.status === 200){
        setInicioBloque(result.data[0]['start']);
        setFinBloque(result.data[0]['end']);
        setBloque(result.data[0]['idBlock']);
      }
    }).catch(console.log);
  },[]);

  React.useEffect(()=>{
    cargarDatos()
    .then(result => {
      console.log('Terminado');
      if(result){
        setNombre(result.data[0][0]['name']);
        setCarrera(result.data[0][0]['careerName']);
        setMatricula(result.data[0][0]['studentId']);
        setEmail(result.data[0][0]['email']);
        notifications(result.data[0][0]['studentId'], result.data[0][0]['idTutor']);
        getStatus()
        .then(result => {
          if(result.data[0][0] == undefined){
            setStatus(undefined);
          }else{
            setStatus(result.data[0][0]['status']);
          }
        })
          redireccion();
        }else{
          console.log('Algo aslio mal');
        }
    }).catch(console.log);
  },[nombre, status]);

  obtenerTutoria()
        .then(result => {
        if(result.status === 200){
          setFecha(result.data[0]['date']);
          setLugar(result.data[0]['place']);
        }
      }).catch(console.log);
      
  function redireccion(){
    if(status == 3){
      redirectToMainTutorado();
    } else if (status == 2){
      redirectToAgendTutorado();
    }
  }

    return (
      <div>
      {mainTutorado && <Redirect to="/tutorado"/>}
      {agendTutorado && <Redirect to="/tutorado/agendar"/>}
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
            <IconButton color="inherit" label="Cerrar" onClick={redirectToLogout}>
              {logout && <Redirect to="/logout"/>}
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
        <main className={classes.content}>
        <div className={classes.appBarSpacer} />
         <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={12}>
            {/* Scheduler */}
              <Grid item xs={12} md={12} lg={12}>
               <div>
                  <Schedule 
                    inicioBloque = {inicioBloque}
                    finBloque = {finBloque}
                    bloque = {bloque}
                    lugar = {lugar}
                    fecha = {fecha}
                    matricula = {matricula}
                  />
                </div>
              </Grid>
            </Grid>
          </Container>
        </main>
      </div>
      </div>
    );
});

export default DashboardInicio;