/* eslint-disable no-script-url */

import React, {memo} from 'react';
import './style.css';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import axios from 'axios';

const TemasTutorado = memo(props => {
  const useStyles = makeStyles({
    depositContext: {
      flex: 1,
    },
    textArea: {
      width: '100%',
    }
  });

  const idSession = 3;

  async function cancelarReserva(idSession){
    return axios.post('http://localhost:5000/api/db/deleteSession',{
      idSession: idSession
    });
  }

  async function agendarSession(idSession, topics){
    return axios.post('http://localhost:5000/api/db/addSession',{
      idSession: idSession,
      topics: topics
    });
  }

  function generateTemas(tema) {
    return { tema };
  }

  const temas = [
    generateTemas('Ver formas de titulación'),
  ];

  const classes = useStyles();
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
    alert("Entra");
    cancelarReserva(idSession);
    window.location="/dashboard-inicio";
  }

  function validate(){
    var tema = document.getElementById("tema").value;
    var validador = /^[A-Za-zÀ-ú0-9 \n _]*[A-Za-zÀ-ú0-9][A-Za-zÀ-ú0-9 \n _]*$/;
    
    if (tema.trim().length != 0){
      if(!tema.match(validador)){
        alert("Estás usando caracteres inválidos, revisa tus datos");
      }else{
        agendarSession(idSession, tema);
      }
    }
  }
});

export default TemasTutorado;