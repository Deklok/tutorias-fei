/* eslint-disable no-script-url */

import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { red } from '@material-ui/core/colors';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import StopIcon from '@material-ui/icons/Stop'

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
  stopIcon: {
    color: red[500]
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

const CurrentTutorado = memo(props => {
  const classes = useStyles();
  const currentPupil = props.currentPupil;
  const setAtendiendo = props.setAtendiendo;

  function finalizarTutoria(){
    setAtendiendo(false);
  }

  return (
    <React.Fragment>
      <Card className={classes.paper, classes.card}>
        <CardMedia
          component="img"
          alt="Tutorado Actual"
          height="140"
          image={process.env.PUBLIC_URL + '/static/current_tutorado.png'}
          title="Tutorado Actual"
        />
        <div className={classes.overlay}>
          <Grid container direction="row" justify="space-between">
            <Grid item md={8} xs={6}>
              <div className={classes.mainFeaturedPostContent}>
                <Typography component="h2" variant="h6" className={classes.textOverlay} gutterBottom>
                  Tutorado Actual
                </Typography>
              </div>
            </Grid>
            <Grid item md={4} xs={6}>
              <div className={classes.clock}>
                <Typography paragraph variant="h6" className={classes.textOverlay}>
                  {currentPupil['studentId']}
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
        <CardContent>
          <div className={classes.details}>
            <Typography variant="subtitle1" color="text" component="p" noWrap>
            {currentPupil['name']}
            </Typography>
            <div className={classes.options}>
              <Tooltip title="Finalizar Tutoría">
                <IconButton onClick={finalizarTutoria} aria-label="stop" size="small">
                  <StopIcon className={classes.stopIcon} />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    </React.Fragment>
  );
});

export default CurrentTutorado;