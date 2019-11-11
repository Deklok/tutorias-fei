import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


class AddBox extends Component {

    state = {
        career: "Ingeniería de software",
        startTime: "07:30",
        endTime: "07:30"
    }

    render() {

        return (
            <div>
                <Paper>
                    <Typography variant="h5" component="h3">
                        Añadir bloque.
                </Typography>
                    <TextField
                        id="outlined-textarea"
                        label="Carrera del bloque"
                        placeholder="Carrera"
                        multiline
                        margin="normal"
                        variant="outlined"
                        defaultValue={this.state.career}
                        onChange={event => this.onCareerChange(event)}
                    />
                    <TextField
                        id="outlined-textarea"
                        label="Inicio"
                        type="time"
                        margin="normal"
                        variant="outlined"
                        defaultValue={this.state.startTime}
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
                        defaultValue={this.state.endTime}
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
                        onClick={event => this.onSubmit(event)}>
                        Añadir
                </Button>
                </Paper>
            </div>
        );
    }

    onCareerChange(e) {
        this.setState({ career: e.target.value });
    }

    onStartTimeChange(e) {
        this.setState({ startTime: e.target.value });
    }

    onEndTimeChange(e) {
        this.setState({ endTime: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.addBlock(this.state.career, this.state.startTime, this.state.endTime);
        this.setState({
            career: "Ingeniería de software",
            startTime: "07:30",
            endTime: "07:30"
        });
    }
}

export default AddBox;