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
import axios from 'axios';
import Cookies from 'universal-cookie';
import utilities from '../../../../utilities';

const cookies = new Cookies();
const Main = memo(props => {
	const classes = props.classes;
	const comenzado = props.comenzado;
	const setComenzado = props.setComenzado;
	const tutorados = props.tutorados;
	const setTutorados = props.setTutorados;
	const tutor = props.tutor;
	const test = props.test;
	const [tutorshipExists, setExists] = React.useState(true);
	const [status, setStatus] = React.useState(0);
	const [connect, setConnect]=React.useState(true);
	const [currentPupil,setCurrentPupil] = React.useState([]);
	const [atendiendo,setAtendiendo] = React.useState(false);
	const [nextPupil, setPupil] = React.useState([]);
	const [verify, setVerify] = React.useState(true);
	const [idTutorship, setTutorship] = React.useState(0);
	const [temas, setTemas]=React.useState('');
	const [finalizar, setFinalizar]=React.useState(false);
	var token = utilities.splitCookie(cookies.get('token')).token;
  	var role = utilities.splitCookie(cookies.get('token')).session;

	const comenzarTutoria = () =>{
		axios.post('http://localhost:5000/api/db/updateTutorshipStatus', {
	      idTutorship: idTutorship,
	      idTutor: tutor,
	      new_status: 1
	    },{
	      headers: { Authorization: token + ";" + role }
	    });
		setPupil(tutorados[0]);
		setStatus(1);
		setComenzado(true);
	}

	const finalizarTutoria = () =>{
		axios.post('http://localhost:5000/api/db/updateTutorshipStatus', {
	      idTutorship: idTutorship,
	      idTutor: tutor,
	      new_status: 2
	    },{
	      headers: { Authorization: token + ";" + role }
	    });
		setPupil(tutorados[0]);
		setStatus(2);
		setComenzado(true);
	}

	const siguienteTutorado=()=>{
	    var tutorados_aux = tutorados;
	    tutorados_aux.splice(0,1);
	    if(tutorados_aux.length == 0){
	    	tutorados_aux.push([]);
	    	setFinalizar(true);
	    }
	    setVerify(true);
	    setPupil(tutorados_aux[0]);
	}

	async function getNextTutorship(){
		if(connect){
			return axios.post('http://localhost:5000/api/db/getNextTutorship', {
		      idTutor: tutor
		    },{
		      headers: { Authorization: token + ";" + role }
		    });
		}
	}

	React.useEffect(()=>{
		setTemas('¿Quería comentar una situación que me está pasando con mi maestro de Estructuras de Datos, porque ya van dos semanas y aún no entrega los resultados de los exámenes parciales');
		if(tutor != 0){
			getNextTutorship()
			.then(result=>{
				if(result.data[0].length){
					var tutorship_aux = result.data[0][0].idTutorship;
					setTutorship(tutorship_aux);
					setStatus(result.data[0][0].status);
					if(status == 1){
						setComenzado(true);
						if(tutorados.length){
							setPupil(tutorados[0]);
							setFinalizar(false);
						}else{
							setFinalizar(true);
						}
						setVerify(true);
					}else{
						setComenzado(false);
					}
					setExists(true);
				}else{
					setExists(false);
				}
			});
		}
	},[tutor, status, tutorshipExists]);

	return (
		<main className={classes.content}>
		    <div className={classes.appBarSpacer} />
		    <Container maxWidth="lg" className={classes.container}>
		      {tutorshipExists ?
		      	<div>
		      	<Grid container spacing={3} justify="flex-end">
		        <Grid item xs={12} md={7} lg={7}>
		        {!comenzado ? <Button
		          	variant="contained"
		          	color="primary"
		          	className={classes.button}
		          	onClick={comenzarTutoria}
		          	>Comenzar</Button>
		          	:[atendiendo ? <CurrentTutorado currentPupil = {currentPupil} setAtendiendo={setAtendiendo}/> : [
		          		finalizar ? <Button
		          	variant="contained"
		          	color="primary"
		          	className={classes.button}
		          	onClick={finalizarTutoria}
		          	>Finalizar Tutoría</Button> : null
		          	]]
		          	}
		        </Grid>
		        <Grid item xs={12} md={5} lg={5}>
		          <NextTutorado
		          	comenzado = {comenzado}
		          	tutorado = {nextPupil}
		          	atendiendo = {atendiendo}
		          	setAtendiendo={setAtendiendo}
		          	next={siguienteTutorado}
		          	setCurrentPupil={setCurrentPupil}
		          	setVerify = {setVerify}
		          	tutorados = {tutorados}
		          	/>
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
		        <Grid item xs={12} md={3} lg={3}>
		          <Paper elevation={0} className={classes.sidebarAboutBox}>
		            <TemasTutorado
		            	temasTutorado={temas}
		            />
		          </Paper>
		        </Grid>
		        <Grid item xs={12} md={5} lg={5}>
		          <Paper className={classes.paper}>
		            <Tutorados
		            	tutorados={tutorados}
		            	verify = {verify}
		            	setVerify = {setVerify}
		            />
		          </Paper>
		        </Grid>
		      </Grid>

		      	</div>
		      :
		      <div>
		      	<label>No hay tutorias proximas, favor de crear una </label>
		      	<Button>Crear tutoría</Button>
		      </div>
		      }
		    </Container>
	  	</main>
	);
});

export default Main;