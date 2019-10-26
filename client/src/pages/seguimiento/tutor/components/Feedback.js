/* eslint-disable no-script-url */

import React, {memo} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from '../../components/Title';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

const Feedback = memo(props =>{
  const classes = useStyles();
  const classes_aux = props.classes;
  return (
    <main className={classes_aux.content}>
      <div className={classes_aux.appBarSpacer} />
      <Container maxWidth="xs" className={classes_aux.container}>
        <Paper className={classes.depositContext, classes_aux.paper}>
          <React.Fragment>
            <Title>Feedback</Title>
            <div>
            <Box component="fieldset" mb={3} borderColor="transparent">
              <Typography component="legend">Read only</Typography>
              <Rating value={3} size="large" readOnly />
            </Box>
            </div>
          </React.Fragment>
        </Paper>
      </Container>
    </main>
  );
});

export default Feedback;