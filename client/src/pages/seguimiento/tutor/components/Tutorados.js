/* eslint-disable no-script-url */

import React,{memo} from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from '../../components/Title';


const Tutorados = memo(props => {
  // Generate Order Data
  function createData(id, matricula, nombre, horario) {
    return { id, matricula, nombre, horario };
  }
  var tutorados = props.tutorados;
  const rows = [];
  const [lineas, setLineas]=React.useState([]);


  const actualizar = () =>{
    clrtb();
    for (var i = 0; i < tutorados.length; i++) {
      rows.push(createData(i,tutorados[i]['studentId'],tutorados[i]['name'], tutorados[i]['start']));
    }
  }

  const clrtb=()=>{
    for(var i = 0, length1 = rows.length; i < length1; i++){
      rows[i].pop();
    }
  }

  React.useEffect(()=>{
    actualizar();
    setLineas(rows);
  });

  const useStyles = makeStyles(theme => ({
    seeMore: {
      marginTop: theme.spacing(3),
    },
  }));
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
          {lineas.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.matricula}</TableCell>
              <TableCell>{row.nombre}</TableCell>
              <TableCell>{row.horario}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
});

export default Tutorados;
