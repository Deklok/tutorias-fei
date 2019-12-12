import React, { memo } from 'react';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Banner from './components/Banner'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Agenda from '../components/Agenda'
import TemasTutorado from '../components/TemasTutorado'
import axios from 'axios';
import Cookies from 'universal-cookie';
import utilities from '../../../utilities';
import StarIcon from '@material-ui/icons/Star'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { notifications, initNotifications } from '../../pushOneSignal';
import { Redirect, Route, Switch } from 'react-router-dom';
import io from 'socket.io-client';
import notifier from 'simple-react-notifications';
import { createSocket } from 'dgram';

const cookies = new Cookies();

const DashboardTutorado = memo(props => {
  const classes = props.classes;
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(5);
  const [status, setStatus] = React.useState('');
  const [sessionsTutorado, setRouteSessionsTutorado] = React.useState(false);
  const [agendTutorado, setRouteAgendTutorado] = React.useState(false);
  const [acceptButton, setAcceptButton] = React.useState(false);
  const [cancelButton, setCancelButton] = React.useState(true);
  const [matricula, setMatricula] = React.useState('');
  const [nombre, setNombre] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [carrera, setCarrera] = React.useState('');
  const [idTutor, setidTutor] = React.useState('');
  const [agenda, setAgenda] = React.useState('');
  const [place, setPlace] = React.useState('');
  const [hour, setHour] = React.useState('');
  const [topics, setTopics] = React.useState('');
  const [socket, setSocket] = React.useState();
  const[sessionId, setSessionId] = React.useState(0);

  var user = utilities.splitCookie(cookies.get('token')).id;
    var token = utilities.splitCookie(cookies.get('token')).token;
    var role = utilities.splitCookie(cookies.get('token')).session;

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const redirectToSessionsTutorado = () => {
    setRouteSessionsTutorado(true);
    setRouteAgendTutorado(false);
  }

  const redirectToAgendTutorado = () => {
    setRouteSessionsTutorado(false);
    setRouteAgendTutorado(true);
  }

  async function getStatus(){
    var user = utilities.splitCookie(cookies.get('token')).id;
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getSessionStatus',{
      idPupil: user
    });
  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    var comments = "";
    for(var option in state){
      if(state[option]){
        comments+=option.split('ption')[1]+',';
      }
    }
    axios.post(process.env.REACT_APP_API_SERVER + 'api/db/feedback/add',{
      grade: value,
      comments: comments,
      session: sessionId
    },{
        headers: { Authorization: token + ";" + role }
      });

  };

  const [state, setState] = React.useState({
    Option1: false,
    Option2: false,
    Option3: false,
    Option4: false,
    Option5: false,
  });

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };

  async function createSocket() {
    return io(process.env.REACT_APP_API_SERVER,{
      query: {
        room: matricula
      }
    });
  }

  function logout() {
    console.log("Loggin out");
    cookies.remove('token');
    window.location.reload();
  }

  async function cargarDatos() {
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/pupilData', {
      studentId: user
    },
      {
        headers: { Authorization: token + ";" + role }
      });
  }

  async function cargarSesion() {
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getSession', {
      idPupil: user
    },
    {
      headers: { Authorization: token + ";" + role }
    });
  }

  function setupNotifications(externalId, tutorId) {
    axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getUsernameTutor', {
      personnelNum: tutorId
    },
    {
      headers: { Authorization: token + ";" + role }
    }).then(result => {
      notifications(matricula, result.data.username);
    });
  }

  React.useEffect(()=>{
    cargarDatos()
    .then(result => {
      if(result){
        setNombre(result.data[0][0]['name']);
        setCarrera(result.data[0][0]['careerName']);
        setMatricula(result.data[0][0]['studentId']);
        setEmail(result.data[0][0]['email']);
        setupNotifications(result.data[0][0]['studentId'], result.data[0][0]['idTutor']);
        getStatus()
        .then(result => {
          if(result.data[0][0] == undefined){
            setStatus(undefined);
          }else{
            setStatus(result.data[0][0]['status']);
            cargarSesion()
              .then(result => {
                if (result) {
                  console.log(result);
                  setSessionId(result.data[0][0].idSession);
                  setAgenda(result.data[0][0].indications);
                  setPlace(result.data[0][0].place);
                  setHour(result.data[0][0].startTime);
                  setTopics(result.data[0][0].topics);
                }
              }).catch(function(err){
                console.log(err);
              })
          }
        })
        redireccion();
        createSocket().then(socket => {
          socket.on("connect", () => {
            console.log("Connected to socket.io on new pupil");
          })

          socket.on("nextInLine", () => {
            setAcceptButton(true);
            notifier.success("Eres el siguiente en la cola. Porfavor confirma tu asistencia", {
              position: "top-right",
              autoClose: 10000
            });
          });

          socket.on("startSession", () => {
            setAcceptButton(false);
            setCancelButton(false);
            notifier.success("Tu tutor ha iniciado la tutoria", {
              position: "top-right",
              autoClose: 10000
            });
          })

          socket.on("endSession", ()=> {
            setOpen(true);
            console.log("Sesion finalizada");
          })

          setSocket(socket);
        }).catch(error => {
          console.log("error while creating socket: " + error);
        });
        }else{
          console.log('Algo salió mal');
        }
    }).catch(console.log);
  },[status]);

  React.useEffect(()=>{
    initNotifications();
  }, []);

  function redireccion(){
    console.log(status);
    if(status == undefined){
      redirectToSessionsTutorado();
    } else if (status == 2){
      redirectToAgendTutorado();
    }
  }

  return (
          <div>
            {sessionsTutorado && <Redirect to="/tutorado/sesiones"/>}
            {agendTutorado && <Redirect to="/tutorado/agendar"/>}
            <div className={classes.root}>
              <CssBaseline />
              <AppBar>
                <Toolbar>
                  <div id="userData" data-userid={matricula}></div>
                  <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                    {matricula} {nombre}, Carrera: {carrera}, contacto: {email}
                  </Typography>
                  <Tooltip title="Fake Feedback">
                    <IconButton onClick={handleClickOpen} color="inherit">
                      <StarIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Cerrar Sesión">
                    <IconButton color="inherit" label="Cerrar" onClick={logout}>
                      <ExitToAppIcon />
                    </IconButton>
                  </Tooltip>
                </Toolbar>
                <Dialog open={open} disableBackdropClick
                  disableEscapeKeyDown
                  aria-labelledby="form-dialog-title">
                  <DialogTitle id="form-dialog-title">Retroalimentación</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Ha finalizado tu tutoría, por favor asigna una calificación
                    </DialogContentText>
                    <Box component="fieldset" mb={3} borderColor="transparent">
                      <Typography component="legend">Calificación</Typography>
                      <Rating
                        name="simple-controlled"
                        size="large"
                        value={value}
                        onChange={(event, newValue) => {
                          setValue(newValue);
                        }}
                      />
                    </Box>
                    <DialogContentText>
                      ¿Hubo algún problema?
                    </DialogContentText>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={state.Option1}
                            onChange={handleChange('Option1')}
                            value="Option1"
                            color="primary"
                          />
                        }
                        label="La información fue irrelevante"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={state.Option2}
                            onChange={handleChange('Option2')}
                            value="Option2"
                            color="primary"
                          />
                        }
                        label="No solucionó mis dudas"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={state.Option3}
                            onChange={handleChange('Option3')}
                            value="Option3"
                            color="primary"
                          />
                        }
                        label="Mi tutor no asistió/no llego a tiempo"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={state.Option4}
                            onChange={handleChange('Option4')}
                            value="Option4"
                            color="primary"
                          />
                        }
                        label="Espere mucho para ser atendido"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={state.Option5}
                            onChange={handleChange('Option5')}
                            value="Option5"
                            color="primary"
                          />
                        }
                        label="El tiempo no fue suficiente"
                      />
                    </FormGroup>
                  </DialogContent>
                  <DialogActions>
                    <Button color="primary" onClick={handleClose}>
                      Enviar
                    </Button>
                  </DialogActions>
                </Dialog>
              </AppBar>
              <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                  <Banner classes={classes} estado={false} socket={socket} accept={acceptButton} cancel={cancelButton} setAccept={setAcceptButton} setCancel={setCancelButton} />
                  <Grid container spacing={3}>
                    {/* Agenda */}
                    <Grid item xs={12} sm={8} lg={8} id="agenda">
                      <Typography variant="h6" gutterBottom>
                        Agenda
                        </Typography>
                      <Divider />
                      <Agenda className={classes.markdown}>
                        {agenda}
                      </Agenda>
                    </Grid>
                    {/* Temas Tutorado */}
                    <Grid item xs={12} sm={4} lg={4}>
                      <Paper elevation={0} className={classes.sidebarAboutBox}>
                        <TemasTutorado temasTutorado = {topics} />
                      </Paper>
                    </Grid>
                  </Grid>
                </Container>
              </main>
            </div>
          </div>

  );
});

export default DashboardTutorado;
