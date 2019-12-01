import React, {memo} from 'react';
import Title from '../../../seguimiento/components/Title';
import axios from 'axios';

const Horario = memo (props =>{

  const classes = props.classes;
  const idSession = props.idSession;
  const [open, setOpen] = React.useState(true);
  const [sessionStart, setSessionStart] = React.useState('');
  const [place, setPlace] = React.useState('');
  const [date, setDate] = React.useState('');

  async function cargarDatos() {
    return axios.post('http://localhost:5000/api/db/getSession', {
      idSession: 9
    });
  }

  cargarDatos()
    .then(result => {
      setSessionStart(result.data[0]['startTime']);
      setPlace(result.data[0]['place']);
      setDate(result.data[0]['date']);
    }).catch(console.log);

  function generateTutorias(cubiculo, hora, fecha) {
    return { cubiculo, hora, fecha };
  }

  const tutorias = [
    generateTutorias(place, sessionStart, date)
  ];
  
  return (
    <React.Fragment>
      <Title>Datos Generales</Title>
      {tutorias.map(tutoria => (
        <div background-image="url(https://images.unsplash.com/photo-1527187162622-535b785f65f5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1394&q=80)">
          <p>{tutoria.cubiculo}</p>
          <p>{tutoria.hora}</p>
          <p>{tutoria.fecha}</p>
        </div>
      ))}
    </React.Fragment>
  );
});

export default Horario;