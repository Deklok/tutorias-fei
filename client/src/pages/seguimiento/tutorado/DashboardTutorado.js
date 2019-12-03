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
import { notifications } from '../../pushOneSignal';

const cookies = new Cookies();

const DashboardTutorado = memo(props => {
  const classes = props.classes;
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(5);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/pupilData', {
      studentId: user
    },
      {
        headers: { Authorization: token + ";" + role }
      });
  }

  React.useEffect(()=>{
    cargarDatos()
    .then(result => {
      console.log(result);
      setNombre(result.data[0][0]['name']);
      setCarrera(result.data[0][0]['careerName']);
      setMatricula(result.data[0][0]['studentId']);
      setEmail(result.data[0][0]['email']);
      notifications(result.data[0][0]['studentId'], result.data[0][0]['idTutor']);
    }).catch(console.log);
  },[]);

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

  return (
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
            <IconButton href="/logout" color="inherit" label="Cerrar">
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
