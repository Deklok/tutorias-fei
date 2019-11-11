import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
<<<<<<< HEAD
import loginImg from '../../../login.jpg';
import logoUv from '../../../Logo-UV2.jpg';
import { Route, Switch } from 'react-router-dom';
=======
import Container from '@material-ui/core/Container';
import loginImg from '../../21513.jpg';
import { Paper } from '@material-ui/core';
>>>>>>> registro-tutor

function Copyright() {

  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundImage: `url(${loginImg})`,
    },
  },
  root: {
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
  },
  container: {
    width: '100%',
    height: '100%',
  },
  paperDiv: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  paper: {
    width: '30%',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    ['@media(max-width: 780px)']: {
      width: '60%',
    },
  },
  avatar: {
    margin: theme.spacing(3),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(4),
  },
  textField: {
    width: '95%',
    marginLeft: 10,
    marginRight: 10,
  },
  submit: {
    margin: theme.spacing(4, 1, 2),
    width: '95%',
  },
}));

export default function SignInS() {

  const classes = useStyles();

  return (
    <div id="root" className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.paperDiv}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Iniciar sesión
        </Typography>
          <form className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              id="plate"
              placeholder="Matrícula"
              name="plate"
              className={classes.textField}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              placeholder="Contraseña"
              type="password"
              id="password"
              className={classes.textField}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
<<<<<<< HEAD
              href="/dashboardinicio"
            >
              Iniciar Sesion
            </Button>
            <Box mt={5}>
              <Copyright />
            </Box>
=======
              component="a"
              href="/registro-bloques"
            >
              Iniciar sesión
          </Button>
>>>>>>> registro-tutor
          </form>
        </div>
      </Paper>
    </div>

  );

}