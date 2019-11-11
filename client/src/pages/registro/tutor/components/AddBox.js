import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Select } from '@material-ui/core';


class AddBox extends Component {

    render() {

        const selectedInfo = this.props.editingBlock;

        this.state = {
            career: selectedInfo.careerId,
            startTime: selectedInfo.start,
            endTime: selectedInfo.end
        }

        return (
            <div>
                <Paper className={this.props.classes.registryBox}>
                    <Typography variant="h5" component="h3" gutterBottom className={this.props.classes.title}>
                        Añadir bloque.
                </Typography>
                    <Select
                        id="outlined-textarea"
                        label="Carrera del bloque"
                        placeholder="Carrera"
                        value={this.state.career}
                        multiline
                        margin="normal"
                        variant="outlined"
                        className={this.props.classes.careerField}
                        onChange={event => this.onCareerChange2(event)}>
                        <option value="Ingeniería de Software">Ingeniería de Software</option>
                        <option value="Redes">Redes</option>
                        <option value="Tecnologías Computacionales">Tecnologías Computacionales</option>
                    </Select>
                    <TextField
                        id="outlined-textarea"
                        label="Inicio"
                        type="time"
                        margin="normal"
                        variant="outlined"
                        className={this.props.classes.timeField}
                        value={this.state.startTime}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                        onChange={event => this.onStartTimeChange(event)}
                    />
                    <TextField
                        id="outlined-textarea"
                        label="Fin"
                        type="time"
                        margin="normal"
                        variant="outlined"
                        className={this.props.classes.timeField}
                        value={this.state.endTime}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                        onChange={event => this.onEndTimeChange(event)}
                    />
                    <Button variant="contained"
                        color="primary"
                        className={this.props.classes.button}
                        onClick={event => this.onSubmit(event)}>
                        Añadir
                </Button>
                </Paper>
            </div>
        );
    }

    onCareerChange2(e) {
        this.setState({ career: e.target.value })
    }

    onStartTimeChange(e) {
        const value = e.target.value;
        const endTime = this.state.endTime;
        if (value > endTime) {
            this.setState({ endTime: value })
            this.setState({ startTime: value });
        } else if (value === "") {
            e.target.value = this.state.startTime;
        } else {
            this.setState({ startTime: value });
        }
    }

    onEndTimeChange(e) {
        const endTime = e.target.value;
        const startTime = this.state.startTime;
        if (endTime < startTime) {
            alert("La hora de fin no debe ser menor a la de inicio");
            e.target.value = startTime;
        } else if (endTime === "") {
            e.target.value = this.state.endTime;
        } else {
            this.setState({ endTime: endTime });
        }
    }

    onSubmit(e) {
        e.preventDefault();
        var isRegistered = false;
        const blocks = this.props.blocks;
        blocks.forEach(block => {
            if (block.careerId === this.state.career) {
                isRegistered = true;
            }
        });

        if (isRegistered) {
            alert("El bloque de la carrera seleccionada ya ha sido registrado, " +
                "para editarlo, seleccione el ícono de edición para editarlo.")
        } else {
            this.setState({
                career: "Ingeniería de Software",
                startTime: "07:30",
                endTime: "07:30"
            });
            this.props.addBlock(this.state.career, this.state.startTime, this.state.endTime);
        }
    }
}

export default AddBox;