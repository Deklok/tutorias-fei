import React, { Component, memo } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { IconButton } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';


const Blocks = memo(props => {

    // Generate Order Data
    function createData (id, career, start, end){
        return { id, career, start, end };
    }

    var block = props.blocks;
    const rows = [];
    const classes = props.classes;

    for (var i = 0; i < block.length; i++) {
        rows.push(createData(block[i]['idBlock'], block[i]['idCareer'], block[i]['start'], block[i]['end']));
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
                            <TableCell className={classes.blockCell}><IconButton color="primary" onClick={e => props.editBlock(row.id)}><CreateIcon /></IconButton></TableCell>
                            <TableCell className={classes.blockCell}><IconButton color="primary" onClick={e => props.deleteBlock(row.id)}><DeleteIcon /></IconButton></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </React.Fragment>
    );

});

export default Blocks;