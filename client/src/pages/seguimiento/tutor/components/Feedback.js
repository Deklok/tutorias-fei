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
import axios from 'axios';
import Cookies from 'universal-cookie';
import utilities from '../../../../utilities';

const cookies = new Cookies();

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

const PieChart = (props) => {
  return(
      <Chart
      width={'100%'}
      height={'100%'}
      chartType="PieChart"
      loader={<div>Loading Chart</div>}
      data={[
        ['Estado', 'Frecuencia'],
        ['Asistió', props.complete],
        ['Confirmó y no vino', props.absent],
        ['No confirmó', props.missing],
      ]}
      options={{
        pieSliceText: 'label',
      }}
      rootProps={{ 'data-testid': '1' }}
    />
  );
}

const Feedback = memo(props => {
  const classes = useStyles();
  const classes_aux = props.classes;
  const [connect, setConnect] = React.useState(true);
  var token = utilities.splitCookie(cookies.get('token')).token;
  var role = utilities.splitCookie(cookies.get('token')).session;
  const [estrellas, setEstrellas]=React.useState(0);
  const [coment, setComm]=React.useState([]);
  const coment_aux = [];
  const [absent, setAbsent] = React.useState(0);
  const [complete, setComplete] = React.useState(0);
  const [missing, setMissing] = React.useState(0);
  const [total_real, setTotalReal] = React.useState(0);
  const[total, setTotal] = React.useState(0);
  async function cargarFeedback() {
    if(connect){
      return axios.post('http://localhost:5000/api/db/feedback/get', {
        idTutorship: 1,
      },{
        headers: { Authorization: token + ";" + role }
      });
    }else{
      return null;
    }
  }

  function createData(c1) {
    return { c1 };
  }

  const clrtb=()=>{
    for(var i = 0, length1 = coment_aux.length; i < length1; i++){
      coment_aux[i].pop();
    }
  }

  async function actualizar(result){
    if(result && result.length !== 0){
        setEstrellas(result.data.average);
        clrtb();
        coment_aux.push(result.data.c1);
        coment_aux.push(result.data.c2);
        coment_aux.push(result.data.c3);
        coment_aux.push(result.data.c4);
        coment_aux.push(result.data.c5);
      }
  }

  React.useEffect(()=>{
    cargarFeedback()
    .then(result=>{
      if(connect){
        console.log(result)
        actualizar(result);
        setComm(coment_aux);
        setAbsent(result.data.absent);
        setComplete(result.data.complete);
        setTotal(result.data.total);
        if(coment.length != 0){
          setMissing(total - (absent + complete));
          console.log(total, absent, complete, missing);
          setConnect(false);
        }
      }
    })
    .catch(console.log);
  });

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
                        <Rating value={estrellas} size="large" readOnly />
                        <Typography component="legend">{estrellas} Estrellas</Typography>
                      </Box>
                    </div>
                  </React.Fragment>
                </Paper>
              </Grid>
              <Grid item>
                <Paper className={classes_aux.depositContext, classes_aux.paper}>
                  <React.Fragment>
                    <Title>Participación</Title>
                    <PieChart
                     absent={absent}
                     complete = {complete}
                     missing={missing}
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
                    ['Información\nIrrelevante',coment[0]],
                    ['No solucionó\nmis dudas', coment[1]],
                    ['Impuntualidad', coment[2]],
                    ['Larga\nEspera', coment[3]],
                    ['Tiempo\nInsuficiente', coment[4]],
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