import React, { Component } from 'react';
import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Button, IconButton } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';


class Blocks extends Component {

    // Generate Order Data
    createData = (id, career, start, end) => {

        return { id, career, start, end };

    }

    render() {

        var block = this.props.blocks;
        const rows = [];
        const classes = this.props.classes;


        for (var i = 0; i < block.length; i++) {

            rows.push(this.createData(block[i]['blockId'], block[i]['careerId'], block[i]['start'], block[i]['end']));

        }

        return (

            <React.Fragment>
                <Typography variant="h6">Bloques</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.blockCell}>Carrera</TableCell>
                            <TableCell className={classes.blockCell}>Hora de inicio</TableCell>
                            <TableCell className={classes.blockCell}>Hora de finalización</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row => (
                            <TableRow key={row.id}>
                                <TableCell className={classes.blockCell}>{row.career}</TableCell>
                                <TableCell className={classes.blockCell}>{row.start}</TableCell>
                                <TableCell className={classes.blockCell}>{row.end}</TableCell>
                                <TableCell className={classes.blockCell}><IconButton color="primary" onClick={e => this.props.editBlock(row.id)}><CreateIcon /></IconButton></TableCell>
                                <TableCell className={classes.blockCell}><IconButton color="primary" onClick={e => this.props.deleteBlock(row.id)}><DeleteIcon /></IconButton></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </React.Fragment>

        );
    }

}



export default Blocks;