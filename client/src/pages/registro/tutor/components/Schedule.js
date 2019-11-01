import React, { Component } from 'react';
import './style.css';
import Time from '@material-ui/core/TextField';
import Date from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import FormControl from '@material-ui/core/FormControl';

export default function Schedule(params) {
  const [typeTutorial, setAge] = React.useState('');
  const handleChange = event => {
    setAge(event.target.value);
  };

    return (
      <div className="Schedule">
        <Dialog id="schedularDialog" disableBackdropClick disableEscapeKeyDown open="true">
          <h1>Calendarizar tutoria</h1>
          <label>Fecha de tutoría: <Date type="date" name="dateTutorial"/> </label>
          <h2>Horario general de la tutoría</h2>
          <div >
            <label>Inicio de la tutoría: 
              <Time type="time" name="startTime" defaultValue="07:00"/>
            </label>
          </div>
          <div>
            <label>Fin de la tutoría: 
              <Time type="time" name="endTime" defaultValue="08:00"/>
            </label>
          </div>
          <div> 
            <label>Tipo de tutoría: 
            <FormControl>
              <Select
                id="demo-customized-select-native"
                value={typeTutorial}
                onChange={handleChange}>
                <option value={'tutorial1'}>Tutoría 1</option>
                <option value={'tutorial2'}>Tutoría 2</option>
                <option value={'tutorial3'}>Tutoría 3</option>
                <option value={'tutorialExtraordinary'}>Tutoría extraordinaria</option>
              </Select>
            </FormControl>
            </label>  
          </div>
          <div>
              <Button id="cancelBtn" variant="contained">Cancelar</Button>
              <Button id="acceptBtn" variant="contained" onClick={validate}>Aceptar</Button>
          </div>
        </Dialog>
      </div>
    );
  }

function validate() {
  alert()
}

