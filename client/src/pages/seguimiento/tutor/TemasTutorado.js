/* eslint-disable no-script-url */

import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

function generateTemas(tema) {
  return { tema };
}

const temas = [
  generateTemas('Ver formas de titulación'),
  generateTemas('Problemas con maestro fulano'),

];

export default function TemasTutorado() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Temas propuestos por el estudiante</Title>
      <div>
        {temas.map(row => (
            <div className="row">
              <p>{row.tema}</p>
            </div>
          ))}
      </div>
    </React.Fragment>
  );
}
