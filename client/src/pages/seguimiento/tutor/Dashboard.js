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

const Dashboard = memo(props => {
  const classes = props.classes;
  const [open, setOpen] = React.useState(true);
  const [nombre, setNombre] = React.useState('');
  const [contacto, setContacto] = React.useState('');
  const [tutorados, setTutorados] = React.useState('');
  const [connect, setConnect] = React.useState(true);
  const [comenzado, setComenzado] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  async function cargarDatos() {
    if(connect){
      return axios.post('http://localhost:5000/api/db/tutorData', {
        personnelNum: 'Z13011798',
      });
    }else{
      return null;
    }
  }

  async function cargarTutorados() {
    if (connect){
      return axios.post('http://localhost:5000/api/db/sessions', {
        idTutorship: 1,
      });
    }else{
      return null;
    }
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
      if(result){
        setNombre(result.data[0]['name']);
        setContacto(result.data[0]['contact']);
        setConnect(false);
      }
    }).catch(console.log);

    cargarTutorados()
    .then(result=>{
      if(result){
        setTutorados(result.data[0]);
        setConnect(false);
      }
    }).catch(console.log);

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
            setComenzado = {setComenzado}
          />
        </Route>
        <Route path="/tutor/feedback">
          <Feedback
          classes={classes}
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
