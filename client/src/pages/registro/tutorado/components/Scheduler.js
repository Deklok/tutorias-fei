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

const Schedule = memo(props => {
  const inicioBloque = props.inicioBloque;
  const finBloque = props.finBloque;
  const bloque = props.bloque;
  const lugar = props.lugar;
  const fecha = props.fecha;
  const matricula = props.matricula;
  const [open, setOpen] = React.useState(true);
  const [sessions, setSessions] = React.useState('');

  async function getSessions() {
    return axios.post('http://localhost:5000/api/db/getBlockSessions', {
      idBlock: 19
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

  if(sessions.length > 0){
    for(var i = 0; i < sessions.length; i++){
      var da = new Date(sessions[i]['startTime']);
      console.log(da);
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
  }

    async function reservarSesion(matricula, idBlock, fechaI, horaI, fechaF, horaF){
      return axios.post('http://localhost:5000/api/db/reserveSession', {
        startTime: fechaI+" "+horaI,
        endTime: fechaF+" "+horaF,
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
    if(lugarBloque !== undefined){
      var auxLugar = lugarBloque;
    }
    var dataBlock = [];
    if(anioB !== undefined){
      var anio = anioB;
    }
    if(mesB !== undefined){
      var mes = mesB;
    }
    if(diaB !== undefined){
      var dia = diaB.split("T")[0];
    }
    
    var count = 1;
    var valido = false;

    while(count <= (((finHora - inicioHora)*4)+1)){
      if(auxMin === 45){
        valido = false;
        for (var p = 0; p < dataSession.length; p++){
          if (dataSession[p]['horas'] === auxHora){
            if(dataSession[p]['minutos'] === 45){
              valido = true;
            }
          }
        }
        if(valido === false){
          if(anio !== undefined && mes !== undefined && dia !== undefined){
            dataBlock.push(createBlock(count,"Tutoría "+count,new Date(anio+"-"+mes+"-"+dia+" "+auxHora+":"+auxMin+":0"),
            new Date(anio+"-"+mes+"-"+dia+" "+(auxHora+1)+":0:0"),auxLugar));
          }
        }
        auxMin = 0;
        auxHora = auxHora + 1;
        count = count + 1;
      } else {
        valido = false;
        for (var j = 0; j < dataSession.length; j++){
          if(dataSession[j]['horas']+":"+dataSession[j]['minutos'] === auxHora+":"+auxMin){
            valido = true;
          } else if(dataSession[j]['horas']+":"+dataSession[j]['minutos'] === auxHora+":"+auxMin){
            valido = true;
          } else if(dataSession[j]['horas']+":"+dataSession[j]['minutos'] === auxHora+":"+auxMin){
            valido = true;
          }
        }
        if(valido === false){
          if(anio !== undefined && mes !== undefined && dia !== undefined){
            dataBlock.push(createBlock(count,"Tutoría "+count,new Date(anio+"-"+mes+"-"+dia+" "+auxHora+":"+auxMin+":0"),
            new Date(anio+"-"+mes+"-"+dia+" "+auxHora+":"+(auxMin+15)+":0"),auxLugar));
          }
        }
        auxMin = auxMin + 15;
        count = count + 1;
      }
    }

    var idSession;
    
    function loadPage(){
      var bloques = document.getElementsByClassName("makeStyles-appointment-447");
      if(bloques.length > 0){
        for(var i = 0; i < bloques.length; i++){
          bloques[i].addEventListener("click",function(event){
            var string = event.srcElement.childElementCount;
            if(string === 2){
              var datoHora = parseInt(event.srcElement.childNodes[1].childNodes[0].data.split(":")[0],10);
              var datoMinuto = parseInt(event.srcElement.childNodes[1].childNodes[0].data.split(":")[1],10);
              if(dataBlock.length > 0){
                for(var i = 0; i < dataBlock.length; i++){
                  if(dataBlock[i]['startDate'].getHours() === datoHora && dataBlock[i]['startDate'].getMinutes() === datoMinuto){
                    var horaF = dataBlock[i]['endDate'].getHours();
                    var minF = dataBlock[i]['endDate'].getMinutes();
                    var horaI = dataBlock[i]['startDate'].getHours();
                    var minI = dataBlock[i]['startDate'].getMinutes();
                    if(anioB !== undefined && mesB !== undefined && diaB !== undefined && matricula !== undefined && bloque !== undefined){
                      var formatoUTCF = anioB+'-'+mesB+'-'+diaB+' '+horaF+':'+minF+':00';
                      var divisionF = formatoUTCF.split("T");
                      var fechaFF = divisionF[0];
                      var horaFF = divisionF[1].split(" ")[1];
                      var formatoUTCI = anioB+'-'+mesB+'-'+diaB+' '+horaI+':'+minI+':00';
                      var divisionI = formatoUTCI.split("T");
                      var fechaFI = divisionI[0];
                      var horaFI = divisionI[1].split(" ")[1];
                      reservarSesion(matricula,bloque,fechaFI,horaFI,fechaFF,horaFF).then(response => {
                        var sessionReserved = response;
                        idSession = sessionReserved.data;
                        console.log(idSession);
                      });
                      window.location = "/tutorado/dashboard-fin";
                    }
                  }
                }
              }
            }else{
              var dato = event.srcElement.childNodes[0].textContent;
              if(dato.split(" ")[0] === "Tutoría"){
                if(dataBlock.length > 0){
                  for(var i = 0; i < dataBlock.length; i++){
                    if (dataBlock[i]['title'] === dato){
                      var horaF = dataBlock[i]['endDate'].getHours();
                      var minF = dataBlock[i]['endDate'].getMinutes();
                      var horaI = dataBlock[i]['startDate'].getHours();
                      var minI = dataBlock[i]['startDate'].getMinutes();
                      if(anioB !== undefined && mesB !== undefined && diaB !== undefined && matricula !== undefined && bloque !== undefined){
                        var formatoUTCF = anioB+'-'+mesB+'-'+diaB+' '+horaF+':'+minF+':00';
                        var divisionF = formatoUTCF.split("T");
                        var fechaFF = divisionF[0];
                        var horaFF = divisionF[1].split(" ")[1];
                        var formatoUTCI = anioB+'-'+mesB+'-'+diaB+' '+horaI+':'+minI+':00';
                        var divisionI = formatoUTCI.split("T");
                        var fechaFI = divisionI[0];
                        var horaFI = divisionI[1].split(" ")[1];
                        reservarSesion(matricula,bloque,fechaFI,horaFI,fechaFF,horaFF).then(response => {
                          var sessionReserved = response;
                          idSession = sessionReserved.data;
                          console.log(idSession);
                        });
                        window.location = "/tutorado/dashboard-fin";
                      }
                    }
                  }
                }
              }else{
                var datoSimple = dato.split(" ");
                var datoHora = parseInt(datoSimple[0].split(":")[0],10);
                var datoMinuto = parseInt(datoSimple[0].split(":")[1],10);
                if(dataBlock.length > 0){
                  for(var i = 0; i < dataBlock.length; i++){
                    if(dataBlock[i]['startDate'].getHours() === datoHora && dataBlock[i]['startDate'].getMinutes() === datoMinuto){
                      var horaF = dataBlock[i]['endDate'].getHours();
                      var minF = dataBlock[i]['endDate'].getMinutes();
                      var horaI = dataBlock[i]['startDate'].getHours();
                      var minI = dataBlock[i]['startDate'].getMinutes();
                      if(anioB !== undefined && mesB !== undefined && diaB !== undefined && matricula !== undefined && bloque !== undefined){
                        var formatoUTCF = anioB+'-'+mesB+'-'+diaB+' '+horaF+':'+minF+':00';
                        var divisionF = formatoUTCF.split("T");
                        var fechaFF = divisionF[0];
                        var horaFF = divisionF[1].split(" ")[1];
                        var formatoUTCI = anioB+'-'+mesB+'-'+diaB+' '+horaI+':'+minI+':00';
                        var divisionI = formatoUTCI.split("T");
                        var fechaFI = divisionI[0];
                        var horaFI = divisionI[1].split(" ")[1];
                        reservarSesion(matricula,bloque,fechaFI,horaFI,fechaFF,horaFF).then(response => {
                          var sessionReserved = response;
                          idSession = sessionReserved.data;
                          console.log(idSession);
                        });
                        window.location = "/tutorado/dashboard-fin";
                      }
                    }
                  }
                }
              }
            }
          });
        }
      }
    }
    window.onload = loadPage();

    return (
          <Paper>
              <Title>Bloques de tutoría</Title>
              <Scheduler data={dataBlock} locale="es-MX">
                  <ViewState currentDate={fechaDate} />
                  <DayView startDayHour={inicioHora} endDayHour={finHora} />
                  <Appointments />
              </Scheduler>
          </Paper>
      );
});

export default Schedule;
