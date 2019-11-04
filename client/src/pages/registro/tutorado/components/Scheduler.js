import {Inject, ScheduleComponent, Day, 
  Week, WorkWeek, Month, Agenda, 
  EventSettingsModel, ViewDirective, ViewsDirective} from '@syncfusion/ej2-react-schedule';
import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Title from '../../../seguimiento/components/Title';

export default function Scheduler() {


const useStyles = makeStyles({
depositContext: {
flex: 1,
},
});

function generateTemas(title, endTime, startTime, id, location) {
return { title, endTime, startTime, id, location };
}

const bloques = [
{
title: "Tutoría 1",
endTime: new Date(2019, 9, 27, 10, 45),
startTime: new Date(2019, 9, 27, 10, 30),
id: 0,
location: "Cubículo 30"
},
{
title: "Tutoría 2",
endTime: new Date(2019, 9, 27, 11, 0),
startTime: new Date(2019, 9, 27, 10, 45),
id: 1,
location: "Cubículo 30"
},
{
title: "Tutoría 3",
endTime: new Date(2019, 9, 27, 11, 15),
startTime: new Date(2019, 9, 27, 11, 0),
id: 2,
location: "Cubículo 30"
}
];

const Scheduler = memo(props =>{
const classes = useStyles();
return (
<React.Fragment>
  <Title>Bloques de horario para la tutoría</Title>
  <div>
    {bloques.map(row => (
      <ScheduleComponent currentView='Day' selectedDate={new Date(2019, 9, 27)}
          data = {row}>
        <ViewsDirective>
          <ViewDirective option='Day' startHour='09:00' endHour='18:00' timeScale={{ enable: true, slotCount: 4 }}/>
        </ViewsDirective>
        <Inject services={[Day]}/>
      </ScheduleComponent>
      ))}
  </div>
</React.Fragment>
);
});

export default Scheduler;