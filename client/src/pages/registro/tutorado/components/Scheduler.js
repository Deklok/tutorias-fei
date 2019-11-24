import React, {memo} from "react";
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import Title from '../../../seguimiento/components/Title';
import {appointments} from './data';
import axios from 'axios';
import {
    Scheduler,
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

    var inicio = start.split(":");
    var auxinicio = parseInt(inicio[0],10);
    var fin = end.split(":");
    var auxfin = parseInt(fin[0],10);
    console.log(start);
    var tiempo = (auxfin - auxinicio) * 4;

    var tiempo = (bloque[0]['endDayHour'] - bloque[0]['startDayHour']) * 4;
    var aux = 0;
    var inicio = bloque[0]['startDayHour'];

    for(var i = 1; i <= tiempo; i++){
      if (aux == 0) {
        aux = 1;
        rows.push(createBlock(i,"Tutoría "+i,new Date(2019, 5, 25, inicio, 0),new Date(2019, 5, 25, inicio, 15),"Cubículo 30"));
      } else if (aux == 1) {
        aux = 2;
        rows.push(createBlock(i,"Tutoría "+i,new Date(2019, 5, 25, inicio, 15),new Date(2019, 5, 25, inicio, 30),"Cubículo 30"));
      } else if (aux == 2) {
        aux = 3;
        rows.push(createBlock(i,"Tutoría "+i,new Date(2019, 5, 25, inicio, 30),new Date(2019, 5, 25, inicio, 45),"Cubículo 30"));
      } else {
        aux = 0;
        inicio = inicio + 1;
        rows.push(createBlock(i,"Tutoría "+i,new Date(2019, 5, 25, inicio - 1, 45),new Date(2019, 5, 25, inicio, 0),"Cubículo 30"));
      }
    }

    return (
        <Paper>
            <Title>Bloques de tutoría</Title>
            <Scheduler data={rows}>
                <ViewState currentDate={bloque[0]['currentDate']} />
                <DayView startDayHour={bloque[0]['startDayHour']} endDayHour={bloque[0]['endDayHour']} />
                <Appointments />
            </Scheduler>
        </Paper>
    );
});

export default Schedule;
