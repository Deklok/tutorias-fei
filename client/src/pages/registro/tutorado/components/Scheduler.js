import {Inject, ScheduleComponent, Day, 
        Week, WorkWeek, Month, Agenda, 
        EventSettingsModel, ViewDirective, ViewsDirective} from '@syncfusion/ej2-react-schedule';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Title from '../../../seguimiento/components/Title';

const useStyles = makeStyles({
    depositContext: {
      flex: 1,
    },
  });

  export default function TemasTutorado() {
    const classes = useStyles();
    return (
      <React.Fragment>
        <Title>Bloques de horario para la tutoría</Title>
        <div>
            <ScheduleComponent currentView='Day' selectedDate={new Date(2019, 9, 27)}
                >
              <ViewsDirective>
                <ViewDirective option='Day' startHour='09:30' endHour='18:00' timeScale={{ enable: true, slotCount: 4 }}/>
              </ViewsDirective>
              <Inject services={[Day]}/>
            </ScheduleComponent>
        </div>
      </React.Fragment>
    );
  }