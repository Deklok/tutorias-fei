import React,{memo, useEffect} from 'react';
import { Redirect } from 'react-router-dom';
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
import BlockRegistry from '../tutor/BlocksRegistry';
import axios from 'axios';

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

const Inicio = memo(props =>  {

  const classes = useStyles();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  //const [loginState, setLogin] = React.useState(false);
  var token = sessionStorage.getItem("token");
  var content;

  function login(){
    console.log('enviando...');
    if(token == undefined){ 
      // http://localhost:5000/api/user/login
      axios.post('http://localhost:5000/api/test/session',{
          user: username,
          pass: password,
          withCredentials: true,
        })
        .then((result)=>{
          if(result){
            console.log(result);
            axios({
              method: 'post',
              url: 'http://localhost:5000/api/auth',
              data: {
                session: result.data
              }
            })
            .then((result)=>{
              console.log(result);
              sessionStorage.setItem("token", result);
              window.location.reload();
            })
            .catch((err)=>{
              console.log(err);
            });

          }
        })
        .catch((err)=>{
          console.log(err);
        });
    }
    console.log('enviado');
  }

  if (token != undefined) {
    content = <Redirect to="/" />;
  } else {
    content = 
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <img className={classes.logoUv} src={logoUv} />
          <Typography component="h1" variant="h5">
            Iniciar sesión
        </Typography>
          <form className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="matricula"
              label="Matrícula"
              name="matricula"
              autoComplete="matricula"
              value = {username}
              onChange={e=>setUsername(e.target.value)}
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
              name="contrasenia"
              label="Contraseña"
              id="standard-password-input"
              autoComplete="current-password"
              value = {password}
              onChange={e=>setPassword(e.target.value)}
            />
             <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => login()}
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
      </Grid>
    </Grid>;
  }

  return (
    <div>
      { content }
    </div>
  );
});

export default Inicio;