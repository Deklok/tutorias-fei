import React, {memo} from 'react';
import Title from '../../../seguimiento/components/Title';
import axios from 'axios';

const Horario = memo (props =>{

  const classes = props.classes;
  const idPupil = props.idPupil;
  const [open, setOpen] = React.useState(true);
  const [sessionStart, setSessionStart] = React.useState('');
  const [place, setPlace] = React.useState('');
  const [date, setDate] = React.useState('');
  const [contact, setContact] = React.useState('');

  async function cargarDatos() {
    return axios.post('http://localhost:5000/api/db/getSession', {
      idPupil: idPupil
    });
  }

  cargarDatos()
    .then(result => {
      setSessionStart(result.data[0][0]['startTime']);
      setPlace(result.data[0][0]['place']);
      setDate(result.data[0][0]['date']);
      setContact(result.data[0][0]['contact']);
    }).catch(console.log);

  var fechaInicio = new Date(sessionStart);
  var fechaMuestra = fechaInicio.getHours()+":"+fechaInicio.getMinutes();
  
  return (
    <React.Fragment>
      <Title>Datos Generales</Title>
        <div background-image="url(https://images.unsplash.com/photo-1527187162622-535b785f65f5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1394&q=80)">
          <p>{place}</p>
          <p>{fechaInicio.getHours()+":"+fechaInicio.getMinutes()}</p>
          <p>{date.split("T")[0]}</p>
          <p>{contact}</p>
        </div>
    </React.Fragment>
  );
});

export default Horario;