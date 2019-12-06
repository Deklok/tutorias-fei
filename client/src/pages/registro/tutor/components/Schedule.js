import React, { memo } from 'react';
import './style.css';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import FormControl from '@material-ui/core/FormControl';
import es from 'date-fns/locale/es';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import MenuItem from '@material-ui/core/MenuItem';
import { TextareaAutosize } from '@material-ui/core';
import axios from 'axios';
import Input from '@material-ui/core/Input';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Cookies from 'universal-cookie';
import utilities from '../../../../utilities';
import { notifications } from '../../../pushOneSignal';

const cors = require('cors');
const cookies = new Cookies();

const Schedule = memo(props => {
  const [tutorshipNum, setTutorshipNum] = React.useState(1);
  const [date, setDate] = React.useState(new Date());
  const [indications, setIndications] = React.useState('');
  const [place, setPlace] = React.useState('');
  const [size, setSize] = React.useState(0);
  const [title, setTitle] = React.useState("Error");
  const [message, setMessage] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDialogMain, setOpenDialogMain] = React.useState(true);
  const [idTutorship, setIdTutorship] = React.useState(0);
  var token = utilities.splitCookie(cookies.get('token')).token;
  var role = utilities.splitCookie(cookies.get('token')).session;
  var personnelNum = 0;
  var startDate = new Date('December 1, 2019 07:00:00');
  var endDate = new Date('December 1, 2019 07:00:00');
  var period = '';

  const closeDialogMain = () => {
    setOpenDialogMain(false);
  };

  const openDialogError = () => {
    setOpenDialog(true);
  };

  const closeDialogError = () => {
    setOpenDialog(false);
    setOpenDialogMain(true);
  };

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

  function calculatePeriod() {
    var dateActual = new Date();
    if (dateActual.getMonth() < 6) {
      period = dateActual.getFullYear() + "01";
    } else {
      period = dateActual.getFullYear() + "02";
    }
  }

  function calculateTime() {
    endDate.setMinutes(size * 15);
  }

  var token = utilities.splitCookie(cookies.get('token')).token;
  var role = utilities.splitCookie(cookies.get('token')).session;

  async function saveTutorialship() {
    var month = date.getMonth() + 1;
    var id = utilities.splitCookie(cookies.get('token')).id;
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/addTutorship', {
      place: place,
      tutorshipNum: tutorshipNum,
      period: period,
      status: 1,
      indications: indications,
      date: date.getFullYear() + "-" + month + "-" + date.getDate(),
      idTutor: personnelNum
      //idTutor: 'Z13011798'
    }, {
      headers: { Authorization: token + ";" + role }
    });
  }

  async function saveBlock() {
    var start = startDate.getHours() + ":" + startDate.getMinutes() + ":" + startDate.getMilliseconds();
    var end = endDate.getHours() + ":" + endDate.getMinutes() + ":" + endDate.getMilliseconds();
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/addBlock', {
      idCareer: 5, // 5 = career general
      start: start,
      end: end,
      idTutorship: idTutorship
    }, {
      headers: { Authorization: token + ";" + role }
    });
  }

  async function getPersonnelNumTutor() {
    var id = utilities.splitCookie(cookies.get('token')).id;
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getpersonnelNumTutor', {
      username: id
    }, {
      headers: { Authorization: token + ";" + role }
    });
  }

  async function getPupil() {
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getAllPupilByTutor', {
      //userName: 'Z13011798'
      personnelNum: personnelNum
    }, {
      headers: { Authorization: token + ";" + role }
    });
  }

  async function getNextTutorship() {
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getNextTutorship', {
      idTutor: personnelNum
    }, {
      headers: { Authorization: token + ";" + role }
    });
  }

  React.useEffect(() => {
    getNextTutorship()
      .then(result => {
        if (result.data[0].length) {
          setIdTutorship(result.data[0][0].idTutorship);
          setOpenDialogMain(false);
        }
        console.log(idTutorship);
      });
  }, [idTutorship]);

  getPersonnelNumTutor().then(result => {
    if (result) {
      personnelNum = result.data[0]['personnelNum'];
      notifications(result.data[0]['personnelNum'], "");
      getPupil().then(result => {
        if (result) {
          setSize(result.data[0]['size']);
        }
      }).catch(console.log);
    }
  }).catch(console.log);

  const save = () => {
    var dateActual = new Date();
    var regExp = new RegExp(/<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)/);
    if (date != "" && indications != "" && place != "") {
      if (date.getFullYear() == dateActual.getFullYear()) {
        if (!regExp.test(indications) && !regExp.test(place)) {
          calculatePeriod();
          calculateTime();

          saveTutorialship().then(result => {
            if (result) {
              setIdTutorship(result.data['insertId']);
              saveBlock().then(result => {
                console.log(result);
                if (result) {
                  setTitle("Éxito");
                  setMessage("La tutoria se ha calendarizado exitosamente.");
                  setOpenDialog(true);
                  setOpenDialogMain(false);
                }
              }).catch(console.log);
            }
          }).catch(console.log);
        } else {
          setTitle("Error en las indicaciones.");
          setMessage("Hubo un error al redactar las indicaciones.");
          openDialogError();
        }
      } else {
        setTitle("Error en el año.");
        setMessage("El año no puede ser mayor al año actual.");
        openDialogError();
      }
    } else {
      setTitle("Error.");
      setMessage("No puede haber campos vacios.");
      openDialogError();
    }
    setOpenDialogMain(false);
  }

  return (
    <div>
      <Dialog id="schedularDialog" disableBackdropClick disableEscapeKeyDown open={openDialogMain} >
      <div className="dialog">
        <h3>Calendarizar tutoria:</h3>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
          <KeyboardDatePicker
            margin="normal"
            format="dd/MM/yyyy"
            id="date-picker-inline"
            label="Fecha de tutoría (dd/mm/aaaa):"
            autoOk
            value={date}
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
              <MenuItem value={1}>Tutoría 1</MenuItem>
              <MenuItem value={2}>Tutoría 2</MenuItem>
              <MenuItem value={3}>Tutoría 3</MenuItem>
              <MenuItem value={4}>Tutoría extraordinaria</MenuItem>
            </Select>
          </FormControl>
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
          <Button id="cancelBtn" variant="contained" onClick={closeDialogMain} >Cancelar</Button>
          <Button id="acceptBtn" variant="contained" onClick={save}>Aceptar</Button>
        </div>
      </div>

    </Dialog>
     <Dialog open={openDialog}>
     <div id="dialogError">
       <DialogTitle >
         {title}
       </DialogTitle>
       <DialogContentText>
         {message}
       </DialogContentText>
       <Button id="acceptBtn" onClick={closeDialogError}>Aceptar</Button>
     </div>
   </Dialog>
    </div>
  );
});

export default Schedule;