import React, {memo} from 'react';
import clsx from 'clsx';
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
import Scheduler from './components/Scheduler';

const DashboardInicio = memo(props => {
  const classes = props.classes;
  const [open, setOpen] = React.useState(true);
  const [matricula, setMatricula] = React.useState('');
  const [nombre, setNombre] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [carrera, setCarrera] = React.useState('');

  async function cargarDatos() {
    return axios.post('http://localhost:5000/api/db/pupilData', {
      studentId: 'S16011721',
    });
  }

  const test = "## Primera Tutoría del Semestre\n#### April 1, 2020 by [@elrevo](https://twitter.com/elrevo)\n\nWhy do we use it? **esto está en negritas** It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English...\n\n![image](https://images.unsplash.com/photo-1502759683299-cdcd6974244f?auto=format&fit=crop&w=440&h=220&q=60)"

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
            <IconButton color="inherit" label="Cerrar">
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