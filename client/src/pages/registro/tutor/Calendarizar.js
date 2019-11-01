import React, { Component } from 'react';
import './Calendarizar.css';
import FechaHora from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';


function Calendarizar(){

  const [state, setState] = React.useState({
    open: false,
  });

  const handleClose = () => {
    setState({ ...state, open: false });
  };
  
  return (
    <div className="Calendarizar">
      <Dialog id="dialogoCalendarizar" disableBackdropClick disableEscapeKeyDown open="true">
        <h1>Calendarizar tutoria</h1>
        <label>Fecha de tutoría: <FechaHora type="date"/> </label>
        <h2>Horario general de la tutoría</h2>
        <div className="vertical">
          <label>Inicio de la tutoría: <FechaHora type="time"/></label>
        </div>
        <div>
          <label>Fin de la tutoría: <FechaHora type="time"/></label>
        </div>
        <div> 
          <label>Tipo de tutoría: 
            <Select >
              <MenuItem value="Tutoría 1">Tutoría 1</MenuItem>
              <MenuItem value="Tutoría 2">Tutoría 2</MenuItem>
              <MenuItem value="Tutoría 3">Tutoría 3</MenuItem>
              <MenuItem value="Tutoría extraordinaria">Tutoría extraordinaria</MenuItem>
            </Select>
          </label>  
        </div>
        <div>
          <Button id="btnCancelar" variant="contained" onClick={handleClose}>Cancelar</Button>
          <Button id="btnAceptar" variant="contained">Aceptar</Button>
        </div>
      </Dialog>
    </div>
  );
}

export default Calendarizar;
