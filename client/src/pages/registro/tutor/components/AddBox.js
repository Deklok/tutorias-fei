import React, { memo, Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Select } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';


const AddBox = memo(props => {

    const [openDialog, setOpenDialog] = React.useState(false);
    const [title, setTitle] = React.useState("");
    const [message, setMessage] = React.useState("");

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
            setTitle("Inconcistencia en horarios");
            setMessage("La hora de fin no debe ser menor a la de inicio");
            setOpenDialog(true);
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
            setTitle("Bloque duplicado");
            setMessage("El bloque de la carrera seleccionada ya ha sido registrado, " +
            "para editarlo, seleccione el ícono de edición para editarlo.");
            setOpenDialog(true);
        } else {
            props.addBlock(career, startTime, endTime);
        }
    }

    const closeDialogError = (e) => {
        setOpenDialog(false);
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
            <Dialog open={openDialog}>
                <div id="dialogError">
                    <DialogTitle >
                        {title}
                    </DialogTitle>
                    <DialogContentText>
                        {message}
                    </DialogContentText>
                    <Button id="acceptBtn" onClick={closeDialogError}>Aceptar</Button>
                </div>
            </Dialog>
        </div>
    );
});

export default AddBox;