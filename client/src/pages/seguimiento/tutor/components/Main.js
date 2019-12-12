import React, { memo } from 'react';
import { Redirect } from 'react-router-dom';
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
import notifier from 'simple-react-notifications';
import io from 'socket.io-client';

const cookies = new Cookies();
const Main = memo(props => {
	const classes = props.classes;
	const comenzado = props.comenzado;
	const setComenzado = props.setComenzado;
	const tutorados = props.tutorados;
	const setTutorados = props.setTutorados;
	const tutor = props.tutor;
	const [tutorshipExists, setExists] = React.useState(true);
	const [indications, setIndications] = React.useState('');
	const [status, setStatus] = React.useState(0);
	const [connect, setConnect]=React.useState(true);
	const [currentPupil,setCurrentPupil] = React.useState([]);
	const [atendiendo,setAtendiendo] = React.useState(false);
	const [nextPupil, setPupil] = React.useState([]);
	const [verify, setVerify] = React.useState(true);
	const [idTutorship, setTutorship] = React.useState(props.idTutorship);
	const [temas, setTemas]=React.useState('');
	const [finalizar, setFinalizar]=React.useState(false);
	const [redirect, setRedirect] = React.useState(false);
	const [socketCurrent, setSocketCurrent] = React.useState();
	const [socketNext, setSocketNext] = React.useState();
	const [pupilReady, setPupilReady] = React.useState(false);
	var token = utilities.splitCookie(cookies.get('token')).token;
	var role = utilities.splitCookie(cookies.get('token')).session;

	const comenzarTutoria = () =>{
		axios.post(process.env.REACT_APP_API_SERVER + 'api/db/updateTutorshipStatus', {
	      idTutorship: idTutorship,
	      idTutor: tutor,
	      new_status: 1
	    },{
	      headers: { Authorization: token + ";" + role }
		});
		if(tutorados.length){
			var tutorados_aux = tutorados;
			setStatus(1);
			setComenzado(true);
			setPupil(tutorados_aux[0]);
			axios.post(process.env.REACT_APP_API_SERVER + 'api/db/updateStatus', {
				idTutorship: idTutorship,
				idPupil: tutorados_aux[0]['studentId'],
				new_status: 11,
			  },{
				headers: { Authorization: token + ";" + role }
			  });

			var socket = io(process.env.REACT_APP_API_SERVER,{
				query: {
				  room: tutorados_aux[0].studentId
				}
			});

			socket.on("connect", () => {
				console.log("Connected to socket.io on new pupil");
			})

			socket.on("pupilReady",() => {
				notifier.success("La sesión ha sido confirmada por el siguiente tutorado", {
					position: "top-right",
					autoClose: 3000
				});
				setPupilReady(true);
				axios.post(process.env.REACT_APP_API_SERVER + 'api/db/updateStatus', {
					idTutorship: idTutorship,
					idPupil: tutorados_aux[0]['studentId'],
					new_status: 12,
				  },{
					headers: { Authorization: token + ";" + role }
				  });
				console.log("event from pupil, is ready");
			});
			socket.emit("nextInLine");
			setSocketNext(socket);
		}else{
			setAtendiendo(true);
			setFinalizar(true);
		}
	}

	const finalizarTutoria = () =>{
		axios.post(process.env.REACT_APP_API_SERVER + 'api/db/updateTutorshipStatus', {
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
		if(tutorados.length == 0){
	    	setTutorados([]);
	    	setFinalizar(true);
	    } else {
			setVerify(true);
			var tutorados_aux = tutorados;
			setPupil(tutorados_aux[0]);
			notifyYouAreNext(tutorados_aux[0].studentId);
			axios.post(process.env.REACT_APP_API_SERVER + 'api/db/updateStatus', {
				idTutorship: idTutorship,
				idPupil: tutorados_aux[0]['studentId'],
				new_status: 11,
			  },{
				headers: { Authorization: token + ";" + role }
			  });

			var socket = io(process.env.REACT_APP_API_SERVER, {
				query: {
					room: tutorados_aux[0].studentId
				}
			});

			socket.on("connect", () => {
				console.log("Connected to socket.io on new pupil");
			})

			socket.on("pupilReady", () => {
				notifier.success("La sesión ha sido confirmada por el siguiente tutorado", {
					position: "top-right",
					autoClose: 3000
				});
				setPupilReady(true);
				axios.post(process.env.REACT_APP_API_SERVER + 'api/db/updateStatus', {
					idTutorship: idTutorship,
					idPupil: tutorados_aux[0]['studentId'],
					new_status: 12,
				  },{
					headers: { Authorization: token + ";" + role }
				  });
				console.log("event from pupil, is ready");
			});
			socket.emit("nextInLine");
			setSocketCurrent(socketNext);
			setSocketNext(socket);
			setPupilReady(false);

			if(tutorados_aux.length == 1){
				tutorados_aux.push([]);
			}
			tutorados_aux.splice(0,1);
		}
	}

	const redirectToCreation = () => {
		setRedirect(true);
	}

	async function getNextTutorship(){
		if(connect){
			return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getNextTutorship', {
		      idTutor: tutor
		    },{
		      headers: { Authorization: token + ";" + role }
		    });
		}
	}
	async function notifyYouAreNext(studentId){
		axios.post(process.env.REACT_APP_API_SERVER +'api/notify/student/youarenext', {
	      user: studentId
	    },{
	      headers: { Authorization: token + ";" + role }
	    });
	}

	async function getPendingSessions(idTutorship) {
		if (connect) {
			return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/getPendingSessions', {
				idTutorship: idTutorship,
			}, {
				headers: { Authorization: token + ";" + role }
			});
		}
	}

	async function cargarTutorados(idTutorship) {
		console.log("cargando sesiones de tutorados");
		return axios.post(process.env.REACT_APP_API_SERVER + 'api/db/sessions', {
		  idTutorship: idTutorship,
		},{
		  headers: { Authorization: token + ";" + role }
		});
	}

	React.useEffect(()=>{
		if(tutor != 0){
			getNextTutorship()
			.then(result=>{
				if (result) {
					if(result.data[0].length){
						var tutorship_aux = result.data[0][0].idTutorship;
						var indications_aux = result.data[0][0].indications;
						setTutorship(tutorship_aux);
						setStatus(result.data[0][0].status);
						setIndications(indications_aux);
						setExists(true);
						cargarTutorados(tutorship_aux).then(result=>{
							if (result) {
								setTutorados(result.data[0]);
							}
						});
					}else{
						setExists(false);
					}
				}
			});
		}
	},[tutor, tutorshipExists]);

	React.useEffect(()=>{
		if (status == 1) {
			console.log(tutorados);
			console.log(verify);
			setComenzado(true);
			getPendingSessions(idTutorship,connect).then(function (result) {
				if (result) {
					if (result.data[0].length) {
						console.log("pending sessions found");
						if (result.data[0].length == 1) {
							var currentPupil = result.data[0][0];
							setCurrentPupil(currentPupil);
							setAtendiendo(true);
							var socket = io(process.env.REACT_APP_API_SERVER,{
								query: {
								  room: currentPupil.studentId
								}
							});
							socket.on("connect", () => {
								console.log("Connected to socket.io on pending session");
							});
							setSocketCurrent(socket);
						} 
						setConnect(false);
					}
				}
				if (tutorados.length) {
					setPupil(tutorados[0]);
					siguienteTutorado();
					setFinalizar(false);
				} else {
					setFinalizar(true);
				}
				setVerify(true);
			});
		} else {
			setComenzado(false);
		}
	},[status, tutorados])

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
		          	>Comenzar Tutoría</Button>
		          	:[atendiendo ? <CurrentTutorado currentSocket = {socketCurrent} currentPupil = {currentPupil} setAtendiendo={setAtendiendo} idTutorship={idTutorship}/> : [
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
					setTemas = {setTemas}
					socket = {socketNext}
					pupilReady = {pupilReady}
					idTutorship={idTutorship}
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
		            {indications}
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
		      	<Button onClick={redirectToCreation}>Crear tutoría</Button>
				{ redirect && <Redirect to='/tutor/registro-bloques'/> }
		      </div>
		      }
		    </Container>
	  	</main>
	);
});

export default Main;