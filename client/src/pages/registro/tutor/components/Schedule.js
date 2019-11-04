import React from 'react';
import './style.css';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import FormControl from '@material-ui/core/FormControl';

import es from 'date-fns/locale/es';
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns/';


export default function Schedule() {
  const [typeTutorial, setAge] = React.useState('');

  const [selectedDate, setSelectedDate] = React.useState();


  const handleChange = event => {
    setAge(event.target.value);
  };

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  return (
    <div className="Schedule">
      <Dialog id="schedularDialog" disableBackdropClick disableEscapeKeyDown open="true">
        <h1>Calendarizar tutoria</h1>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
          <KeyboardDatePicker
            margin="normal"
            format="dd/MM/yyyy"
            id="date-picker-inline"
            label="Fecha de tutoría (dd/mm/aaaa):"
            autoOk="true"
            disablePast="false"
            value={selectedDate}
            onChange={handleDateChange}
            cancelLabel="Cancelar"
            okLabel="Aceptar"
            invalidDateMessage="Formato de la fecha invalida."
            minDateMessage="No puedes ingresar una fecha menor a la fecha actual."
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <h2>Horario general de la tutoría</h2>
          <KeyboardTimePicker
            margin="normal"
            id="time-picker"
            label="Hora de inicio:"
            cancelLabel="Cancelar"vve
            okLabel="Aceptar"
            ampm={false}
            value={selectedDate}
            onChange={handleDateChange}
            invalidDateMessage="Formato de hora invalida."
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
          />
        </MuiPickersUtilsProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardTimePicker
            margin="normal"
            id="time-picker"
            label="Hola de Fin:"
            cancelLabel="Cancelar"
            okLabel="Aceptar"
            ampm={false}
            value={selectedDate}
            onChange={handleDateChange}
            invalidDateMessage="Formato de hora invalida."
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
          />
        </MuiPickersUtilsProvider>
        <FormControl>
          <h3>Tipo de tutoría:</h3>
          <Select
            id="demo-customized-select-native"
            label="Tipo de tutoría:"
            value={typeTutorial}
            onChange={handleChange}>
            <option value={'tutorial1'}>Tutoría 1</option>
            <option value={'tutorial2'}>Tutoría 2</option>
            <option value={'tutorial3'}>Tutoría 3</option>
            <option value={'tutorialExtraordinary'}>Tutoría extraordinaria</option>
          </Select>
        </FormControl>
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

