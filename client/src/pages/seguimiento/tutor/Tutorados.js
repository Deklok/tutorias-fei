/* eslint-disable no-script-url */

import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';

// Generate Order Data
function createData(id, matricula, nombre, horario) {
  return { id, matricula, nombre, horario };
}

const rows = [
  createData(0, 'zS16011702', 'Elvis Presley', '10:30'),
  createData(1, 'zS16011723', 'Paul McCartney', '10:45'),
  createData(2, 'zS17011765', 'Tom Scholz', '11:00'),
  createData(3, 'zS19011732', 'Michael Jackson', '11:15'),
  createData(4, 'zS18011730', 'Bruce Springsteen', '11:30'),
];

const useStyles = makeStyles(theme => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Tutorados() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Tutorados en Espera</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Matrícula</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Horario</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.matricula}</TableCell>
              <TableCell>{row.nombre}</TableCell>
              <TableCell>{row.horario}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="javascript:;">
          See more orders
        </Link>
      </div>
    </React.Fragment>
  );
}
