/* eslint-disable no-script-url */

import React, {memo} from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextareaAutosize from 'react-textarea-autosize';

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
      <TextareaAutosize
        minRows = "4"
        maxRows = "6"
      />
    </React.Fragment>
  );
}