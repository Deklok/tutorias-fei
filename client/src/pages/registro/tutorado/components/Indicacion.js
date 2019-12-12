/* eslint-disable no-script-url */

import React, { memo } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Cookies from 'universal-cookie';
import utilities from '../../../../utilities';
import 'simple-react-notifications/dist/index.css';


const Indicacion = memo(props => {
    const classes = props.classes;
    const [indicaciones, setIndications] = React.useState('');

    const cookies = new Cookies();
    var cookie = cookies.get('token');
    var username;
    if (cookie) {
      username = utilities.splitCookie(cookie).id;
    }

    async function cargarDatos() {
        return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getSession', {
          idPupil: username
        });
      }
    
      cargarDatos()
        .then(result => {
          setIndications(result.data[0][0]['indications']);
        }).catch(console.log);

    const texto = "Indicaciones generales para la tutoría:";

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
                    {texto}
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