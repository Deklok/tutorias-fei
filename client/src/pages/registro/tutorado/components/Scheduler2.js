import {Inject, ScheduleComponent, Day, 
  Week, WorkWeek, Month, Agenda, 
  EventSettingsModel, ViewDirective, ViewsDirective} from '@syncfusion/ej2-react-schedule';
import React, {memo} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Title from '../../../seguimiento/components/Title';

const Scheduler = memo(props => {
  
  /**function createData(title, startTime, endTime, id, location) {

    return { title, startTime, endTime, id, location };

  }*/

  function componentDidMount(){
    const script = document.createElement("script");

    script.src = "../script/schedule.js";
    script.async = true;

    document.body.appendChild(script);
  }

  /*var section = props.sections;
  const rows = [];

  for (var i = 0; i < section.length; i++) {

    rows.push(createData( section[i]['title'], section[i]['startTime'], section[i]['endTime'], section[i]['id'], section[i]['location']));

  }*/

  const useStyles = makeStyles(theme => ({
    seeMore: {
        marginTop: theme.spacing(3),
    },
    depositContext: {
      flex: 1,
    },
  }));

  /*const bloques = [
    {
    title: "Tutoría 1",
    startTime: new Date(2019, 9, 27, 10, 30),
    endTime: new Date(2019, 9, 27, 10, 45),
    id: 0,
    location: "Cubículo 30"
    },
    {
    title: "Tutoría 2",
    startTime: new Date(2019, 9, 27, 10, 45),
    endTime: new Date(2019, 9, 27, 11, 0),
    id: 1,
    location: "Cubículo 30"
    },
    {
    title: "Tutoría 3",
    startTime: new Date(2019, 9, 27, 11, 0),
    endTime: new Date(2019, 9, 27, 11, 15),
    id: 2,
    location: "Cubículo 30"
    }
  ];*/

  return (
    <React.Fragment>
      <Title>Bloques de horario para la tutoría</Title>
      <div>
            <ScheduleComponent id="schedule" currentView='Day' selectedDate={new Date(2019, 9, 27)}
                >
              <ViewsDirective>
                <ViewDirective option='Day' startHour="9:00" endHour="19:00" timeScale={{ enable: true, slotCount: 4 }}/>
              </ViewsDirective>
              <Inject services={[Day]}/>
            </ScheduleComponent>
      </div>
    </React.Fragment>
  );
});

export default Scheduler;