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

const DashboardInicio = memo(props => {
  const classes = props.classes;
  const [open, setOpen] = React.useState(true);
  const [matricula, setMatricula] = React.useState('');
  const [nombre, setNombre] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [carrera, setCarrera] = React.useState('');
  const [bloque, setBloque] = React.useState('');
  const [inicioBloque, setInicioBloque] = React.useState('');
  const [finBloque, setFinBloque] = React.useState('');
  const [lugar, setLugar] = React.useState('');
  const [fecha, setFecha] = React.useState('');
  const [career, setIdCareer] = React.useState('');
  const [tutorship, setIdTutorship] = React.useState('');
  
  const cookies = new Cookies();
  var cookie = cookies.get('token');
  var username;
  if (cookie) {
    username = utilities.splitCookie(cookie).id;
  }

  async function cargarDatos() {
    return axios.post('http://localhost:5000/api/db/pupilData', {
      studentId: username,
    });
  }

  async function obtenerTutoria(){
    return axios.post('http://localhost:5000/api/db/getTutorship',{
      idTutorship: 8
    });
  }
  async function obtenerIDs() {
    return axios.post('http://localhost:5000/api/db/getcareerBlock', {
      idPupil: username,
    });
  }
  
  obtenerIDs()
  .then(result => {
    setIdCareer(result.data[0][0]['idCareer']);
    setIdTutorship(result.data[0][0]['idTutorship']);
  }).catch(console.log);

  console.log(tutorship);

  var idCareer = 1;
  var idTutorship = 8;
  
  async function obtenerBloque(){
    return axios.post('http://localhost:5000/api/db/getOneBlock',{
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

  cargarDatos()
    .then(result => {
      setNombre(result.data[0][0]['name']);
      setCarrera(result.data[0][0]['careerName']);
      setMatricula(result.data[0][0]['studentId']);
      setEmail(result.data[0][0]['email']);
      notifications(result.data[0][0]['studentId'], result.data[0][0]['idTutor']);
    }).catch(console.log);

  obtenerTutoria()
        .then(result => {
        if(result.status === 200){
          setFecha(result.data[0]['date']);
          setLugar(result.data[0]['place']);
        }
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
            <IconButton color="inherit" label="Cerrar" href="/">
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
    );
});

export default DashboardInicio;