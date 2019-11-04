import React, { Component } from 'react';
import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';


class Blocks extends Component {

    // Generate Order Data
    createData = (id, career, start, end) => {

        return { id, career, start, end };

    }

    render() {

        var block = this.props.blocks;
        const rows = [];


        for (var i = 0; i < block.length; i++) {

            rows.push(this.createData(block[i]['blockId'], block[i]['careerId'], block[i]['start'], block[i]['end']));

        }

        return (

            <React.Fragment>
                <Typography variant="h6">Bloques</Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Carrera</TableCell>
                            <TableCell>Hora de inicio</TableCell>
                            <TableCell>Hora de finalización</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>{row.career}</TableCell>
                                <TableCell>{row.start}</TableCell>
                                <TableCell>{row.end}</TableCell>
                                <TableCell><Button variant="contained" color="primary">Editar</Button></TableCell>
                                <TableCell><Button variant="contained" color="primary">Eliminar</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </React.Fragment>

        );
    }

}



export default Blocks;