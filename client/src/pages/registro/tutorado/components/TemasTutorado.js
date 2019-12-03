/* eslint-disable no-script-url */

import React, {memo} from 'react';
import './style.css';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import utilities from '../../../../utilities';

const TemasTutorado = memo(props => {
  const [idSession, setIdSession] = React.useState('');
  const [mainTutorado, setRouteMainTutorado] = React.useState(false);
  const [sessionsTutorado, setRouteSessionsTutorado] = React.useState(false);

  const redirectToMainTutorado = () => {
    setRouteMainTutorado(true);
    setRouteSessionsTutorado(false);
  }
  
  const redirectToSessionsTutorado = () => {
    setRouteMainTutorado(false);
    setRouteSessionsTutorado(true);
  }

  const cookies = new Cookies();
  var cookie = cookies.get('token');
  var username;
  if (cookie) {
    username = utilities.splitCookie(cookie).id;
  }

  async function obtenerSesion(){
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getSpecificSessionData',{
      idPupil: username
    });
  }

  obtenerSesion()
    .then(result => {
      setIdSession(result.data[0][0]['idSession']);
    }).catch(console.log);

  async function cancelarReserva(){
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/deleteSession',{
      idSession: idSession
    });
  }

  async function agendarSession(topics){
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/addSession',{
      idSession: idSession,
      topics: topics
    });
  }
console.log(idSession);
  return (
    <React.Fragment>
      {mainTutorado && <Redirect to="/tutorado"/>}
      {sessionsTutorado && <Redirect to="/tutorado/sesiones"/>}
      <Typography variant="h6" gutterBottom>
        Intereses del Tutorado
      </Typography>
      <Input
        id="tema"
        multiline
        fullWidth
        rows = "6"
      />
      <div>
        <Button id="returnBtn" variant="contained" onClick={deleteSession}>Cancelar</Button>
        <Button id="agendBtn" variant="contained" onClick={validate}>Agendar</Button>
      </div>
    </React.Fragment>
  );
  function deleteSession(){
    cancelarReserva();
    redirectToSessionsTutorado();
  }

  function validate(){
    var tema = document.getElementById("tema").value;
    var validador = /^[A-Za-zÀ-ú0-9 \n _]*[A-Za-zÀ-ú0-9][A-Za-zÀ-ú0-9 \n _]*$/;
    var validador2 = /<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)/;
    
    if (tema.trim().length != 0){
      if(!tema.match(validador)){
        alert("Estás usando caracteres inválidos, revisa tus datos");
      }else{
        agendarSession(tema.trim());
        console.log(username);
        redirectToMainTutorado();
      }
    } else {
      tema = " ";
      agendarSession(tema);
      redirectToMainTutorado();
    }
  }
});

export default TemasTutorado;