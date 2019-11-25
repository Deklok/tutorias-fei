/* eslint-disable no-script-url */

import React from 'react';
import './style.css';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextareaAutosize from 'react-textarea-autosize';

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
      <TextareaAutosize
        id = "tema"
        minRows = "3"
        maxRows = "5"
        maxLength = "500"
        className={classes.textArea}
      />
      <div>
        <Button id="cancelBtn" variant="contained" href="/dashboardinicio">Cancelar</Button>
        <Button id="acceptBtn" variant="contained" onClick={validate}>Agendar</Button>
      </div>
    </React.Fragment>
  );
}

function validate(){
  var tema = document.getElementById("tema").value;
  var validador = /^[A-Za-zÀ-ú0-9 \n _]*[A-Za-zÀ-ú0-9][A-Za-zÀ-ú0-9 \n _]*$/;
  
  if(!tema.match(validador)){
    alert("Estás usando caracteres inválidos, revisa tus datos");
  }else{
    alert("Todo bien, pasa a la siguiente pantalla");
  }
}