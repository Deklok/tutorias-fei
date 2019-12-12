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
import { notifications, initNotifications } from '../../pushOneSignal';

const cookies = new Cookies();
var cookie = cookies.get('token');
var token, role, username;
if (cookie) {
  token = utilities.splitCookie(cookie).token;
  role = utilities.splitCookie(cookie).session;
  username = utilities.splitCookie(cookie).id;
}

function cargarDatos() {
  return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/tutorData', {
      username: username,
    },{
      headers: { Authorization: token + ";" + role }
    });
}

function cargarTutorados(connect) {
  if (connect){
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/sessions', {
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
  const [contacto, setContacto] = React.useState(' ');
  const [tutorados, setTutorados] = React.useState('');
  const [connect, setConnect] = React.useState(true);
  const [comenzado, setComenzado] = React.useState(false);
  const [personnelNum, setPersonnel] = React.useState(0);
  const [idTutorship, setTutorship]=React.useState(0);
  const [indications, setIndications]=React.useState('');
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  async function getNextTutorship(){
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getNextTutorship', {
      idTutor: personnelNum
    },{
      headers: { Authorization: token + ";" + role }
    });
  }

  React.useEffect(()=>{
    cargarDatos()
    .then(result => {
      if(result){
        setNombre(result.data[0]['name']);
        setContacto(result.data[0]['contact']);
        notifications(result.data[0]['username'], "");
        setPersonnel(result.data[0]['personnelNum']);
      }
    }).then(()=>{
      getNextTutorship()
      .then((result)=>{
        if(result.data[0].length){
          var tutorship_aux = result.data[0][0].idTutorship;
          setTutorship(tutorship_aux);
          setIndications(result.data[0][0].indications);
          console.log(indications);
        }
      });
      cargarTutorados(connect)
        .then(result=>{
          if(result){
            setTutorados(result.data[0]);
            setConnect(false);
          }
        })
    }).catch(console.log);
  },[idTutorship]);
  React.useEffect(()=>{
    initNotifications();
  }, []);

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
          idTutor = {personnelNum}
          idTutorship = {idTutorship}
          contacto = {contacto}
      />
      <Switch>
        <Route exact path="/tutor">
          <Main
            classes={classes}
            tutorados={tutorados}
            setTutorados={setTutorados}
            comenzado={comenzado}
            tutor={personnelNum}
            setComenzado = {setComenzado}
            idTutorship = {idTutorship}
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
