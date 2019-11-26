import React, {memo} from "react";
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Inject, ScheduleComponent, Day,
  Week, WorkWeek, Month, Agenda,
  EventSettingsModel, ViewDirective, ViewsDirective
} from '@syncfusion/ej2-react-schedule';
import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Title from '../../../seguimiento/components/Title';
import {datos} from './dataSession';
import {appointments} from './data';
import axios from 'axios';
import {
  //Scheduler2,
  DayView,
  Appointments
} from "@devexpress/dx-react-scheduler-material-ui";

const Schedule = memo(props => {
  const classes = props.classes;
  const [open, setOpen] = React.useState(true);
  const [start, setStart] = React.useState('');
  const [end, setEnd] = React.useState('');

  async function cargarDatos() {
    return axios.post('http://localhost:5000/api/db/getBlock', {
      idCareer: 1,
      idTutorship: 4
    });
  }

  cargarDatos()
    .then(result => {
      console.log(result);
      setStart(result.data[0][0]['start']);
      setEnd(result.data[0][0]['end']);
    }).catch(console.log);

    function createBlock(id, title, startDate, endDate, location){
      return { id, title, startDate, endDate, location };
    }

    var bloque = appointments;
    const rows = [];

    /*Crear bloque desde "datos de la base". Se supone que se obtienen datos del bloque
    desde la BD, se obtiene el inicio y fin del bloque con el formato "HH:MM:SS"
    */ 
    var blockInicio = bloque[0]['blockStart'].split(":");
    var auxinicio = parseInt(blockInicio[0],10);
    var fin = bloque[0]['blockEnd'].split(":");
    var auxfin = parseInt(fin[0],10);
    var tiempo = (auxfin - auxinicio) * 4;

    /*Validar alguna sesion con los bloques que se van a colocar. Se obtiene de la BD información
    de alguna session, en el caso de que ya se haya escogido una sesión. Se valida solo la hora de inicio
    de la session bajo el formato "YYYY-MM-DD HH:MM:SS"
    */

    function createSession(horas, minutos) {
      return { horas, minutos };
    }

    var sesiones = datos;
    const horasMin = [];

    for (var i = 0; i < sesiones.length; i++){
      var sessionInicio = sesiones[i]['sessionStart'].split(" ");
      var sessionHoraInicio = sessionInicio[1].split(":");
      var horaAux = parseInt(sessionHoraInicio[0],10);
      var minAux = parseInt(sessionHoraInicio[1],10);
      horasMin.push(createSession(horaAux,minAux));
    }

    console.log(horasMin.length);

    var aux = 0;
    var inicio = auxinicio;
    var count = 0;

    for(var i = 1; i <= tiempo; i++){
      if (aux === 0) {
        aux = 1;
        count = 0;
        var valido = false;
        for (var j = 0; j < horasMin.length; j++){
          if (horasMin[j]['horas'] === inicio && horasMin[j]['minutos'] === 0){
            valido = true;
          }
        }
        if (valido === false){
          rows.push(createBlock(i,"Tutoría "+i,new Date(2019, 5, 25, inicio, 0),new Date(2019, 5, 25, inicio, 15),"Cubículo 30"));
        }
      } else if (aux === 1) {
        aux = 2;
        count = 0;
        var valido = false;
        for (var j = 0; j < horasMin.length; j++){
          if (horasMin[j]['horas'] === inicio && horasMin[j]['minutos'] === 15){
            valido = true;
          }
        }
        if (valido === false){
          rows.push(createBlock(i,"Tutoría "+i,new Date(2019, 5, 25, inicio, 15),new Date(2019, 5, 25, inicio, 30),"Cubículo 30"));
        }
      } else if (aux === 2) {
        aux = 3;
        count = 0;
        var valido = false;
        for (var j = 0; j < horasMin.length; j++){
          if (horasMin[j]['horas'] === inicio && horasMin[j]['minutos'] === 30){
            valido = true;
          }
        }
        if (valido === false){
          rows.push(createBlock(i,"Tutoría "+i,new Date(2019, 5, 25, inicio, 30),new Date(2019, 5, 25, inicio, 45),"Cubículo 30"));
        }
      } else {
        aux = 0;
        count = 0;
        inicio = inicio + 1;
        var valido = false;
        for (var j = 0; j < horasMin.length; j++){
          if (horasMin[j]['horas'] === (inicio - 1) && horasMin[j]['minutos'] === 45){
            valido = true;
          }
        }
        if (valido === false){
          rows.push(createBlock(i,"Tutoría "+i,new Date(2019, 5, 25, inicio - 1, 45),new Date(2019, 5, 25, inicio, 0),"Cubículo 30"));
        }
      }
    }

    return (
        <Paper>
            <Title>Bloques de tutoría</Title>
            <Scheduler data={rows}>
                <ViewState currentDate={bloque[0]['currentDate']} />
                <DayView startDayHour={auxinicio} endDayHour={auxfin} />
                <Appointments />
            </Scheduler>
        </Paper>
    );
});

export default Schedule;
