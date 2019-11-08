/* eslint-disable no-script-url */

import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link'


const Banner = memo(props => {
    const classes = props.classes;
    return (
        <React.Fragment>
            {/* Main featured post */}
          <Paper className={classes.mainFeaturedPost}>
            {/* Increase the priority of the hero background image */}
            {
              <img
                style={{ display: 'none' }}
                src="https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1334&q=80"
                alt="background"
              />
            }
            <div className={classes.overlay} />
            <Grid container>
              <Grid item md={6}>
                <div className={classes.mainFeaturedPostContent}>
                  <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                    Primera Tutoría
                  </Typography>
                  <Typography variant="h7" color="inherit" style={{overflow: "hidden", textOverflow: "ellipsis", height: '12rem', display: 'inline-block'}}>
                  Detalles de Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500 ...
                  Detalles de Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500 ...
                  Detalles de Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500 ...
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Paper>
        </React.Fragment >
    );
});

export default Banner;