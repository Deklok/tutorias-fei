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
];

export default function TemasTutorado() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Intereses del Tutorado
      </Typography>
      <Typography>
        Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit
        amet fermentum. Aenean lacinia bibendum nulla sed consectetur.
      </Typography>
    </React.Fragment>
  );
}
