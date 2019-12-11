import React, { memo, Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Select } from '@material-ui/core';


const AddBox = memo(props => {
    const selectedInfo = props.editingBlock;
    var career = selectedInfo.idCareer;
    var startTime = selectedInfo.start;
    var endTime = selectedInfo.end;

    const onCareerChange2 = (e) => {
        const id = props.editingBlock.idBlock;
        const career = e.target.value;
        const start = props.editingBlock.start;
        const end = props.editingBlock.end;

        const block = {
            idBlock: id,
            idCareer: career,
            start: start,
            end: end
        }

        props.onChange(block);
    }

    const onStartTimeChange = (e) => {
        e.preventDefault();
        const id = selectedInfo.idBlock;
        const career = selectedInfo.idCareer;
        const value = e.target.value;
        const endTime = selectedInfo.end;

        
        if (value < endTime) {
            const block = {
                idBlock: id,
                idCareer: career,
                start: value,
                end: endTime
            }
    
            props.onChange(block);
        } else if (value === "") {
            e.target.value = startTime;
        } else {
            const block = {
                idBlock: id,
                idCareer: career,
                start: endTime,
                end: endTime
            }
    
            props.onChange(block);
        }
    }

    const onEndTimeChange = (e) => {
        e.preventDefault();
        const id = selectedInfo.idBlock;
        const career = selectedInfo.idCareer;
        const startTime = selectedInfo.start;
        const endTime = e.target.value;

        if (endTime < startTime) {
            alert("La hora de fin no debe ser menor a la de inicio");
            e.target.value = startTime;
        } else if (endTime === "") {
            e.target.value = endTime;
        } else {
            const block = {
                idBlock: id,
                idCareer: career,
                start: startTime,
                end: endTime
            }
    
            props.onChange(block);
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        var isRegistered = false;
        const blocks = props.blocks;
        blocks.forEach(block => {
            if (block.idCareer === career) {
                isRegistered = true;
            }
        });

        if (isRegistered) {
            alert("El bloque de la carrera seleccionada ya ha sido registrado, " +
                "para editarlo, seleccione el ícono de edición para editarlo.")
        } else {
            props.addBlock(career, startTime, endTime);
        }
    }

    return (
        <div>
            <Paper className={props.classes.registryBox}>
                <Typography variant="h5" component="h3" gutterBottom className={props.classes.title}>
                    Añadir bloque.
            </Typography>
                <Select
                    id="outlined-textarea"
                    label="Carrera del bloque"
                    placeholder="Carrera"
                    value={career}
                    multiline
                    margin="normal"
                    variant="outlined"
                    className={props.classes.careerField}
                    onChange={event => onCareerChange2(event)}>
                    <option value="1">Ingeniería de Software</option>
                    <option value="2">Redes</option>
                    <option value="3">Tecnologías Computacionales</option>
                </Select>
                <TextField
                    id="outlined-textarea"
                    label="Inicio"
                    type="time"
                    margin="normal"
                    variant="outlined"
                    className={props.classes.timeField}
                    value={startTime}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 300, // 5 min
                    }}
                    onChange={event => onStartTimeChange(event)}
                />
                <TextField
                    id="outlined-textarea"
                    label="Fin"
                    type="time"
                    margin="normal"
                    variant="outlined"
                    className={props.classes.timeField}
                    value={endTime}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 300, // 5 min
                    }}
                    onChange={event => onEndTimeChange(event)}
                />
                <Button variant="contained"
                    color="primary"
                    className={props.classes.button}
                    onClick={event => onSubmit(event)}>
                    Añadir
            </Button>
            </Paper>
        </div>
    );
});

export default AddBox;