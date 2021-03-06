import React, {memo} from "react";
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import Title from '../../../seguimiento/components/Title';
import axios from 'axios';
import Cookies from 'universal-cookie';
import utilities from '../../../../utilities';
import { Redirect } from 'react-router-dom';
import {
    Scheduler,
    DayView,
    Appointments
  } from "@devexpress/dx-react-scheduler-material-ui";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

  const Schedule = memo(props => {
  const inicioBloque = props.inicioBloque;
  const finBloque = props.finBloque;
  const bloque = props.bloque;
  const lugar = props.lugar;
  const fecha = props.fecha;
  const matricula = props.matricula;
  const [sessions, setSessions] = React.useState('');
  const [agendarRoute, setAgendarRoute] = React.useState(false);
  const [title, setTitle] = React.useState('Confirmación');
  const [message, setMessage] = React.useState('');
  const [openDialog, setOpenDialog] = React.useState(false);
  const [matriculaR, setMatriculaR] = React.useState('');
  const [bloqueR, setBloqueR] = React.useState('');
  const [fechaFIR, setFechaFIR] = React.useState('');
  const [horaFIR, setHoraFIR] = React.useState('');
  const [fechaFFR, setFechaFFR] = React.useState('');
  const [horaFFR, setHoraFFR] = React.useState('');
  const cookies = new Cookies();

  const redirectToAgendar = () => {
    setAgendarRoute(true);
  }

  async function getSessions() {
    if(bloque){
      return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getBlockSessions', {
        idBlock: bloque
      });
    }
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
  },[bloque]);

  var dataSession = [];

  if(sessions.length > 0){
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
    var finHora = parseInt(finBloque.split(":")[0],10);
    finHora = finHora + 1;
  }

    async function reservarSesion(matricula, idBlock, fechaI, horaI, fechaF, horaF){
      return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/reserveSession', {
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
      var makeStyleNumber = 413;
      var bloques = document.getElementsByClassName("makeStyles-appointment-"+makeStyleNumber);
      if(bloques.length == 0){
        while(bloques.length == 0 && makeStyleNumber <= 460){
          makeStyleNumber = makeStyleNumber + 1;
          bloques = document.getElementsByClassName("makeStyles-appointment-"+makeStyleNumber);
        }
      }
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
                      setMatriculaR(matricula);
                      setBloqueR(bloque);
                      setFechaFIR(fechaFI);
                      setHoraFIR(horaFI);
                      setFechaFFR(fechaFF);
                      setHoraFFR(horaFF);
                      setMessage('Seleccionaste la hora ' + horaFI + ' del día ' + fechaFI + '\n ¿Esa es tú elección?');
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
                        setMatriculaR(matricula);
                        setBloqueR(bloque);
                        setFechaFIR(fechaFI);
                        setHoraFIR(horaFI);
                        setFechaFFR(fechaFF);
                        setHoraFFR(horaFF);
                        setMessage('Seleccionaste la hora ' + horaFI + ' del día ' + fechaFI + '\n ¿Esa es tú elección?');
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
                        setMatriculaR(matricula);
                        setBloqueR(bloque);
                        setFechaFIR(fechaFI);
                        setHoraFIR(horaFI);
                        setFechaFFR(fechaFF);
                        setHoraFFR(horaFF);
                        setMessage('Seleccionaste la hora ' + horaFI + ' del día ' + fechaFI + '\n ¿Esa es tú elección?');
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
    var texto;

    if(anioB !== undefined && mesB !== undefined && diaB !== undefined){
      texto = "La tutoría será el día "+ diaB.split("T")[0] + " del mes " + mesB + " del " + anioB;
    }

    const okDialog = (e) => {
      if(matriculaR,bloqueR,fechaFIR,fechaFFR,horaFFR,horaFIR){
        reservarSesion(matriculaR,bloqueR,fechaFIR,horaFIR,fechaFFR,horaFFR).then(response => {
          var sessionReserved = response;
          idSession = sessionReserved.data;
        });
        redirectToAgendar();
      }
    }
    
    const closeDialog = (e) => {
      setOpenDialog(false);
    }

    return (
      <div>
        <Paper>
          {agendarRoute && <Redirect to="/tutorado/agendar"/>}
          <Title>{texto}</Title>
          <p>Seleccione un bloque de tutoría, cada bloque cuenta con 15 minutos de duración.</p>
            <Scheduler data={dataBlock} locale="es-MX">
                <ViewState currentDate={fechaDate} />
                <DayView startDayHour={inicioHora} endDayHour={finHora} />
                <Appointments />
            </Scheduler>
        </Paper>
        <Dialog open={openDialog}>
              <div id="dialogError">
                  <DialogTitle >
                      {title}
                  </DialogTitle>
                  <DialogContentText>
                      {message}
                  </DialogContentText>
                  <Button id="acceptBtn" onClick={okDialog}>Aceptar</Button>
                  <Button id="cancelBtn" onClick={closeDialog}>Cancelar</Button>
              </div>
          </Dialog>
      </div>
    );
});

export default Schedule;
