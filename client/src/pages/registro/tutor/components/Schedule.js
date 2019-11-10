import React from 'react';
import './style.css';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import FormControl from '@material-ui/core/FormControl';
import AccessTime from "@material-ui/icons/AccessTime";

import es from 'date-fns/locale/es';
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import MenuItem from '@material-ui/core/MenuItem';


export default function Schedule() {
  const [typeTutorial, setTypeTutorial] = React.useState('tutorial1');
  const [date, setDate] = React.useState(new Date());
  const [startTime, setStartTime] = React.useState(new Date("2019-01-01T07:00:00"));
  const [endTime, setEndTime] = React.useState(new Date("2019-01-01T08:00:00"));

  const typeTutorialChange = event => {
    setTypeTutorial(event.target.value);
  };

  const dateChange = date => {
    setDate(date);
  };

  const startTimeChange = time => {
    setStartTime(time);
  };

  const endTimeChange = time => {
    setEndTime(time);
  };

  const validate = () => {
    var dateActual = new Date();
    if (date == "" || startTime == "" || endTime == "") {
      if (date.getFullYear() == dateActual.getFullYear()) {
        if (endTime > startTime) {
          if (typeTutorial != "") {
            if (startTime.getHours() >= 7) {
              if (endTime.getHours() < 22) {

              } else {
                //Aqui va un mensaje diciendo que la hora de fin debe ser menor a las 22:00 hrs.
                alert("La hora de fin debe ser menor a las 22:00 hrs.");
              }
            } else {
              //Aqui va un mensaje diciendo que la hora de inicio debe ser mayor a las 7:00 hrs.
              alert("La hora de inicio debe ser mayor a las 7:00 hrs.");
            }
          } else {
            //Aqui va un mensaje diciendo que se debe seleccionar un tipo de tutoria.
            alert("Se debe seleccionar un tipo de tutoria.");
          }
        } else {
          //Aqui va un mensaje diciendo que la hora de fin no puede ser menor a la hora de inicio.
          alert("La hora de fin no puede ser menor a la hora de inicio.");
        }
      } else {
        //Aqui va un mensaje diciendo que el año no puede ser mayor al actual.
        alert("El año no puede ser mayor al año actual");
      }
    } else {
      //Aqui va un mensaje diciendo que no puede haber valores nulos.
      alert("No puede haber valores nulos");
    }
  }

  return (
    <Dialog id="schedularDialog" disableBackdropClick disableEscapeKeyDown open="true">
      <div className="dialog">
        <h1>Calendarizar tutoria</h1>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
          <KeyboardDatePicker
            margin="normal"
            format="dd/MM/yyyy"
            id="date-picker-inline"
            label="Fecha de tutoría (dd/mm/aaaa):"
            autoOk="true"
            disablePast="false"
            onChange={event => dateChange(event)}
            cancelLabel="Cancelar"
            okLabel="Aceptar"
            invalidDateMessage="Formato de la fecha invalida."
            minDateMessage="No puedes ingresar una fecha menor a la fecha actual."
            maxDateMessage="No puedes ingresar una fecha muy lejana."
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <h2>Horario general de la tutoría</h2>
          <KeyboardTimePicker
            margin="normal"
            id="time-picker"
            label="Hora de inicio (24hrs):"
            cancelLabel="Cancelar"
            okLabel="Aceptar"
            keyboardIcon={<AccessTime />}
            ampm={false}
            value={startTime}
            onChange={event => startTimeChange(event)}
            invalidDateMessage="Formato de hora invalida."
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
          />
          <div>
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              label="Hora de Fin (24hrs):"
              cancelLabel="Cancelar"
              okLabel="Aceptar"
              keyboardIcon={<AccessTime />}
              ampm={false}
              value={endTime}
              onChange={event => endTimeChange(event)}
              invalidDateMessage="Formato de hora invalida."
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
          </div>
        </MuiPickersUtilsProvider>
        <FormControl>
          <h3>Tipo de tutoría:</h3>
          <Select
            id="demo-customized-select-native"
            label="Tipo de tutoría:"
            value={typeTutorial}
            onChange={typeTutorialChange}>
            <MenuItem value={'tutorial1'}>Tutoría 1</MenuItem>
            <MenuItem value={'tutorial2'}>Tutoría 2</MenuItem>
            <MenuItem value={'tutorial3'}>Tutoría 3</MenuItem>
            <MenuItem value={'tutorialExtraordinary'}>Tutoría extraordinaria</MenuItem>
          </Select>
        </FormControl>
        <div>
          <Button id="acceptBtn" variant="contained" onClick={validate}>Aceptar</Button>
        </div>
      </div>
    </Dialog>
  );
}
