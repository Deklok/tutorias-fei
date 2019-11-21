/* eslint-disable no-script-url */

import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from '../../components/Title';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { Chart } from "react-google-charts";

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

const Feedback = memo(props => {
  const classes = useStyles();
  const classes_aux = props.classes;
  return (
    <main className={classes_aux.content}>
      <div className={classes_aux.appBarSpacer} />
      <Container maxWidth="lg" className={classes_aux.container}>
        <Grid container direction="row" spacing={3}>
          <Grid item xs={12} md={4} lg={4}>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Paper className={classes_aux.depositContext, classes_aux.paper}>
                  <React.Fragment>
                    <Title>Calificación</Title>
                    <div>
                      <Box component="fieldset" mb={3} borderColor="transparent">
                        <Rating value={3} size="large" readOnly />
                        <Typography component="legend">3 Estrellas</Typography>
                      </Box>
                    </div>
                  </React.Fragment>
                </Paper>
              </Grid>
              <Grid item>
                <Paper className={classes_aux.depositContext, classes_aux.paper}>
                  <React.Fragment>
                    <Title>Participación</Title>
                    <Chart
                      width={'100%'}
                      height={'100%'}
                      chartType="PieChart"
                      loader={<div>Loading Chart</div>}
                      data={[
                        ['Estado', 'Frecuencia'],
                        ['Asistió', 11],
                        ['Confirmó y no vino', 2],
                        ['No confirmó', 2],
                      ]}
                      options={{
                        pieSliceText: 'label',
                      }}
                      rootProps={{ 'data-testid': '1' }}
                    />
                  </React.Fragment>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          {/* Temas Tutorado */}
          <Grid item xs={12} md={8} lg={8}>
            <Paper className={classes_aux.depositContext, classes_aux.paper}>
              <React.Fragment>
                <Title>Observaciones</Title>
                <Chart
                  width={'100%'}
                  height={'100%'}
                  chartType="Bar"
                  loader={<div>Cargando Chart</div>}
                  data={[
                    ['Opción', 'Frecuencia'],
                    ['Información\nIrrelevante', 2],
                    ['No solucionó\nmis dudas', 6],
                    ['Impuntualidad', 1],
                    ['Larga\nEspera', 10],
                    ['Tiempo\nInsuficiente', 4],
                  ]}
                  options={{
                    // Material design options
                    chart: {
                      subtitle: 'Las observaciones son de uso meramente informativo',
                    },
                  }}
                  // For tests
                  rootProps={{ 'data-testid': '2' }}
                />
              </React.Fragment>
            </Paper>
          </Grid>
          {/* Recent Tutorados */}
        </Grid>
      </Container>
    </main>
  );
});

export default Feedback;