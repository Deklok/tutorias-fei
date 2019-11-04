/* eslint-disable no-script-url */

import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { red } from '@material-ui/core/colors';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import StopIcon from '@material-ui/icons/Stop'

const useStyles = makeStyles({
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
});


const CurrentTutorado = memo(props => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Card className={classes.paper}>
        <CardMedia
          component="img"
          alt="Student Waiting"
          height="140"
          image="https://images.unsplash.com/photo-1484906468498-4d81f1001881?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80"
          title="Student Waiting"
        />
        <CardContent>
          <div className={classes.details}>
            <Typography variant="subtitle1" color="text" component="p" noWrap>
            Paul McCartney
            </Typography>
            <div className={classes.options}>
              <Tooltip title="Finalizar Tutoría">
                <IconButton aria-label="stop" size="small">
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