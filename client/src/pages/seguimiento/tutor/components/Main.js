import React, { memo } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CurrentTutorado from './CurrentTutorado';
import NextTutorado from './NextTutorado';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Agenda from '../../components/Agenda';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Tutorados from './Tutorados';
import TemasTutorado from '../../components/TemasTutorado';

const Main = memo(props => {
	const classes = props.classes;
	const comenzado = props.comenzado;
	const setComenzado = props.setComenzado;
	const tutorados = props.tutorados;
	const setTutorados = props.setTutorados;
	const test = props.test;
	const [currentPupil,setCurrentPupil] = React.useState([]);
	const [atendiendo,setAtendiendo] = React.useState(false);
	const [nextPupil, setPupil] = React.useState([]);
	const comenzarTutoria = () =>{
		setPupil(tutorados[0]);
		setComenzado(true);
	}

	const siguienteTutorado=()=>{
		tutorados.pop();
		setTutorados(tutorados);
	}

	return (
		<main className={classes.content}>
		    <div className={classes.appBarSpacer} />
		    <Container maxWidth="lg" className={classes.container}>
		      <Grid container spacing={3} justify="flex-end">
		        {/* Tutoria Controles */}
		        <Grid item xs={12} md={7} lg={7}>
		          {!comenzado ? <Button
		          	variant="contained"
		          	color="primary"
		          	className={classes.button}
		          	onClick={comenzarTutoria}
		          	>Comenzar Tutoría</Button>
		          	:[atendiendo ? <CurrentTutorado currentPupil = {currentPupil} setAtendiendo={setAtendiendo}/> : null]
		          	}
		        </Grid>
		        <Grid item xs={12} md={5} lg={5}>
		          <NextTutorado comenzado = {comenzado} tutorado = {nextPupil} setAtendiendo={setAtendiendo} next={siguienteTutorado} setCurrentPupil={setCurrentPupil}/>
		        </Grid>
		      </Grid>
		      <Grid container spacing={3}>
		        {/* Agenda */}
		        <Grid item xs={12} md={4} lg={4}>
		          <Typography component="h2" variant="h6" gutterBottom>
		            Agenda
		            </Typography>
		          <Divider />
		          <Agenda className={classes.markdown}>
		            {test}
		          </Agenda>
		        </Grid>
		        {/* Temas Tutorado */}
		        <Grid item xs={12} md={3} lg={3}>
		          <Paper elevation={0} className={classes.sidebarAboutBox}>
		            <TemasTutorado />
		          </Paper>
		        </Grid>
		        {/* Recent Tutorados */}
		        <Grid item xs={12} md={5} lg={5}>
		          <Paper className={classes.paper}>
		            <Tutorados
		            	tutorados={tutorados}
		            />
		          </Paper>
		        </Grid>
		      </Grid>
		    </Container>
	  	</main>
	);
});

export default Main;