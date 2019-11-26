/* eslint-disable no-script-url */

import React from 'react';
import './style.css';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
  textArea: {
    width: '100%',
  }
});

function generateTemas(tema) {
  return { tema };
}

const temas = [
  generateTemas('Ver formas de titulación'),
];

export default function TemasTutorado() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Intereses del Tutorado
      </Typography>
      <Input
        multiline
        fullWidth
        rows = "6"
      />
      <div>
        <Button id="returnBtn" variant="contained" href="/dashboard-inicio">Cancelar</Button>
        <Button id="agendBtn" variant="contained" onClick={validate}>Agendar</Button>
      </div>
    </React.Fragment>
  );
}

function validate(){
  var tema = document.getElementById("tema").value;
  var validador = /^[A-Za-zÀ-ú0-9 \n _]*[A-Za-zÀ-ú0-9][A-Za-zÀ-ú0-9 \n _]*$/;
  
  if (tema.trim().length != 0){
    if(!tema.match(validador)){
      alert("Estás usando caracteres inválidos, revisa tus datos");
    }else{
      alert("Todo bien, pasa a la siguiente pantalla");
    }
  }
}