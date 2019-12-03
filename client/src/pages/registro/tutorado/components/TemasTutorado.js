/* eslint-disable no-script-url */

import React, {memo} from 'react';
import './style.css';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import axios from 'axios';

const TemasTutorado = memo(props => {
  const [idSession, setIdSession] = React.useState('');

  async function obtenerSesion(){
    return axios.post('http://localhost:5000/api/db/getSpecificSessionData',{
      idPupil: 'S16011721'
    });
  }

  obtenerSesion()
    .then(result => {
      setIdSession(result.data[0][0]['idSession']);
    }).catch(console.log);

  async function cancelarReserva(){
    return axios.post('http://localhost:5000/api/db/deleteSession',{
      idSession: idSession
    });
  }

  async function agendarSession(topics){
    return axios.post('http://localhost:5000/api/db/addSession',{
      idSession: idSession,
      topics: topics
    });
  }

  return (
    <React.Fragment>
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
    window.location="/tutorado/sesiones";
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
        window.location="/tutorado";
      }
    } else {
      tema = " ";
      agendarSession(tema);
      window.location="/tutorado";
    }
  }
});

export default TemasTutorado;