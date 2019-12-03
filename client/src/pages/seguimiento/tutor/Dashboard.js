import React, { memo } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Agenda from '../components/Agenda';
import Tutorados from './components/Tutorados';
import TemasTutorado from '../components/TemasTutorado';
import Feedback from './components/Feedback';
import CurrentTutorado from './components/CurrentTutorado';
import NextTutorado from './components/NextTutorado';
import BlockRegistry from '../../registro/tutor/BlocksRegistry';
import SideBar from './components/SideBar';
import NavBar from './components/NavBar';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Main from './components/Main';
import Cookies from 'universal-cookie';
import utilities from '../../../utilities';
import { notifications } from '../../pushOneSignal';

const cookies = new Cookies();
var cookie = cookies.get('token');
var token, role, username;
if (cookie) {
  token = utilities.splitCookie(cookie).token;
  role = utilities.splitCookie(cookie).session;
  username = utilities.splitCookie(cookie).id;
}

function cargarDatos(connect) {
  if(connect){
    return axios.post('http://localhost:5000/api/db/tutorData', {
      username: username,
    },{
      headers: { Authorization: token + ";" + role }
    });
  }else{
    return null;
  }
}

function cargarTutorados(connect) {
  if (connect){
    return axios.post('http://localhost:5000/api/db/sessions', {
      idTutorship: 1,
    },{
      headers: { Authorization: token + ";" + role }
    });
  }else{
    return null;
  }
}

const Dashboard = memo(props => {
  const classes = props.classes;
  const [open, setOpen] = React.useState(true);
  const [nombre, setNombre] = React.useState('');
  const [contacto, setContacto] = React.useState('');
  const [tutorados, setTutorados] = React.useState('');
  const [connect, setConnect] = React.useState(true);
  const [comenzado, setComenzado] = React.useState(false);
  const [personnelNum, setPersonnel] = React.useState(0);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  React.useEffect(()=>{
    cargarDatos(connect)
    .then(result => {
      if(result){
        setNombre(result.data[0]['name']);
        setContacto(result.data[0]['contact']);
        notifications(result.data[0]['personnelNum'], "");
        setPersonnel(result.data[0]['personnelNum']);
      }
    }).then(()=>{
      cargarTutorados(connect)
        .then(result=>{
          if(result){
            setTutorados(result.data[0]);
            setConnect(false);
          }
        })
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
      <NavBar
        open = {open}
        handleDrawerOpen = {handleDrawerOpen}
        classes = {classes}
        nombre = {nombre}
        contacto = {contacto}
      />
      <SideBar
          open = {open}
          handleDrawerClose = {handleDrawerClose}
          classes = {classes}
      />
      <Switch>
        <Route exact path="/tutor">
          <Main
            classes={classes}
            test={test}
            tutorados={tutorados}
            setTutorados={setTutorados}
            comenzado={comenzado}
            tutor={personnelNum}
            setComenzado = {setComenzado}
          />
        </Route>
        <Route path="/tutor/feedback">
          <Feedback
          classes={classes}
          tutor={personnelNum}
          />
        </Route>
        <Route path="/tutor/registro-bloques">
            <BlockRegistry
                classes={classes}
                registryBlockClasses={props.registryBlockClasses}
            />
        </Route>
      </Switch>
    </div>
  );
});

export default Dashboard;
