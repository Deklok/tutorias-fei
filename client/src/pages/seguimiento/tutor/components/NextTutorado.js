/* eslint-disable no-script-url */

import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import IconButton from '@material-ui/core/IconButton';
import { green } from '@material-ui/core/colors';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';
import Cookies from 'universal-cookie';
import utilities from '../../../../utilities';

const cookies = new Cookies();

const useStyles = makeStyles(theme => ({
  depositContext: {
    flex: 1,
  },
  paper: {
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  details: {
    display: 'flex',
    alignItems: 'center',
  },
  options: {
    marginLeft: 'auto',
  },
  playIcon: {
    color: green[500]
  },
  textOverlay: {
    color: 'white',
    lineHeight: '97%',
  },
  card: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  mainFeaturedPostContent: {
    position: 'relative',
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(1),
      paddingRight: 0,
    },
  },
  clock: {
    position: 'relative',
    marginLeft: 'auto',
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(1),
      paddingLeft: 0,
    },
  },
}));


const NextTutorado = memo(props => {
  const classes = useStyles();
  const tutorado = props.tutorado;
  const nextPupil = props.nextPupil;
  const comenzado = props.comenzado;
  const setCurrentPupil = props.setCurrentPupil;
  const setAtendiendo = props.setAtendiendo;
  const setTemas = props.setTemas;
  const tutorados = props.tutorados;
  const atendiendo = props.atendiendo;
  const socket = props.socket;
  const pupilReady = props.pupilReady;
  const[connect, setConnect] = React.useState(true);
  const [showPlayButton, setShowPlayButton] = React.useState(props.pupilReady);

  var token = utilities.splitCookie(cookies.get('token')).token;
  var role = utilities.splitCookie(cookies.get('token')).session;

  React.useEffect(()=> {
    console.log("prop to show button changed");
    setShowPlayButton(props.pupilReady)
  },props.pupilReady);

  async function comenzar() {
    if(connect){
      return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/updateStatus', {
        idTutorship: 1,
        idPupil: tutorado['studentId'],
        new_status: 1,
      },{
        headers: { Authorization: token + ";" + role }
      });
    }else{
      return null;
    }
  }

  async function pass() {
    if(connect){
      return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/updateStatus', {
        idTutorship: 1,
        idPupil: tutorado['studentId'],
        new_status: 2,
      },{
        headers: { Authorization: token + ";" + role }
      });
    }else{
      return null;
    }
  }

  function comenzarTutoria(){
    comenzar()
    .then(result=>{
      if(result){
        props.next();
        setCurrentPupil(tutorado);
        setAtendiendo(true);
        setTemas(tutorado['topics']);
        socket.emit("startSession");
      }
    });
  }
  function saltar(){
    notifyStudentYouWereCanceled();
    pass()
    .then(result=>{
      if(result){
        props.next();
      }
    });
  }

  async function notifyStudentYouWereCanceled(){
    axios.post(process.env.REACT_APP_API_SERVER + 'api/notify/student/youwerecanceled', {
        user: tutorado['studentId']
      },{
        headers: { Authorization: token + ";" + role }
      });
  }
  function validate(){
    return !atendiendo && tutorados.length > 0 && tutorados[0].name!=undefined;
  }

  return (
    <React.Fragment>
      <Card className={classes.paper, classes.card}>
        <CardMedia
          component="img"
          alt="Siguiente Tutorado"
          height="140"
          image={process.env.PUBLIC_URL + '/static/next_tutorado.png'}
          title="Siguiente Tutorado"
        />
        <div className={classes.overlay}>
          <Grid container direction="row" justify="space-between">
            <Grid item md={8} xs={6}>
              <div className={classes.mainFeaturedPostContent}>
                <Typography component="h2" variant="h6" className={classes.textOverlay} gutterBottom>
                  Siguiente Tutorado
                </Typography>
              </div>
            </Grid>
            <Grid item md={4} xs={6}>
              {tutorado != undefined ?
                <div className={classes.clock}>
                  <Typography variant="h3" className={classes.textOverlay}>
                    {tutorado['start']}
                  </Typography>
                  <Typography paragraph variant="h5" className={classes.textOverlay}>
                    {tutorado['career_name']}
                  </Typography>
                </div>
                : null
              }
            </Grid>
          </Grid>
        </div>
        <CardContent>
          <div className={classes.details}>
            {tutorado != undefined ?
              <Typography variant="body1" color="text" component="p" noWrap>
                {tutorado['name']}
              </Typography>
              : null
            }
            <div className={classes.options}>
              {comenzado && validate()?
                <div>
                  { pupilReady ? 
                  <Tooltip title="Atender">
                    <IconButton onClick={comenzarTutoria} aria-label="play" size="small">
                      <PlayArrowIcon className={classes.playIcon} />
                    </IconButton>
                  </Tooltip> : null}
                  <Tooltip title="Saltar">
                    <IconButton onClick={saltar} aria-label="skip" size="small">
                      <SkipNextIcon />
                    </IconButton>
                  </Tooltip>
                </div>: null}
            </div>
          </div>
        </CardContent>
      </Card>
    </React.Fragment>
  );
});

export default NextTutorado;