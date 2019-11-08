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