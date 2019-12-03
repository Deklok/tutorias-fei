/* eslint-disable no-script-url */

import React,{memo} from 'react';
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

const TemasTutorado = memo(props=>{
  const temas = props.temasTutorado;
  const classes = useStyles();
  React.useEffect(()=>{},[temas]);
  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" gutterBottom>
        Intereses del Tutorado
      </Typography>
      <Typography>
      {temas}
      </Typography>
    </React.Fragment>
  );
});

export default TemasTutorado;
