/* eslint-disable no-script-url */

import React, { memo } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link'
import notifier from 'simple-react-notifications';
import 'simple-react-notifications/dist/index.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import utilities from '../../../../utilities';

const cookies = new Cookies();
const route = process.env.REACT_APP_API_SERVER;

async function notifyCancelSession() {
  var user = utilities.splitCookie(cookies.get('token')).id;
  var token = utilities.splitCookie(cookies.get('token')).token;
  var role = utilities.splitCookie(cookies.get('token')).session;
  return axios.post(route+'api/notify/tutor/studentcanceled', {
    user: user
  },
  {
    headers: { Authorization: token + ";" + role }
  });
}

const Banner = memo(props => {
  const classes = props.classes;
  const estado = props.estado;
  const [estado_tuto,setEstado] = React.useState(estado);
  function confirmar() {
    //AQUI FALTA AGREGAR 
    notifier.success("La sessión ha sido confirmada", {
      position: "top-right",
      autoClose: 3000
    });
  };
  function denegar() {
    //AQUI FALTA AGREGAR 
    notifyCancelSession();
    notifier.error("Sesión cancelada", {
      position: "top-right",
      autoClose: 3000
    });
  };
  return (
    <React.Fragment>
  {/* Main featured post */}
  <Paper className={classes.mainFeaturedPost}>
{/* Increase the priority of the hero background image */}
{
  <img
  style={{ display: 'none' }}
  src="https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1334&q=80"
  alt="background"
  />
}
<div className={classes.overlay} />
<Grid container>
<Grid item md={6}>
<div className={classes.mainFeaturedPostContent}>
<Typography component="h1" variant="h3" color="inherit" gutterBottom>
Primera Tutoría
</Typography>
<Typography variant="h5" color="inherit">
El motivo de este correo es para recordarles que la 2a tutoría se llevará a cabo el día ...
</Typography>
<Link variant="subtitle1" href="#agenda">
Continuar leyendo
</Link>
<div className={classes.details}>
<Button variant="contained" color="primary" className={classes.button} onClick={confirmar}>Confirmar asistencia</Button>
<Button variant="contained" className={classes.button} onClick={denegar}>Cancelar asistencia</Button>
</div>
</div>
</Grid>
</Grid>
</Paper>
</React.Fragment >
);
});

export default Banner;