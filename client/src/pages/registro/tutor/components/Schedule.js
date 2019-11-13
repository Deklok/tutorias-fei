import React from 'react';
import './style.css';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import FormControl from '@material-ui/core/FormControl';
import es from 'date-fns/locale/es';
import { MuiPickersUtilsProvider, KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import MenuItem from '@material-ui/core/MenuItem';
import { TextareaAutosize } from '@material-ui/core';
import axios from 'axios';
import Input from '@material-ui/core/Input';

export default function Schedule() {
  const [open, setOpen] = React.useState(true);
  const [tutorshipNum, setTutorshipNum] = React.useState('tutorial1');
  const [date, setDate] = React.useState(new Date());
  const [indications, setIndications] = React.useState('');
  const [place, setPlace] = React.useState('');
  const [email, setEmail] = React.useState('');

  const tutorshipNumChange = event => {
    setTutorshipNum(event.target.value);
  };

  const dateChange = date => {
    setDate(date);
  };

  const indicationsChange = event => {
    setIndications(event.target.value);
  };

  const placeChange = event => {
    setPlace(event.target.value);
  };

  const emailChange = event =>{
    setEmail(event.target.value);
  }

  async function saveTutorialship() {
    return axios.post('http://localhost:5000/setTutorship', {
      //place
      //tutorshipNum
    });
  }

  const validate = () => {
    var dateActual = new Date();
    var regExp = new RegExp(/<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)/);
    var regExpEmail = new RegExp(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i);

    if (date != "" &&  indications != "" && place != "" && email != "") {
      if (date.getFullYear() == dateActual.getFullYear()) {
        if (!regExp.test(indications) && !regExp.test(place)) {
          if(regExpEmail.test(email)){
            alert("Exito");
          }else{
            alert("Correo electronico con formato invalido.");
          }
        } else {
          alert("Hubo un error al redactar las indicaciones.");
        }
      } else {
        alert("El año no puede ser mayor al año actual");
      }
    } else {
      alert("No puede haber valores nulos");
    }
  }

  return (
    <Dialog id="schedularDialog" disableBackdropClick disableEscapeKeyDown open={open}>
      <div className="dialog">
        <h3>Calendarizar tutoria:</h3>
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
        </MuiPickersUtilsProvider>
        <div>
          <FormControl>
            <h3>Tipo de tutoría:</h3>
            <Select
              id="demo-customized-select-native"
              label="Tipo de tutoría:"
              value={tutorshipNum}
              onChange={tutorshipNumChange}>
              <MenuItem value={'tutorial1'}>Tutoría 1</MenuItem>
              <MenuItem value={'tutorial2'}>Tutoría 2</MenuItem>
              <MenuItem value={'tutorial3'}>Tutoría 3</MenuItem>
              <MenuItem value={'tutorialExtraordinary'}>Tutoría extraordinaria</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div>
          <h3>Correo de contacto:</h3>
          <Input
            placeholder="jorge@gmail.com"
            maxLength={60}
            onChange={event => emailChange(event)}
          />
        </div>
        <div>
          <h3>Lugar:</h3>
          <Input
            placeholder="Aula 103"
            maxLength={30}
            onChange={event => placeChange(event)}
          />
        </div>
        <div>
          <h3>Indicaciones:</h3>
          <TextareaAutosize
            rows={4}
            rowsMax={10}
            cols={25}
            maxLength={600}
            onChange={event => indicationsChange(event)} />
        </div>
        <div>
          <Button id="acceptBtn" variant="contained" onClick={validate}>Aceptar</Button>
        </div>
      </div>
    </Dialog>
  );
}
