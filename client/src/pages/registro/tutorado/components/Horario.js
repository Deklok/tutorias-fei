import React, {memo} from 'react';
import Title from '../../../seguimiento/components/Title';
import axios from 'axios';
import Cookies from 'universal-cookie';
import utilities from '../../../../utilities';

const Horario = memo (props =>{

  const classes = props.classes;
  const [open, setOpen] = React.useState(true);
  const [sessionStart, setSessionStart] = React.useState('');
  const [place, setPlace] = React.useState('');
  const [date, setDate] = React.useState('');
  const [contact, setContact] = React.useState('');

  const cookies = new Cookies();
  var cookie = cookies.get('token');
  var username;
  if (cookie) {
    username = utilities.splitCookie(cookie).id;
  }

  async function cargarDatos() {
    return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getSession', {
      idPupil: username
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