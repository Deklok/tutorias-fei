import React,{memo} from 'react';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import loginImg from '../../login.jpg';
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit">
        Xahni
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const imagen = [{ 'image': loginImg }];

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${imagen[0].image})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  logoXahni: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '3%',
    marginBottom: '5%',
    textAlign: 'center',
    width: '180px',
    height: '180px',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: '100%',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  /*paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },*/
  fixedHeight: {
    height: 240,
  },
  registryBox: {
    width: "50%",
    height: "50%",
    marginRight: 40,
    marginLeft: 40,
  },
}));

const Inicio = memo(props =>  {

  const classes = useStyles();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState(false);
  const [accountError, setAccountError] = React.useState(false);
  //const [loginState, setLogin] = React.useState(false);
  var token = sessionStorage.getItem("token");
  var content;

  function login(){
    console.log('enviando...');
    if(token == undefined){
      if (username.length < 2 || password.length < 2) {
        setErrors(true);
      } else {
        setErrors(false);
        setAccountError(false);
        // http://localhost:5000/api/user/login
        // http://localhost:5000/api/test/session
        axios.post(process.env.REACT_APP_API_SERVER + 'api/test/session', {
          user: username,
          pass: password,
          withCredentials: true,
        })
          .then((result) => {
            if (result) {
              console.log(result);
              cookies.set('token', 'id=' + username + ';token=' + result.data);
              axios({
                method: 'post',
                url: process.env.REACT_APP_API_SERVER + 'api/auth',
                headers: { Authorization: result.data }
              })
                .then((result) => {
                  cookies.set('token', cookies.get('token') + ';session=' + result.data, { maxAge: 3600 });
                  window.location.reload();
                })
                .catch((err) => {
                  console.log(err);
                });

            }
          })
          .catch((err) => {
            console.log(err);
            if (err.response) {
              if (err.response.status == 404) {
                setAccountError(true);
              }
            }
          });
      }
    }
    console.log('enviado');
  }

  const enter = (event) => {
    if(event.key == "Enter") {
      login();
    }
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
          <img className={classes.logoXahni} src={process.env.PUBLIC_URL + '/static/logo.png'} />
          <Typography component="h1" variant="h5">
            Iniciar Sesion
          </Typography>
          { accountError && <Typography color="error" variant="caption"> Cuenta no existente o contraseña incorrecta. Porfavor compruebe sus datos </Typography> }
          <form className={classes.form} onKeyPress={e=> enter(e)}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              error={errors}
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
              error={errors}
              fullWidth
              className={classes.textField}
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