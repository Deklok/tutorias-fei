import React, {memo} from "react";
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import Title from '../../../seguimiento/components/Title';
import axios from 'axios';
import {
    Scheduler,
    DayView,
    Appointments
  } from "@devexpress/dx-react-scheduler-material-ui";
import { StepConnector } from "@material-ui/core";
import { invalid } from "moment";

const Schedule = memo(props => {
  const classes = props.classes;
  const inicioBloque = props.inicioBloque;
  const finBloque = props.finBloque;
  const bloque = props.bloque;
  const lugar = props.lugar;
  const fecha = props.fecha;
  const indicacion = props.indicacion;
  const matricula = props.matricula;
  const [open, setOpen] = React.useState(true);
  const [sessions, setSessions] = React.useState('');

  async function getSessions() {
    return axios.post('http://localhost:5000/api/db/getBlockSessions', {
      idBlock: 10
    });
  }

  if(fecha.length > 1){
    var fechaDate = new Date(fecha);
    var anioB = fecha.split("-")[0];
    var mesB = fecha.split("-")[1];
    var diaB = fecha.split("-")[2];
  }

  if(lugar.length > 1){
    var lugarBloque = lugar;
  }

  React.useEffect(() => {
    getSessions()
      .then(result => {
      if(result.status === 200){
        setSessions(result.data);
      }
    }).catch(console.log);
  },[]);
  
  var dataSession = [];

  if(sessions.length > 1){
    for(var i = 0; i < sessions.length; i++){
      var da = new Date(sessions[i]['startTime']);
      if(da > 0){
        dataSession.push(createSession(da.getHours(),da.getMinutes()));
      }
    }
  }
  
  if(inicioBloque.length > 1){
    var inicioHora = inicioBloque.split(":")[0];
    var inicioMin = inicioBloque.split(":")[1];
  }
  if(finBloque.length > 1){
    var finHora = finBloque.split(":")[0];
    var finMin = finBloque.split(":")[1];
  }

    async function reservarSesion(matricula, idBlock, iniH, iniM, finH, finM){
      return axios.post('http://localhost:5000/api/db/reserveSession', {
        startTime: anioB+'-'+mesB+'-'+diaB+' '+iniH+':'+iniM+':00',
        endTime: anioB+'-'+mesB+'-'+diaB+' '+finH+':'+finM+':00',
        idBlock: idBlock,
        idPupil: matricula
      });
    }

    function createBlock(id, title, startDate, endDate, location){
      return { id, title, startDate, endDate, location };
    }

    function createSession(horas, minutos) {
      return { horas, minutos };
    }

    if(inicioHora !== undefined){
      var auxHora = parseInt(inicioHora,10);
    }
    if(inicioMin !== undefined){
      var auxMin = parseInt(inicioMin,10);
    }
    if(finHora !== undefined){
      var auxFin = parseInt(finHora,10);
    }
    if(lugarBloque !== undefined){
      var auxLugar = lugarBloque;
    }
    var dataBlock = [];
    var count = 1;
    if(anioB !== undefined){
      var anio = anioB;
    }
    if(mesB !== undefined){
      var mes = mesB;
    }
    if(diaB !== undefined){
      var dia = diaB.split("T")[0];
    }
    var conteo = 1;
    
    while(count <= ((finHora - inicioHora)*4)){
      if(auxMin === 45){
        var valido = false;
        for (var j = 0; j < dataSession.length; j++){
          if (dataSession[j]['horas'] === auxHora){
            if(dataSession[j]['minutos'] === 45){
              valido = true;
              console.log("Adios");
            }
          }
        }
        if(valido === false){
          if(anio !== undefined && mes !== undefined && dia !== undefined){
            console.log("Hola");
            dataBlock.push(createBlock(count,"Tutoría "+count,new Date(anio+"-"+mes+"-"+dia+" "+auxHora+":"+auxMin+":0"),
            new Date(anio+"-"+mes+"-"+dia+" "+(auxHora+1)+":0:0"),auxLugar));
          }
        }
        auxMin = 0;
        auxHora = auxHora + 1;
        count = count + 1;
      } else {
        var valido = false;
        for (var j = 0; j < dataSession.length; j++){
          if (dataSession[j]['horas'] === auxHora){
            if(dataSession[j]['minutos'] === 0 && conteo === 1){
              valido = true;
              conteo = 2;
            } else if(dataSession[j]['minutos'] === 15 && conteo === 2){
              valido = true;
              conteo = 3
            } else if(dataSession[j]['minutos'] === 30 && conteo === 3){
              valido = true;
              conteo = 1;
            }
          }
        }
        if(valido === false){
          if(anio !== undefined && mes !== undefined && dia !== undefined){
            dataBlock.push(createBlock(count,"Tutoría "+count,new Date(anio+"-"+mes+"-"+dia+" "+auxHora+":"+auxMin+":0"),
            new Date(anio+"-"+mes+"-"+dia+" "+auxHora+":"+(auxMin+15)+":0"),auxLugar));
          }
          if(conteo === 3){
            conteo = 1;
          } else {
            conteo = conteo + 1;
          }
        }
        auxMin = auxMin + 15;
        count = count + 1;
      }
    }
    function loadPage(){
      var bloques = document.getElementsByClassName("Appointment-appointment-317");
      console.log(bloques.length);
      if(bloques.length > 0){
        for(var i = 0; i < bloques.length; i++){
          bloques[i].addEventListener("click",function(event){
          });
        }
      }
    }
    window.addEventListener("load", loadPage());
  
    return (
          <Paper>
              <Title>Bloques de tutoría</Title>
              <Scheduler data={dataBlock}>
                  <ViewState currentDate={fechaDate} />
                  <DayView startDayHour={inicioHora} endDayHour={finHora} />
                  <Appointments />
              </Scheduler>
          </Paper>
      );
});

export default Schedule;
