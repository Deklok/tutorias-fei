import React from 'react';
import Title from '../../../seguimiento/components/Title';

function generateTutorias(cubiculo, hora, fecha, contacto) {
  return { cubiculo, hora, fecha, contacto };
}

const tutorias = [
  generateTutorias('Cubículo 30', '10:30', '12/05/2019', 'elrevo@gmail.com')
];
  
  export default function Horario() {
    return (
      <React.Fragment>
        <Title>Datos Generales</Title>
        {tutorias.map(tutoria => (
          <div background-image="url(https://images.unsplash.com/photo-1527187162622-535b785f65f5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1394&q=80)">
            <p>{tutoria.cubiculo}</p>
            <p>{tutoria.hora}</p>
            <p>{tutoria.fecha}</p>
            <p>{tutoria.contacto}</p>
          </div>
        ))}
      </React.Fragment>
    );
  }