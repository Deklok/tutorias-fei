import React from 'react';
import './style.css';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import FormControl from '@material-ui/core/FormControl';

import 'date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

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
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Fecha de tutoría:"
                  autoOk = "true"
                  disablePast = "false"
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
                <h2>Horario general de la tutoría</h2>
                <KeyboardTimePicker
                    margin="normal"
                    id="time-picker"
                    label="Hora de inicio:"
                    cancelLabel = "Cancelar"
                    okLabel = "Aceptar"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
                <KeyboardTimePicker
                    margin="normal"
                    id="time-picker"
                    label="Hola de Fin:"
                    cancelLabel = "Cancelar"
                    okLabel = "Aceptar"
                    value={selectedDate}
                    onChange={handleDateChange}
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

