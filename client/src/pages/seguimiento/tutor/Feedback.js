/* eslint-disable no-script-url */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Feedback() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Feedback</Title>
      <div>
      <Box component="fieldset" mb={3} borderColor="transparent">
        <Typography component="legend">Read only</Typography>
        <Rating value={3} readOnly />
      </Box>
      </div>
    </React.Fragment>
  );
}