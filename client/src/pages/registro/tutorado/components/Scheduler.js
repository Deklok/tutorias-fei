import React from "react";
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import Title from '../../../seguimiento/components/Title';
import {appointments} from './data';
import es from 'date-fns/locale/es';
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
    }
  }
  
  render() {
    const { data } = this.state;

    return (
        <Paper>
            <Title>Bloques de tutoría</Title>
            <Scheduler data={data}>
                <ViewState currentDate="2019-06-25" locale={es} />
                <DayView startDayHour={9} endDayHour={19} />
                <Appointments />
            </Scheduler>
        </Paper>
    );
  }
}

export default Schedule;
