/* eslint-disable no-script-url */

import React, { memo } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import 'simple-react-notifications/dist/index.css';


const Indicacion = memo(props => {
    const classes = props.classes;
    const idSession = props.idSession;
    const [indicaciones, setIndications] = React.useState('');

    async function cargarDatos() {
        return axios.post('http://localhost:5000/api/db/getSession', {
          idSession: idSession
        });
      }
    
      cargarDatos()
        .then(result => {
          setIndications(result.data[0][0]['indications']);
        }).catch(console.log);

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
                  <Typography variant="h7" color="inherit">
                  {indicaciones}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Paper>
        </React.Fragment >
    );
});

export default Indicacion;