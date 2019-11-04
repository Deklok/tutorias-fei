/* eslint-disable no-script-url */

import React, {memo} from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from '../../../seguimiento/components/Title';

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

function generateTemas(tema) {
  return { tema };
}

const temas = [
  generateTemas('Revisión de materias actuales'),
  generateTemas('Propuesta de materias del siguiente semestre'),
  generateTemas('Retroalimentación de experiencias educativas pasadas'),
  generateTemas('Resolución de dudas'),
];

const Agenda = memo(props =>{
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Agenda</Title>
      <div>
        {temas.map(row => (
            <div className="row">
              <p>{row.tema}</p>
            </div>
          ))}
      </div>
    </React.Fragment>
  );
});

export default Agenda;