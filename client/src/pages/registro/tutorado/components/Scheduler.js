import React from "react";
import { render } from "react-dom";
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import { makeStyles } from '@material-ui/core/styles';
import Title from '../../../seguimiento/components/Title';
import {Inject, ScheduleComponent, Day, 
    Week, WorkWeek, Month, Agenda, 
    EventSettingsModel, ViewDirective, ViewsDirective} from '@syncfusion/ej2-react-schedule';
import {appointments} from './data';
import axios from 'axios';
import {
    Scheduler,
    DayView,
    Appointments
  } from "@devexpress/dx-react-scheduler-material-ui";

class Schedule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: appointments
    };

    /*function createBlocks(title, startDay, endDay, id, location){
      return { title, startDay, endDay, id, location };
    }

    var auxHoraInicio = 9;
    var auxCount = 0;

    const appointments = [];

    for(var i = 0; i < ((19 - 9)*4); i++){
      if (auxCount == 0){
        appointments.push(createBlocks("tutoría "+i,new Date(2019, 5, 25, auxHoraInicio, 0),new Date(2019, 5, 25, auxHoraInicio, 15),i,"Cubículo 30"));
        auxCount++;
      }else if(auxCount == 1){
        appointments.push(createBlocks("tutoría "+i,new Date(2019, 5, 25, auxHoraInicio, 15),new Date(2019, 5, 25, auxHoraInicio, 30),i,"Cubículo 30"));
        auxCount++;
      }else if(auxCount == 2){
        appointments.push(createBlocks("tutoría "+i,new Date(2019, 5, 25, auxHoraInicio, 30),new Date(2019, 5, 25, auxHoraInicio, 45),i,"Cubículo 30"));
        auxCount++;
      }else{
        auxHoraInicio++;
        appointments.push(createBlocks("tutoría "+i,new Date(2019, 5, 25, (auxHoraInicio-1), 45),new Date(2019, 5, 25, auxHoraInicio, 0),i,"Cubículo 30"));
        auxCount = 0;
      }
    }*/
  }

  /*componentDidMount(){
    const script = document.createElement("script");

    script.src = "../script/schedule.js";
    script.async = true;

    document.body.appendChild(script);
  }*/
  
  render() {
    const { data } = this.state;

    return (
        <Paper>
            <Title>Bloques de tutoría</Title>
            <Scheduler data={data}>
                <ViewState currentDate="2019-06-25" />
                <DayView startDayHour={9} endDayHour={19} />
                <Appointments />
            </Scheduler>
        </Paper>
    );
  }
}

export default Schedule;